import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eessaqgakuswnowdgkpa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlc3NhcWdha3Vzd25vd2Rna3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MTk1MTAsImV4cCI6MjA2NjM5NTUxMH0.mwbQvQkpQEaJOnKitbFAYKdt5SCmBNPWm5V7UeRC_bg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
