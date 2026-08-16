import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nwntlwuqjndtqawmmysy.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_cxmSCcJrXXrDQ7O2Oxyoow_q39b97kP";

export const supabase = createClient(supabaseUrl, supabaseKey);
