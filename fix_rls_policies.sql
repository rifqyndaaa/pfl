-- =========================================================
-- RLS POLICY FIXES FOR BUIQ SYSTEM
-- Run this in your Supabase SQL Editor
-- =========================================================

-- 1. Open SELECT access on products so both Guests (anon) and Members (authenticated) can see them
DROP POLICY IF EXISTS "Members can select products" ON public.products;
DROP POLICY IF EXISTS "Allow public select access on products" ON public.products;

CREATE POLICY "Allow public select access on products"
ON public.products
FOR SELECT
TO public
USING (true);


-- 2. Allow authenticated users to insert their own customer record if missing
DROP POLICY IF EXISTS "Members can insert own customer record" ON public.customers;

CREATE POLICY "Members can insert own customer record"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (email = auth.jwt() ->> 'email');


-- 3. Allow public (anonymous + authenticated) users to write to activity_logs
-- This prevents RLS violations during signup, login, and signout logs
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Allow public insert access on activity logs" ON public.activity_logs;

CREATE POLICY "Allow public insert access on activity logs"
ON public.activity_logs
FOR INSERT
TO public
WITH CHECK (true);
