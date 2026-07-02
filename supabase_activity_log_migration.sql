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

-- Modifikasi RPC delete_user_account untuk mencatat aktivitas Soft Delete
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
