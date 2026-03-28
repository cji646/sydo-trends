import { createClient } from '@supabase/supabase-js';

// 준일님의 '진짜' 주소 (f가 두 개입니다!)
const supabaseUrl = 'https://jojabvihldirdxywlffg.supabase.co'; 

// 방금 준일님이 주신 '진짜' 키
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvamFidmlobGRpcmR4eXdsZmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NjU0NjcsImV4cCI6MjA5MDI0MTQ2N30.rsu1Vy_xQvTLLON0W1vyjehfkifXH3V_c48VdT2eSFE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
