'use client';

import { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import { supabase } from './supabase';

export default function Page() {
  const [allItems, setAllItems] = useState<any[]>([]); 
  const [displayItems, setDisplayItems] = useState<any[]>([]); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const observerTarget = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorMsg(null);

      // [중요] 준일님 테이블 이름 'sydo_items'로 조회!
      const { data, error } = await supabase
        .from('sydo_items') 
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error("❌ 에러 발생:", error);
        setErrorMsg(`데이터 로드 실패: ${error.message}`);
      } else if (data && data.length > 0) {
        setAllItems(data);
        setDisplayItems(data.slice(0, 30));
      } else {
        setErrorMsg("데이터는 연결됐는데, 테이블이 비어있거나 RLS 설정이 막혀있습니다.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // 무한 스크롤 로직
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && displayItems.length < allItems.length) {
          const nextPage = page + 1;
          setDisplayItems(allItems.slice(0, nextPage * 30));
          setPage(nextPage);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [displayItems, allItems, loading, page]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 selection:bg-lime-400 selection:text-black font-sans">
      <header className="mb-16 sticky top-0 z-50 bg-black/80 backdrop-blur-lg py-8 border-b border-neutral-900/50">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
            SYDO<span className="text-lime-400 animate-pulse">.</span>
          </h1>
          <p className="text-[11px] text-neutral-600 font-mono tracking-widest uppercase text-right leading-tight">
            {loading ? (
              <span className="animate-pulse text-lime-600">Syncing...</span>
            ) : (
              <>
                ARCHIVED <span className="text-neutral-400">{allItems.length}</span> TRENDS<br /><br />
                SHOWING <span className="text-lime-500">{displayItems.length}</span> ITEMS
              </>
            )}
          </p>
        </div>
      </header>

      {/* 에러 메시지 표시창 */}
      {errorMsg && (
        <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl text-center mb-10">
          <p className="text-red-400 font-mono text-sm">{errorMsg}</p>
        </div>
      )}

      {!loading && allItems.length > 0 && (
        <Masonry
          breakpointCols={{ default: 5, 1280: 4, 1024: 3, 768: 2, 640: 1 }}
          className="flex w-auto gap-5"
          columnClassName="bg-clip-padding"
        >
          {displayItems.map((item, idx) => {
            const isAbly = item.image_url?.includes('a-bly.com');
            const sourceBadge = isAbly ? 'A-BLY' : 'MUSINSA';
            const badgeColor = isAbly ? 'bg-black text-white border-white/20' : 'bg-lime-400 text-black border-lime-400';

            return (
              <div key={`${item.id}-${idx}`} className="mb-5 group relative overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950 transition-all duration-300 hover:border-lime-900">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-900">
                  <img 
                    src={item.image_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement?.parentElement?.style.setProperty('display', 'none');
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 text-[8px] font-bold rounded border ${badgeColor}`}>
                      {sourceBadge}
                    </span>
                    <span className="text-[10px] text-neutral-500">#{item.id}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </Masonry>
      )}

      <div ref={observerTarget} className="h-40 flex justify-center items-center" />
    </div>
  );
}
