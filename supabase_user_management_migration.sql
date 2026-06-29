-- =========================================================
-- USER MANAGEMENT MODULE MIGRATION FOR BUIQ
-- =========================================================

-- 1. Update RLS policies on profiles table to allow Admins to update user profiles (roles, full name)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (
    public.is_admin()
  );

-- 2. Create function to fetch all users (joins auth.users and public.profiles)
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

-- 3. Create function to toggle user banned status (Enable/Disable account)
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

-- 4. Create function to perform soft delete on user account
-- Deletes the customer record (which cascades to delete orders)
-- Disables the login and prefixes profile name with [Deleted]
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
