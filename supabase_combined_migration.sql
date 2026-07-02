-- =========================================================
-- SUPABASE POSTGRESQL MIGRATION FOR BUIQ (COMBINED)
-- =========================================================

-- Disable trigger on auth.users for recreate safety
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing tables if they exist (for clean rerun)
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;

DROP FUNCTION IF EXISTS public.update_customer_stats();
DROP FUNCTION IF EXISTS public.update_customer_crm_stats();

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
  IF new.email = 'admin@buiq.com' THEN
    v_role := 'admin';
  ELSE
    v_role := 'member';
  END IF;

  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, v_full_name, v_role)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

  IF v_role = 'member' THEN
    v_cust_id := nextval('public.customers_id_seq');
    v_customer_code := 'CUST-' || LPAD(v_cust_id::text, 4, '0');

    INSERT INTO public.customers (id, customer_code, full_name, email, phone, status, total_spent, total_orders, points, membership_tier)
    VALUES (v_cust_id, v_customer_code, v_full_name, new.email, '', 'Active', 0, 0, 0, 'Bronze')
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
  IF TG_OP = 'DELETE' THEN
    v_customer_id := OLD.customer_id;
  ELSE
    v_customer_id := NEW.customer_id;
  END IF;

  -- Recalculate completed statistics
  SELECT count(*) INTO v_total_orders
  FROM public.orders
  WHERE customer_id = v_customer_id AND status = 'Completed';

  SELECT COALESCE(sum(total_price), 0.00) INTO v_total_spent
  FROM public.orders
  WHERE customer_id = v_customer_id AND status = 'Completed';

  SELECT COALESCE(sum(o.quantity * p.reward_points), 0) INTO v_points
  FROM public.orders o
  JOIN public.products p ON o.product_id = p.id
  WHERE o.customer_id = v_customer_id AND o.status = 'Completed';

  -- Tier Mapping
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
  WHERE id = v_customer_id;

  -- Also handle case where customer_id was updated on an order
  IF TG_OP = 'UPDATE' AND OLD.customer_id <> NEW.customer_id THEN
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

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Admins can select all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Users can select own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (public.is_admin());

-- Customers Policies
CREATE POLICY "Admins have full access to customers" ON public.customers
  FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Members can select own customer record" ON public.customers
  FOR SELECT TO authenticated USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Members can update own customer record" ON public.customers
  FOR UPDATE TO authenticated USING (email = auth.jwt() ->> 'email');

-- Products Policies
CREATE POLICY "Admins have full access to products" ON public.products
  FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Members can select products" ON public.products
  FOR SELECT TO authenticated USING (TRUE);

-- Orders Policies
CREATE POLICY "Admins have full access to orders" ON public.orders
  FOR ALL TO authenticated USING (public.is_admin());

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
INSERT INTO public.customers (id, customer_code, full_name, email, phone, address, status, total_spent, total_orders, points, membership_tier) VALUES
(1, 'CUST-0001', 'Alya Putri', 'alya@gmail.com', '0812-9988-5543', 'Jl. Sudirman No. 21, Jakarta', 'Active', 850000, 1, 50, 'Bronze'),
(2, 'CUST-0002', 'Rizky Pratama', 'rizky@gmail.com', '0813-1234-5678', 'Jl. Kemang Raya No. 45, Jakarta', 'Active', 3600000, 1, 300, 'Silver'),
(3, 'CUST-0003', 'Nadia Azzahra', 'nadia@gmail.com', '0821-8765-4321', 'Jl. Dago No. 102, Bandung', 'Inactive', 1250000, 1, 100, 'Silver'),
(4, 'CUST-0004', 'Kevin Wijaya', 'kevin@gmail.com', '0857-1111-2222', 'Jl. Gatsu No. 89, Surabaya', 'Active', 0, 1, 0, 'Bronze'),
(5, 'CUST-0005', 'Salsa Nabila', 'salsa@gmail.com', '0878-3333-4444', 'Jl. Malioboro No. 5, Yogyakarta', 'Active', 1800000, 1, 150, 'Silver')
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.customers_id_seq', COALESCE((SELECT MAX(id) FROM public.customers), 1));

