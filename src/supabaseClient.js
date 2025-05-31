// src/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

// Fetch env variables with FEDRIX prefix
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate presence of both keys
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase credentials are missing in your .env file.");
  throw new Error("Supabase URL or ANON KEY is undefined.");
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
