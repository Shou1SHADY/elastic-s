import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://logewufqgmgxufkovpuw.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_CJThoPoiT_PiCSKSmQkBHg_wAPhuYiV";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