-- Insert mock products (with reward points added)
INSERT INTO public.products (id, product_code, product_name, category, price, stock, image_url, status, reward_points) VALUES
(1, 'PRD-0001', 'Silk Dress', 'Dress', 850000, 50, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200', 'Available', 50),
(2, 'PRD-0002', 'Nike Sneakers', 'Shoes', 1250000, 8, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', 'Low Stock', 100),
(3, 'PRD-0003', 'Leather Bag', 'Bag', 1800000, 15, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200', 'Available', 150),
(4, 'PRD-0004', 'Oversized Hoodie', 'Outer', 450000, 0, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200', 'Out of Stock', 30)
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.products_id_seq', COALESCE((SELECT MAX(id) FROM public.products), 1));

-- Insert mock orders
INSERT INTO public.orders (id, order_number, customer_id, product_id, quantity, total_price, status, order_date) VALUES
(1, 'ORD-0001', 1, 1, 1, 850000, 'Completed', '2026-06-10'),
(2, 'ORD-0002', 2, 3, 2, 3600000, 'Completed', '2026-06-15'),
(3, 'ORD-0003', 3, 2, 1, 1250000, 'Pending', '2026-06-20'),
(4, 'ORD-0004', 4, 1, 1, 850000, 'Cancelled', '2026-06-22'),
(5, 'ORD-0005', 5, 3, 1, 1800000, 'Completed', '2026-06-25')
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.orders_id_seq', COALESCE((SELECT MAX(id) FROM public.orders), 1));

-- Recalculate statistics for mock data
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT id FROM public.customers LOOP
    UPDATE public.customers c
    SET 
      total_orders = (SELECT count(*) FROM public.orders o WHERE o.customer_id = c.id AND o.status = 'Completed'),
      total_spent = COALESCE((SELECT sum(total_price) FROM public.orders o WHERE o.customer_id = c.id AND o.status = 'Completed'), 0.00),
      points = COALESCE((SELECT sum(o.quantity * p.reward_points) FROM public.orders o JOIN public.products p ON o.product_id = p.id WHERE o.customer_id = c.id AND o.status = 'Completed'), 0)
    WHERE c.id = r.id;

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
DECLARE
  v_user_email text;
  v_admin_id uuid;
  v_admin_name text;
  v_admin_role text;
BEGIN
  -- Access check
  v_admin_id := auth.uid();
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = v_admin_id AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  IF user_id = v_admin_id THEN
    RAISE EXCEPTION 'You cannot enable/disable your own account.';
  END IF;

  SELECT email INTO v_user_email FROM auth.users WHERE id = user_id;
  SELECT full_name, role INTO v_admin_name, v_admin_role FROM public.profiles WHERE id = v_admin_id;

  IF ban THEN
    UPDATE auth.users
    SET banned_until = '3000-01-01 00:00:00+00'::timestamp with time zone
    WHERE id = user_id;

    -- Catat log nonaktifkan
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_admin_id, COALESCE(v_admin_name, 'Admin'), COALESCE(v_admin_role, 'admin'), 'User Management', 'Nonaktifkan User', 'Menonaktifkan akses pengguna: ' || COALESCE(v_user_email, user_id::text), user_id::text);
  ELSE
    UPDATE auth.users
    SET banned_until = NULL
    WHERE id = user_id;

    -- Catat log aktifkan
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_admin_id, COALESCE(v_admin_name, 'Admin'), COALESCE(v_admin_role, 'admin'), 'User Management', 'Aktifkan User', 'Mengaktifkan kembali akses pengguna: ' || COALESCE(v_user_email, user_id::text), user_id::text);
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
  v_admin_id uuid;
  v_admin_name text;
  v_admin_role text;
BEGIN
  -- Access check
  v_admin_id := auth.uid();
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = v_admin_id AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  IF user_id = v_admin_id THEN
    RAISE EXCEPTION 'You cannot delete your own account.';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = user_id;
  SELECT full_name, role INTO v_admin_name, v_admin_role FROM public.profiles WHERE id = v_admin_id;

  -- Delete customer record by email (cascades to orders)
  IF v_email IS NOT NULL THEN
    DELETE FROM public.customers WHERE email = v_email;
  END IF;

  -- Soft delete auth user
  UPDATE auth.users
  SET banned_until = '3000-01-01 00:00:00+00'::timestamp with time zone
  WHERE id = user_id;

  UPDATE public.profiles
  SET full_name = '[Deleted] ' || full_name
  WHERE id = user_id AND NOT full_name LIKE '[Deleted]%';

  -- Catat log soft delete
  INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
  VALUES (v_admin_id, COALESCE(v_admin_name, 'Admin'), COALESCE(v_admin_role, 'admin'), 'User Management', 'Hapus User', 'Melakukan soft-delete dan memblokir login untuk: ' || COALESCE(v_email, user_id::text), user_id::text);
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- INITIAL ADMIN PROFILE SYNC (FIXED: INSERT ON CONFLICT)
-- =========================================================

INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Admin Utama', 'admin'
FROM auth.users
WHERE email = 'admin@buiq.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', full_name = 'Admin Utama';


-- =========================================================
-- MIGRATION: ACTIVITY LOG MODULE
-- =========================================================

-- 1. Create Tabel activity_logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name text NOT NULL,
    user_role text NOT NULL,
    module text NOT NULL,
    activity text NOT NULL,
    description text NOT NULL,
    reference_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing untuk mempercepat filter dan pencarian
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON public.activity_logs(module);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_name ON public.activity_logs(user_name);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan RLS (Policy)
-- Hanya Admin yang boleh membaca (SELECT) logs
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_logs;
CREATE POLICY "Admins can view activity logs" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Pengguna terautentikasi dapat menambahkan (INSERT) logs (untuk login/logout/voucher)
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON public.activity_logs;
CREATE POLICY "Authenticated users can insert activity logs" ON public.activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- UPDATE dan DELETE dikosongkan (secara default ditolak) untuk menjamin kekekalan Audit Trail.

-- 4. Trigger & Helper Functions untuk Otomatisasi Log di Database

-- A. Trigger untuk Tabel Products
CREATE OR REPLACE FUNCTION public.log_product_activity()
RETURNS trigger AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_user_role text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NOT NULL THEN
    SELECT full_name, role INTO v_user_name, v_user_role FROM public.profiles WHERE id = v_user_id;
  ELSE
    v_user_name := 'System';
    v_user_role := 'system';
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Product', 'Tambah Produk', 'Menambahkan produk baru: ' || NEW.product_name || ' (Code: ' || NEW.product_code || ')', NEW.id::text);
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Product', 'Edit Produk', 'Mengubah data produk: ' || NEW.product_name || ' (Code: ' || NEW.product_code || ')', NEW.id::text);
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Product', 'Hapus Produk', 'Menghapus produk: ' || OLD.product_name || ' (Code: ' || OLD.product_code || ')', OLD.id::text);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_product ON public.products;
CREATE TRIGGER trigger_log_product
AFTER INSERT OR UPDATE OR DELETE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.log_product_activity();


-- B. Trigger untuk Tabel Customers
CREATE OR REPLACE FUNCTION public.log_customer_activity()
RETURNS trigger AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_user_role text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NOT NULL THEN
    SELECT full_name, role INTO v_user_name, v_user_role FROM public.profiles WHERE id = v_user_id;
  ELSE
    v_user_name := 'System';
    v_user_role := 'system';
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Customer', 'Tambah Customer', 'Menambahkan customer baru: ' || NEW.full_name || ' (Code: ' || NEW.customer_code || ')', NEW.id::text);
  ELSIF TG_OP = 'UPDATE' THEN
    -- 1. Deteksi Perubahan Profil Utama
    IF (OLD.full_name <> NEW.full_name OR OLD.email <> NEW.email OR OLD.phone <> NEW.phone OR OLD.address <> NEW.address OR OLD.status <> NEW.status) THEN
      INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
      VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Customer', 'Edit Customer', 'Mengubah profil customer: ' || NEW.full_name || ' (Code: ' || NEW.customer_code || ')', NEW.id::text);
    END IF;

    -- 2. Deteksi Perubahan Point (Membership)
    IF OLD.points <> NEW.points THEN
      INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
      VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Membership', 
        CASE WHEN NEW.points > OLD.points THEN 'Point bertambah' ELSE 'Point berkurang' END, 
        'Poin customer ' || NEW.full_name || ' ' || (CASE WHEN NEW.points > OLD.points THEN 'bertambah ' || (NEW.points - OLD.points) ELSE 'berkurang ' || (OLD.points - NEW.points) END) || ' poin. Total saat ini: ' || NEW.points, 
        NEW.id::text);
    END IF;

    -- 3. Deteksi Perubahan Tier (Membership)
    IF OLD.membership_tier <> NEW.membership_tier THEN
      INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
      VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Membership', 'Membership Tier berubah', 
        'Membership tier customer ' || NEW.full_name || ' berubah dari ' || OLD.membership_tier || ' menjadi ' || NEW.membership_tier, 
        NEW.id::text);
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Customer', 'Hapus Customer', 'Menghapus customer: ' || OLD.full_name || ' (Code: ' || OLD.customer_code || ')', OLD.id::text);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_customer ON public.customers;
CREATE TRIGGER trigger_log_customer
AFTER INSERT OR UPDATE OR DELETE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.log_customer_activity();


