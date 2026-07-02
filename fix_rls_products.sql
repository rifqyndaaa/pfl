-- Disable the authenticated-only select policy
DROP POLICY IF EXISTS "Members can select products" ON public.products;

-- Create a new public select policy so both Guests (anon) and Members (authenticated) can see product images and information
CREATE POLICY "Allow public select access on products"
ON public.products
FOR SELECT
TO public
USING (true);
