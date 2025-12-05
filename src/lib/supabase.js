import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sgmbuwgtfyefupdyoehw.supabase.co"; // Paste Project URL aici
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnbWJ1d2d0ZnllZnVwZHlvZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3ODk1MjAsImV4cCI6MjA4MDM2NTUyMH0.wdc5pKuyxukWWGCiAcyb_X7dc3K0-MHMaQReQ67tAZk"; // Paste anon public aici

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