-- C. Trigger untuk Tabel Orders
CREATE OR REPLACE FUNCTION public.log_order_activity()
RETURNS trigger AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_user_role text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NOT NULL THEN
    SELECT full_name, role INTO v_user_name, v_user_role FROM public.profiles WHERE id = v_user_id;
  ELSE
    v_user_name := 'System';
    v_user_role := 'system';
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Orders', 'Tambah Order', 'Membuat pesanan baru ' || NEW.order_number || ' senilai Rp ' || to_char(NEW.total_price, 'FM999,999,999'), NEW.id::text);
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status <> NEW.status THEN
      IF NEW.status = 'Completed' THEN
        INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
        VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Orders', 'Status Order berubah menjadi Completed', 'Status pesanan ' || NEW.order_number || ' diselesaikan (Completed)', NEW.id::text);
      ELSIF NEW.status = 'Cancelled' THEN
        INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
        VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Orders', 'Status Order berubah menjadi Cancelled', 'Status pesanan ' || NEW.order_number || ' dibatalkan (Cancelled)', NEW.id::text);
      ELSE
        INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
        VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Orders', 'Edit Order', 'Mengubah status pesanan ' || NEW.order_number || ' menjadi ' || NEW.status, NEW.id::text);
      END IF;
    ELSE
      INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
      VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Orders', 'Edit Order', 'Mengubah detail pesanan: ' || NEW.order_number, NEW.id::text);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'Orders', 'Hapus Order', 'Menghapus pesanan: ' || OLD.order_number, OLD.id::text);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_order ON public.orders;
