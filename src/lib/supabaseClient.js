import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dyalwdtkozidpbsnddtn.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_XOUoX0uZ_P7OvKrJtxZrVw_gg429ew3";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);