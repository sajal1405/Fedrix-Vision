// src/utils/supabase.js
// Re-export the single Supabase client instance to avoid multiple
// GoTrueClient warnings when the app is loaded in the browser.
import { supabase } from '../supabaseClient';

export default supabase;
