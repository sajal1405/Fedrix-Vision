// src/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

// ✅ Read environment variables correctly for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Error handling
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase credentials (check .env and deployment variables)");
  throw new Error("Supabase credentials not found.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
