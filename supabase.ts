import { createClient } from '@supabase/supabase-js';

// 준일님의 수파베이스 정보
const supabaseUrl = 'https://jojabvihldirdxywlffg.supabase.co';
const supabaseKey = ''; 

export const supabase = createClient(supabaseUrl, supabaseKey);