CREATE TRIGGER trigger_log_order
AFTER INSERT OR UPDATE OR DELETE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.log_order_activity();


-- D. Trigger untuk Tabel Profiles (User Management & Register)
CREATE OR REPLACE FUNCTION public.log_profile_activity()
RETURNS trigger AS $$
DECLARE
  v_user_id uuid;
  v_user_name text;
  v_user_role text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NOT NULL THEN
    SELECT full_name, role INTO v_user_name, v_user_role FROM public.profiles WHERE id = v_user_id;
  ELSE
    v_user_name := 'System';
    v_user_role := 'system';
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- Pendaftaran akun baru
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (NEW.id, NEW.full_name, NEW.role, 'User', 'Register', 'Pengguna baru ' || NEW.full_name || ' mendaftar dengan hak akses ' || NEW.role, NEW.id::text);
  ELSIF TG_OP = 'UPDATE' THEN
    -- Deteksi Perubahan Role
    IF OLD.role <> NEW.role THEN
      INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
      VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'User Management', 'Ubah Role', 'Mengubah role ' || NEW.full_name || ' dari ' || OLD.role || ' menjadi ' || NEW.role, NEW.id::text);
    -- Deteksi Perubahan Nama Profil
    ELSIF OLD.full_name <> NEW.full_name AND NOT NEW.full_name LIKE '[Deleted]%' THEN
      INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
      VALUES (v_user_id, COALESCE(v_user_name, 'System'), COALESCE(v_user_role, 'system'), 'User Management', 'Edit User', 'Mengubah nama profil dari ' || OLD.full_name || ' menjadi ' || NEW.full_name, NEW.id::text);
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_profile ON public.profiles;
CREATE TRIGGER trigger_log_profile
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.log_profile_activity();


