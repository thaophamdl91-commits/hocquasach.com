'use client';

import { useState } from 'react';

const BOOKS = [
  { id:'1', title:'Atomic Habits', author:'James Clear', bg:'#0f172a', accent:'#00D26A', time:15, cat:'Kinh doanh', rating:4.8, hot:true },
  { id:'2', title:'Thinking, Fast and Slow', author:'Daniel Kahneman', bg:'#1e3a5f', accent:'#60a5fa', time:18, cat:'Tâm lý học', rating:4.7, hot:true },
  { id:'3', title:'Deep Work', author:'Cal Newport', bg:'#1c1917', accent:'#f59e0b', time:12, cat:'Năng suất', rating:4.6, isNew:true },
  { id:'4', title:'The Power of Now', author:'Eckhart Tolle', bg:'#2d1b69', accent:'#a78bfa', time:10, cat:'Triết học', rating:4.5 },
  { id:'5', title:'Sapiens', author:'Yuval Noah Harari', bg:'#1a2e1a', accent:'#4ade80', time:20, cat:'Lịch sử', rating:4.9, hot:true },
  { id:'6', title:'Start with Why', author:'Simon Sinek', bg:'#1e1b4b', accent:'#818cf8', time:14, cat:'Kinh doanh', rating:4.4, isNew:true },
  { id:'7', title:'Zero to One', author:'Peter Thiel', bg:'#18181b', accent:'#e5e7eb', time:9, cat:'Kinh doanh', rating:4.6 },
  { id:'8', title:'The Subtle Art', author:'Mark Manson', bg:'#7c1d1d', accent:'#fca5a5', time:7, cat:'Tâm lý học', rating:4.3, isNew:true },
] as const;

const CATS = ['Kinh doanh','Tâm lý học','Năng suất','Lịch sử','Triết học'];
const FILTERS = [{l:'Tất cả',k:'all'},{l:'Mới nhất',k:'new'},{l:'Phổ biến',k:'popular'},{l:'Ngắn nhất',k:'short'}];

