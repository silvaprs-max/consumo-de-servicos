
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ufcjehuvnuifjujbotac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmY2plaHV2bnVpZmp1amJvdGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Njg3OTMsImV4cCI6MjA3OTI0NDc5M30.BjuR9MgnWR8TVWBTerP-zP0myq89oxuJWt0409kUmto';

export const supabase = createClient(supabaseUrl, supabaseKey);