-- E. Injeksi Pencatatan Audit Trail ke dalam Fungsi RPC User Management Eksisting

-- Modifikasi RPC toggle_user_status untuk mencatat aktivitas Ban/Unban
CREATE OR REPLACE FUNCTION public.toggle_user_status(user_id uuid, ban boolean)
RETURNS void
SECURITY DEFINER
AS $$
DECLARE
  v_user_email text;
  v_admin_id uuid;
  v_admin_name text;
  v_admin_role text;
BEGIN
  -- Access check
  v_admin_id := auth.uid();
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = v_admin_id AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  IF user_id = v_admin_id THEN
    RAISE EXCEPTION 'You cannot enable/disable your own account.';
  END IF;

  SELECT email INTO v_user_email FROM auth.users WHERE id = user_id;
  SELECT full_name, role INTO v_admin_name, v_admin_role FROM public.profiles WHERE id = v_admin_id;

  IF ban THEN
    UPDATE auth.users
    SET banned_until = '3000-01-01 00:00:00+00'::timestamp with time zone
    WHERE id = user_id;

    -- Catat log nonaktifkan
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_admin_id, COALESCE(v_admin_name, 'Admin'), COALESCE(v_admin_role, 'admin'), 'User Management', 'Nonaktifkan User', 'Menonaktifkan akses pengguna: ' || COALESCE(v_user_email, user_id::text), user_id::text);
  ELSE
    UPDATE auth.users
    SET banned_until = NULL
    WHERE id = user_id;

    -- Catat log aktifkan
    INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
    VALUES (v_admin_id, COALESCE(v_admin_name, 'Admin'), COALESCE(v_admin_role, 'admin'), 'User Management', 'Aktifkan User', 'Mengaktifkan kembali akses pengguna: ' || COALESCE(v_user_email, user_id::text), user_id::text);
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
  v_admin_id uuid;
  v_admin_name text;
  v_admin_role text;
BEGIN
  -- Access check
  v_admin_id := auth.uid();
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = v_admin_id AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  IF user_id = v_admin_id THEN
    RAISE EXCEPTION 'You cannot delete your own account.';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = user_id;
  SELECT full_name, role INTO v_admin_name, v_admin_role FROM public.profiles WHERE id = v_admin_id;

  -- Delete customer record by email (cascades to orders)
  IF v_email IS NOT NULL THEN
    DELETE FROM public.customers WHERE email = v_email;
  END IF;

  -- Soft delete auth user
  UPDATE auth.users
  SET banned_until = '3000-01-01 00:00:00+00'::timestamp with time zone
  WHERE id = user_id;

  UPDATE public.profiles
  SET full_name = '[Deleted] ' || full_name
  WHERE id = user_id AND NOT full_name LIKE '[Deleted]%';

  -- Catat log soft delete
  INSERT INTO public.activity_logs (user_id, user_name, user_role, module, activity, description, reference_id)
  VALUES (v_admin_id, COALESCE(v_admin_name, 'Admin'), COALESCE(v_admin_role, 'admin'), 'User Management', 'Hapus User', 'Melakukan soft-delete dan memblokir login untuk: ' || COALESCE(v_email, user_id::text), user_id::text);
END;
$$ LANGUAGE plpgsql;