export default function HomePage() {
  const [activeNav, setActiveNav] = useState(0);
  const [filter, setFilter] = useState('all');
  const [player, setPlayer] = useState<typeof BOOKS[number] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const books = (() => {
    const list = [...BOOKS] as any[];
    if (filter === 'new') return list.filter(b => b.isNew);
    if (filter === 'popular') return list.sort((a,b) => b.rating - a.rating);
    if (filter === 'short') return list.sort((a,b) => a.time - b.time);
    return list;
  })();

  const featured = BOOKS[0];
  const dur = player ? player.time * 60 : 0;
  const curSec = Math.round((progress/100)*dur);
  const fmt = (s: number) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

  return (
    <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white" style={{height:'680px',maxWidth:'960px',margin:'0 auto'}}>

      {/* SIDEBAR */}
      <aside className="w-56 flex-shrink-0 flex flex-col overflow-y-auto" style={{backgroundColor:'#042C53'}}>
        <div className="px-5 py-5" style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor:'#00D26A'}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Học Qua Sách</p>
              <p className="text-xs mt-0.5" style={{color:'rgba(255,255,255,0.4)'}}>Book Summaries</p>
            </div>
          </div>
        </div>
        <nav className="px-3 py-3" style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
          {['Khám phá','Thư viện','Danh mục'].map((n,i) => (
            <button key={n} onClick={() => setActiveNav(i)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 text-left"
              style={{
                color: activeNav===i ? '#fff' : 'rgba(255,255,255,0.55)',
                backgroundColor: activeNav===i ? 'rgba(0,210,106,0.12)' : 'transparent',
                borderLeft: activeNav===i ? '2px solid #00D26A' : '2px solid transparent',
              }}
            >{n}</button>
          ))}
        </nav>
        <nav className="px-3 py-3 flex-1">
          <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest" style={{color:'rgba(255,255,255,0.3)'}}>Danh mục</p>
          {CATS.map(c => (
            <button key={c} className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-left" style={{color:'rgba(255,255,255,0.55)'}}>
              <span className="flex-1">{c}</span>
            </button>
          ))}
        </nav>
        <div className="mx-3 mb-3 p-3 rounded-xl" style={{backgroundColor:'rgba(0,210,106,0.1)'}}>
          <p className="text-white font-bold text-xs mb-1">Nâng cấp Premium</p>
          <p className="mb-2.5 text-xs leading-snug" style={{color:'rgba(255,255,255,0.45)'}}>Đọc không giới hạn 2,500+ sách</p>
          <button className="w-full py-1.5 rounded-lg text-white font-bold text-xs" style={{backgroundColor:'#00D26A'}}>Dùng thử miễn phí</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* HEADER */}
        <header className="h-14 flex items-center gap-3 px-5 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 max-w-md">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Tìm kiếm sách, tác giả..." className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"/>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor:'#00D26A'}}>P</div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-5">

            {/* HERO */}
            <div className="rounded-2xl p-5 mb-6 flex items-center gap-5 cursor-pointer" style={{backgroundColor: featured.bg}} onClick={() => setPlayer(featured)}>
              <div className="flex-shrink-0 w-20 h-28 rounded-xl flex items-center justify-center p-2 text-center" style={{backgroundColor:`${featured.accent}22`}}>
                <p className="text-white font-black leading-tight" style={{fontSize:'9px'}}>{featured.title}</p>
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2" style={{backgroundColor:`${featured.accent}25`,color:featured.accent,fontSize:'10px'}}>⚡ Nổi bật tuần này</span>
                <h2 className="text-xl font-black text-white mb-1">{featured.title}</h2>
                <p className="text-sm mb-3" style={{color:'rgba(255,255,255,0.6)'}}>{featured.author}</p>
                <div className="flex items-center gap-4 mb-4 text-xs" style={{color:'rgba(255,255,255,0.5)'}}>
                  <span>⏱ {featured.time} phút</span>
                  <span>★ {featured.rating}/5</span>
                </div>
                <button onClick={e=>{e.stopPropagation();setPlayer(featured);setPlaying(true);}} className="flex items-center gap-2 text-white text-sm font-bold px-4 py-2 rounded-xl" style={{backgroundColor:'#00D26A'}}>
                  ▶ Nghe ngay
                </button>
              </div>
            </div>

            {/* FILTERS */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">Khám phá</h2>
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {FILTERS.map(f => (
                <button key={f.k} onClick={() => setFilter(f.k)}
                  className="flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all"
                  style={filter===f.k ? {backgroundColor:'#00D26A',color:'#fff'} : {backgroundColor:'#f3f4f6',color:'#6b7280'}}
                >{f.l}</button>
              ))}
            </div>

            {/* BOOK GRID */}
            <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))'}}>
              {books.map((book: any) => (
                <div key={book.id} className="cursor-pointer group" onClick={() => setPlayer(book)}>
                  <div className="relative rounded-xl overflow-hidden mb-2.5" style={{aspectRatio:'3/4',backgroundColor:book.bg}}>
                    <div className="absolute top-0 right-0 w-10 h-10 rounded-full opacity-20" style={{backgroundColor:book.accent,transform:'translate(30%,-30%)'}}/>
                    <p className="absolute inset-0 flex items-center justify-center text-white font-black text-center px-2 leading-tight z-10" style={{fontSize:'9px'}}>{book.title}</p>
                    {book.isNew && <span className="absolute top-2 left-2 text-white font-bold rounded-full px-1.5 py-0.5 z-20 text-xs" style={{backgroundColor:'#00D26A',fontSize:'8px'}}>Mới</span>}
                    {book.hot && <span className="absolute font-bold rounded-full px-1.5 py-0.5 z-20" style={{backgroundColor:'#f59e0b',color:'#78350f',fontSize:'8px',top:'8px',left:book.isNew?'34px':'8px'}}>Hot</span>}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{backgroundColor:'rgba(0,0,0,0.45)'}}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor:'#00D26A'}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{book.title}</p>
                  <p className="text-xs text-gray-400 truncate mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">⏱ {book.time} min</span>
                    <button onClick={e=>{e.stopPropagation();setPlayer(book);setPlaying(true);}} className="w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor:'#00D26A'}}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* AUDIO PLAYER */}
        {player && (
          <div className="flex-shrink-0 relative flex items-center gap-3 px-4" style={{height:'72px',backgroundColor:'#042C53',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
            <div className="absolute top-0 left-0 right-0 h-0.5 cursor-pointer" style={{backgroundColor:'rgba(255,255,255,0.1)'}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))));}}>
              <div className="h-full" style={{width:`${progress}%`,backgroundColor:'#00D26A'}}/>
            </div>
            <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{backgroundColor:player.bg}}>
              <p className="text-white font-black text-center leading-tight" style={{fontSize:'7px'}}>{player.title.slice(0,6)}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{player.title}</p>
              <p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{player.author}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={()=>setProgress(p=>Math.max(0,p-5))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
              </button>
              <button onClick={()=>setPlaying(p=>!p)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{backgroundColor:'#00D26A'}}>
                {playing
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                }
              </button>
              <button onClick={()=>setProgress(p=>Math.min(100,p+5))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs tabular-nums" style={{color:'rgba(255,255,255,0.4)'}}>{fmt(curSec)}</span>
              <div className="w-24 h-0.5 rounded-full cursor-pointer" style={{backgroundColor:'rgba(255,255,255,0.15)'}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round((e.clientX-r.left)/r.width*100));}}>
                <div className="h-full rounded-full" style={{width:`${progress}%`,backgroundColor:'#00D26A'}}/>
              </div>
              <span className="text-xs tabular-nums" style={{color:'rgba(255,255,255,0.4)'}}>{fmt(dur)}</span>
            </div>
            <button onClick={()=>setPlayer(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{color:'rgba(255,255,255,0.5)'}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
