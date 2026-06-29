-- =========================================================
-- SUPABASE POSTGRESQL MIGRATION FOR BUIQ (COMBINED)
-- =========================================================

-- Disable trigger on auth.users for recreate safety
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing tables if they exist (for clean rerun)
-- NOTE: Dropping tables CASCADE automatically removes any triggers attached to them (e.g. on_order_change on public.orders)
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.update_customer_stats();

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name text NOT NULL,
    role text NOT NULL CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CUSTOMERS TABLE
CREATE TABLE public.customers (
    id serial PRIMARY KEY,
    customer_code text UNIQUE,
    full_name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    address text DEFAULT '',
    status text NOT NULL CHECK (status IN ('Active', 'VIP', 'Inactive')) DEFAULT 'Active',
    total_spent numeric(15, 2) DEFAULT 0.00 NOT NULL CHECK (total_spent >= 0),
    total_orders integer DEFAULT 0 NOT NULL CHECK (total_orders >= 0),
    points integer DEFAULT 0 NOT NULL CHECK (points >= 0),
    membership_tier text DEFAULT 'Bronze' NOT NULL CHECK (membership_tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE public.products (
    id serial PRIMARY KEY,
    product_code text UNIQUE NOT NULL,
    product_name text NOT NULL,
    category text NOT NULL,
    price numeric(15, 2) NOT NULL CHECK (price >= 0),
    stock integer NOT NULL CHECK (stock >= 0),
    image_url text,
    status text NOT NULL CHECK (status IN ('Available', 'Low Stock', 'Out of Stock')) DEFAULT 'Available',
    reward_points integer DEFAULT 0 NOT NULL CHECK (reward_points >= 0),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE public.orders (
    id serial PRIMARY KEY,
    order_number text UNIQUE NOT NULL,
    customer_id integer REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    product_id integer REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity integer DEFAULT 1 NOT NULL CHECK (quantity > 0),
    total_price numeric(15, 2) NOT NULL CHECK (total_price >= 0),
    status text NOT NULL CHECK (status IN ('Pending', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    order_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON public.orders(product_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(product_code);

-- =========================================================
-- TRIGGERS & FUNCTIONS
-- =========================================================

-- Trigger to automatically create profile and customer row on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role text;
  v_full_name text;
  v_customer_code text;
  v_cust_id int;
BEGIN
  -- Determine role: admin@buiq.com is admin, others are members
  IF new.email = 'admin@buiq.com' THEN
    v_role := 'admin';
  ELSE
    v_role := 'member';
  END IF;

  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  -- Insert profile
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, v_full_name, v_role)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

  -- If the user is a member, automatically create a customer record
  IF v_role = 'member' THEN
    -- Get next ID from sequence atomically to build unique customer code
    v_cust_id := nextval('public.customers_id_seq');
    v_customer_code := 'CUST-' || LPAD(v_cust_id::text, 4, '0');

    INSERT INTO public.customers (id, customer_code, full_name, email, phone, status, total_spent, total_orders)
    VALUES (v_cust_id, v_customer_code, v_full_name, new.email, '', 'Active', 0, 0)
    ON CONFLICT (email) DO UPDATE
    SET full_name = EXCLUDED.full_name;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update customer spent, orders, points, and tier statistics when orders are modified (CRM)
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

  -- Also handle case where customer_id was updated (recalculate for old customer)
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

CREATE TRIGGER on_order_change
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_crm_stats();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Helper function to check if the authenticated user is an admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Admins can select all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    public.is_admin()
  );

CREATE POLICY "Users can select own profile" ON public.profiles
  FOR SELECT TO authenticated USING (
    id = auth.uid()
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (
    id = auth.uid()
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (
    public.is_admin()
  );

-- Customers Policies
CREATE POLICY "Admins have full access to customers" ON public.customers
  FOR ALL TO authenticated USING (
    public.is_admin()
  );

CREATE POLICY "Members can select own customer record" ON public.customers
  FOR SELECT TO authenticated USING (
    email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Members can update own customer record" ON public.customers
  FOR UPDATE TO authenticated USING (
    email = auth.jwt() ->> 'email'
  );

-- Products Policies
CREATE POLICY "Admins have full access to products" ON public.products
  FOR ALL TO authenticated USING (
    public.is_admin()
  );

CREATE POLICY "Members can select products" ON public.products
  FOR SELECT TO authenticated USING (
    TRUE
  );

-- Orders Policies
CREATE POLICY "Admins have full access to orders" ON public.orders
  FOR ALL TO authenticated USING (
    public.is_admin()
  );

CREATE POLICY "Members can select own orders" ON public.orders
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = orders.customer_id
      AND customers.email = auth.jwt() ->> 'email'
    )
  );

-- =========================================================
-- SEED DATA
-- =========================================================

-- Insert mock customers
INSERT INTO public.customers (id, customer_code, full_name, email, phone, address, status, total_spent, total_orders) VALUES
(1, 'CUST-0001', 'Alya Putri', 'alya@gmail.com', '0812-9988-5543', 'Jl. Sudirman No. 21, Jakarta', 'Active', 850000, 1),
(2, 'CUST-0002', 'Rizky Pratama', 'rizky@gmail.com', '0813-1234-5678', 'Jl. Kemang Raya No. 45, Jakarta', 'VIP', 3600000, 1),
(3, 'CUST-0003', 'Nadia Azzahra', 'nadia@gmail.com', '0821-8765-4321', 'Jl. Dago No. 102, Bandung', 'Inactive', 1250000, 1),
(4, 'CUST-0004', 'Kevin Wijaya', 'kevin@gmail.com', '0857-1111-2222', 'Jl. Gatsu No. 89, Surabaya', 'Active', 0, 1),
(5, 'CUST-0005', 'Salsa Nabila', 'salsa@gmail.com', '0878-3333-4444', 'Jl. Malioboro No. 5, Yogyakarta', 'VIP', 1800000, 1)
ON CONFLICT (id) DO NOTHING;

-- Fix sequence value for customers id
SELECT setval('public.customers_id_seq', COALESCE((SELECT MAX(id) FROM public.customers), 1));

-- Insert mock products
INSERT INTO public.products (id, product_code, product_name, category, price, stock, image_url, status, reward_points) VALUES
(1, 'PRD-0001', 'Silk Dress', 'Dress', 850000, 50, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200', 'Available', 50),
(2, 'PRD-0002', 'Nike Sneakers', 'Shoes', 1250000, 8, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', 'Low Stock', 100),
(3, 'PRD-0003', 'Leather Bag', 'Bag', 1800000, 15, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200', 'Available', 150),
(4, 'PRD-0004', 'Oversized Hoodie', 'Outer', 450000, 0, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200', 'Out of Stock', 30)
ON CONFLICT (id) DO NOTHING;

-- Fix sequence value for products id
SELECT setval('public.products_id_seq', COALESCE((SELECT MAX(id) FROM public.products), 1));

-- Insert mock orders
INSERT INTO public.orders (id, order_number, customer_id, product_id, quantity, total_price, status, order_date) VALUES
(1, 'ORD-0001', 1, 1, 1, 850000, 'Completed', '2026-06-10'),
(2, 'ORD-0002', 2, 3, 2, 3600000, 'Completed', '2026-06-15'),
(3, 'ORD-0003', 3, 2, 1, 1250000, 'Pending', '2026-06-20'),
(4, 'ORD-0004', 4, 1, 1, 850000, 'Cancelled', '2026-06-22'),
(5, 'ORD-0005', 5, 3, 1, 1800000, 'Completed', '2026-06-25')
ON CONFLICT (id) DO NOTHING;

-- Fix sequence value for orders id
SELECT setval('public.orders_id_seq', COALESCE((SELECT MAX(id) FROM public.orders), 1));

-- Re-sync customers statistics & loyalty tiers after mock data insert
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

-- =========================================================
-- USER MANAGEMENT MODULE RPC FUNCTIONS
-- =========================================================

-- Create function to fetch all users (joins auth.users and public.profiles)
CREATE OR REPLACE FUNCTION public.get_users()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamp with time zone,
  banned_until timestamp with time zone
) 
SECURITY DEFINER
AS $$
BEGIN
  -- Access check: Only allow admins to call this RPC
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    COALESCE(p.full_name, '') as full_name,
    COALESCE(p.role, 'member') as role,
    u.created_at,
    u.banned_until
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to toggle user banned status (Enable/Disable account)
CREATE OR REPLACE FUNCTION public.toggle_user_status(user_id uuid, ban boolean)
RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  -- Access check: Only allow admins to call this RPC
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  -- Prevent self-banning
  IF user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot enable/disable your own account.';
  END IF;

  IF ban THEN
    UPDATE auth.users
    SET banned_until = '3000-01-01 00:00:00+00'::timestamp with time zone
    WHERE id = user_id;
  ELSE
    UPDATE auth.users
    SET banned_until = NULL
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to perform soft delete on user account
CREATE OR REPLACE FUNCTION public.delete_user_account(user_id uuid)
RETURNS void
SECURITY DEFINER
AS $$
DECLARE
  v_email text;
BEGIN
  -- Access check: Only allow admins to call this RPC
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  -- Prevent self-deletion
  IF user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own account.';
  END IF;

  -- Get user email
  SELECT email INTO v_email FROM auth.users WHERE id = user_id;

  -- Delete customer record by email (cascades to orders)
  IF v_email IS NOT NULL THEN
    DELETE FROM public.customers WHERE email = v_email;
  END IF;

  -- Soft delete auth user: set banned_until to future and prefix profile name
  UPDATE auth.users
  SET banned_until = '3000-01-01 00:00:00+00'::timestamp with time zone
  WHERE id = user_id;

  UPDATE public.profiles
  SET full_name = '[Deleted] ' || full_name
  WHERE id = user_id AND NOT full_name LIKE '[Deleted]%';
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- INITIAL ADMIN PROFILE SYNC (FIXED: INSERT ON CONFLICT)
-- =========================================================

-- Insert profile for the existing admin account if it exists in auth.users
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Admin Utama', 'admin'
FROM auth.users
WHERE email = 'admin@buiq.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', full_name = 'Admin Utama';
