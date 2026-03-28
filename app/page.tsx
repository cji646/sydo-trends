'use client';

import { useEffect, useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import { supabase } from './supabase'; // actions 대신 직접 supabase 연결!

export default function Page() {
  const [allItems, setAllItems] = useState<any[]>([]); 
  const [displayItems, setDisplayItems] = useState<any[]>([]); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    async function fetchData() {
      // 수파베이스에서 직접 데이터 가져오기
      const { data, error } = await supabase
        .from('sydo_items')
        .select('*')
        .order('id', { ascending: false });

      if (data) {
        setAllItems(data);
        setDisplayItems(data.slice(0, 30));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

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
                ARCHIVED <span className="text-neutral-400">{allItems.length}</span> TRENDS<br />
                SHOWING <span className="text-lime-500">{displayItems.length}</span> ITEMS
              </>
            )}
          </p>
        </div>
      </header>

      <Masonry
        breakpointCols={{ default: 5, 1280: 4, 1024: 3, 768: 2, 640: 1 }}
        className="flex w-auto gap-5"
        columnClassName="bg-clip-padding"
      >
        {displayItems.map((item, idx) => {
          const isAbly = item.image_url?.includes('a-bly.com');
          const sourceBadge = isAbly ? 'A-BLY' : 'MUSINSA';
          const badgeColor = isAbly ? 'bg-black text-white' : 'bg-lime-400 text-black border-lime-400';

          return (
            <div key={`${item.id}-${idx}`} className="mb-5 group relative overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950 transition-all duration-300 hover:border-lime-900 hover:shadow-2xl hover:shadow-lime-950/30">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-900">
                <img 
                  src={item.image_url} 
                  alt={`SYDO Item ${idx}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement?.parentElement?.style.setProperty('display', 'none');
                  }}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="flex justify-between items-center gap-2">
                  <span className={`px-3 py-1 text-[9px] font-mono font-bold tracking-wider rounded-full border ${badgeColor}`}>
                    {sourceBadge}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">#{item.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </Masonry>

      <div ref={observerTarget} className="h-60 flex justify-center items-center">
        {displayItems.length < allItems.length && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
