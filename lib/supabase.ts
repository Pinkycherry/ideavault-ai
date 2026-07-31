import { createClient } from '@supabase/supabase-js';

// Direct, fail-safe connection to your Supabase project
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://jqzadwobnfypmytcbpkw.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'PASTE_YOUR_COPIED_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
