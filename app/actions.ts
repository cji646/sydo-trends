'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jojabvihldirdxywlffg.supabase.co',
  'sb_secret_NHDJ2oztQcr5XumTyiKxiw_trBprYS2'
);

export async function getSydoItems() {
  console.log('📡 [SERVER] DB에 데이터 요청 중...');

  try {
    // 💡 딱 3초만 기다리고, 안 오면 바로 포기하게 만듭니다. (무한 로딩 방지)
    const fetchData = supabase
      .from('sydo_items')
      .select('id, image_url, source_url')
      .order('id', { ascending: false })
      .limit(500);

    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TIMEOUT')), 3000)
    );

    // 둘 중 먼저 끝나는 쪽으로 결정!
    const { data, error } = await Promise.race([fetchData, timeout]) as any;

    if (error) throw error;

    console.log(`✅ [SERVER] ${data?.length}개 가져오기 성공!`);
    return data || [];

  } catch (err: any) {
    console.error('❌ [SERVER] 연결 실패 또는 시간 초과:', err.message);
    // 에러가 나더라도 빈 배열([])을 돌려줘서 화면이 멈추지 않게 합니다.
    return []; 
  }
}