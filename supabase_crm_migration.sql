-- =========================================================
-- CRM & LOYALTY MEMBERSHIP REWARDS SYSTEM MIGRATION
-- =========================================================

-- 1. Add reward_points to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS reward_points integer NOT NULL DEFAULT 0 CHECK (reward_points >= 0);

-- 2. Add points and membership_tier to customers table
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS points integer NOT NULL DEFAULT 0 CHECK (points >= 0);

ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS membership_tier text NOT NULL DEFAULT 'Bronze' 
CHECK (membership_tier IN ('Bronze', 'Silver', 'Gold', 'Platinum'));

-- 3. Drop old orders trigger and stats function
DROP TRIGGER IF EXISTS on_order_change ON public.orders;
DROP FUNCTION IF EXISTS public.update_customer_stats();

-- 4. Create new trigger function to automatically update CRM stats on order change
CREATE OR REPLACE FUNCTION public.update_customer_crm_stats()
RETURNS trigger AS $$
DECLARE
  v_customer_id integer;
  v_points integer;
  v_total_spent numeric(15,2);
  v_total_orders integer;
  v_tier text;
BEGIN
  -- Determine which customer ID needs recalculation
  IF TG_OP = 'DELETE' THEN
    v_customer_id := OLD.customer_id;
  ELSE
    v_customer_id := NEW.customer_id;
  END IF;

  -- Calculate total completed orders
  SELECT count(*) INTO v_total_orders
  FROM public.orders
  WHERE customer_id = v_customer_id AND status = 'Completed';

  -- Calculate total spent on completed orders
  SELECT COALESCE(sum(total_price), 0.00) INTO v_total_spent
  FROM public.orders
  WHERE customer_id = v_customer_id AND status = 'Completed';

  -- Calculate total loyalty points from completed orders (reward_points of product * order quantity)
  SELECT COALESCE(sum(o.quantity * p.reward_points), 0) INTO v_points
  FROM public.orders o
  JOIN public.products p ON o.product_id = p.id
  WHERE o.customer_id = v_customer_id AND o.status = 'Completed';

  -- Determine Membership Tier based on points
  -- Bronze: 0 - 99 points
  -- Silver: 100 - 499 points
  -- Gold: 500 - 999 points
  -- Platinum: 1000+ points
  IF v_points >= 1000 THEN
    v_tier := 'Platinum';
  ELSIF v_points >= 500 THEN
    v_tier := 'Gold';
  ELSIF v_points >= 100 THEN
    v_tier := 'Silver';
  ELSE
    v_tier := 'Bronze';
  END IF;

  -- Update the customer's CRM columns
  UPDATE public.customers
  SET total_orders = v_total_orders,
      total_spent = v_total_spent,
      points = v_points,
      membership_tier = v_tier
  WHERE id = v_customer_id;

  -- Also handle case where customer_id was updated on an order (recalculate for old customer)
  IF TG_OP = 'UPDATE' AND OLD.customer_id <> NEW.customer_id THEN
    -- Recalculate for OLD customer
    SELECT count(*) INTO v_total_orders
    FROM public.orders
    WHERE customer_id = OLD.customer_id AND status = 'Completed';

    SELECT COALESCE(sum(total_price), 0.00) INTO v_total_spent
    FROM public.orders
    WHERE customer_id = OLD.customer_id AND status = 'Completed';

    SELECT COALESCE(sum(o.quantity * p.reward_points), 0) INTO v_points
    FROM public.orders o
    JOIN public.products p ON o.product_id = p.id
    WHERE o.customer_id = OLD.customer_id AND o.status = 'Completed';

    IF v_points >= 1000 THEN
      v_tier := 'Platinum';
    ELSIF v_points >= 500 THEN
      v_tier := 'Gold';
    ELSIF v_points >= 100 THEN
      v_tier := 'Silver';
    ELSE
      v_tier := 'Bronze';
    END IF;

    UPDATE public.customers
    SET total_orders = v_total_orders,
        total_spent = v_total_spent,
        points = v_points,
        membership_tier = v_tier
    WHERE id = OLD.customer_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach the trigger to public.orders
CREATE TRIGGER on_order_change
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_crm_stats();

-- 6. Seed mock products with reward points
UPDATE public.products SET reward_points = 50 WHERE id = 1;
UPDATE public.products SET reward_points = 100 WHERE id = 2;
UPDATE public.products SET reward_points = 150 WHERE id = 3;
UPDATE public.products SET reward_points = 30 WHERE id = 4;

-- 7. Force initial recalculation of CRM stats and Tiers for existing customers
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT id FROM public.customers LOOP
    UPDATE public.customers c
    SET 
      total_orders = (
        SELECT count(*) FROM public.orders o WHERE o.customer_id = c.id AND o.status = 'Completed'
      ),
      total_spent = COALESCE(
        (SELECT sum(total_price) FROM public.orders o WHERE o.customer_id = c.id AND o.status = 'Completed'), 
        0.00
      ),
      points = COALESCE(
        (SELECT sum(o.quantity * p.reward_points) 
         FROM public.orders o 
         JOIN public.products p ON o.product_id = p.id 
         WHERE o.customer_id = c.id AND o.status = 'Completed'), 
        0
      )
    WHERE c.id = r.id;

    -- Update tier based on points
    UPDATE public.customers c
    SET membership_tier = CASE 
      WHEN points >= 1000 THEN 'Platinum'
      WHEN points >= 500 THEN 'Gold'
      WHEN points >= 100 THEN 'Silver'
      ELSE 'Bronze'
    END
    WHERE c.id = r.id;
  END LOOP;
END;
$$;
