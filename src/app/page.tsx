'use client';
import { useState, useEffect } from 'react';

const BOOKS = [
  { id:'1', title:'Atomic Habits', author:'James Clear', bg:'#0f172a', accent:'#00D26A', time:15, rating:4.8, hot:true },
  { id:'2', title:'Thinking, Fast and Slow', author:'Daniel Kahneman', bg:'#1e3a5f', accent:'#60a5fa', time:18, rating:4.7, hot:true },
  { id:'3', title:'Deep Work', author:'Cal Newport', bg:'#1c1917', accent:'#f59e0b', time:12, rating:4.6, isNew:true },
  { id:'4', title:'The Power of Now', author:'Eckhart Tolle', bg:'#2d1b69', accent:'#a78bfa', time:10, rating:4.5 },
  { id:'5', title:'Sapiens', author:'Yuval Noah Harari', bg:'#1a2e1a', accent:'#4ade80', time:20, rating:4.9, hot:true },
  { id:'6', title:'Start with Why', author:'Simon Sinek', bg:'#1e1b4b', accent:'#818cf8', time:14, rating:4.4, isNew:true },
  { id:'7', title:'Zero to One', author:'Peter Thiel', bg:'#18181b', accent:'#e5e7eb', time:9, rating:4.6 },
  { id:'8', title:'The Subtle Art', author:'Mark Manson', bg:'#7c1d1d', accent:'#fca5a5', time:7, rating:4.3, isNew:true },
] as const;

const CATS = ['Kinh doanh','Tâm lý học','Năng suất','Lịch sử','Triết học'];
const NAV = ['Khám phá','Thư viện','Danh mục'];
const FILTERS = [{l:'Tất cả',k:'all'},{l:'Mới nhất',k:'new'},{l:'Phổ biến',k:'popular'},{l:'Ngắn nhất',k:'short'}];

export default function HomePage() {
  const [activeNav, setActiveNav] = useState(0);
  const [filter, setFilter] = useState('all');
  const [player, setPlayer] = useState<typeof BOOKS[number]|null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredBook, setHoveredBook] = useState<string|null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const books = (() => {
    const list = [...BOOKS] as any[];
    if(filter==='new') return list.filter(b=>b.isNew);
    if(filter==='popular') return [...list].sort((a,b)=>b.rating-a.rating);
    if(filter==='short') return [...list].sort((a,b)=>a.time-b.time);
    return list;
  })();

  const featured = BOOKS[0];
  const dur = player ? player.time*60 : 0;
  const curSec = Math.round((progress/100)*dur);
  const fmt = (s:number) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

  const SidebarContent = () => (
    <aside style={{width: isMobile?'100%':'224px', flexShrink:0, display:'flex', flexDirection:'column', height:'100%', overflowY:'auto', backgroundColor:'#042C53'}}>
      <div style={{padding:'20px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <div style={{width:'28px', height:'28px', borderRadius:'8px', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div>
            <div style={{color:'#fff', fontWeight:700, fontSize:'14px', lineHeight:1}}>Học Qua Sách</div>
            <div style={{color:'rgba(255,255,255,0.4)', fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.5px', marginTop:'2px'}}>Book Summaries</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={()=>setSidebarOpen(false)} style={{background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.6)', padding:'4px'}}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      <div style={{padding:'12px', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        {NAV.map((n,i)=>(
          <button key={n} onClick={()=>{setActiveNav(i);if(isMobile)setSidebarOpen(false);}} style={{width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'8px', fontSize:'13px', fontWeight:500, marginBottom:'2px', border:'none', cursor:'pointer', textAlign:'left', backgroundColor:activeNav===i?'rgba(0,210,106,0.12)':'transparent', color:activeNav===i?'#fff':'rgba(255,255,255,0.55)', borderLeft:activeNav===i?'2px solid #00D26A':'2px solid transparent'}}>
            {n}
            {activeNav===i&&<span style={{marginLeft:'auto', width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#00D26A'}}/>}
          </button>
        ))}
      </div>

      <div style={{padding:'12px', flex:1}}>
        <div style={{color:'rgba(255,255,255,0.3)', fontSize:'9px', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', padding:'0 12px 8px'}}>Danh mục</div>
        {CATS.map(c=>(
          <button key={c} style={{width:'100%', display:'flex', alignItems:'center', padding:'8px 12px', borderRadius:'8px', fontSize:'13px', border:'none', cursor:'pointer', backgroundColor:'transparent', color:'rgba(255,255,255,0.55)', textAlign:'left'}}>
            <span style={{flex:1}}>{c}</span>
          </button>
        ))}
      </div>

      <div style={{margin:'12px', padding:'14px', borderRadius:'10px', backgroundColor:'rgba(0,210,106,0.1)'}}>
        <div style={{color:'#fff', fontWeight:700, fontSize:'12px', marginBottom:'4px'}}>Nâng cấp Premium</div>
        <div style={{color:'rgba(255,255,255,0.45)', fontSize:'10px', marginBottom:'10px', lineHeight:1.4}}>Đọc không giới hạn 2,500+ sách</div>
        <button style={{width:'100%', padding:'8px', borderRadius:'8px', backgroundColor:'#00D26A', color:'#fff', fontWeight:700, fontSize:'12px', border:'none', cursor:'pointer'}}>Dùng thử miễn phí</button>
      </div>
    </aside>
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f3f4f6; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
        input::placeholder { color: #9ca3af; }
        input { font-family: inherit; }
        button { font-family: inherit; }
      `}</style>

      <div style={{display:'flex', height:'100vh', maxWidth:'960px', margin:'0 auto', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', background:'#fff', position:'relative', overflow:'hidden', boxShadow:'0 0 40px rgba(0,0,0,0.1)'}}>

        {/* MOBILE OVERLAY */}
        {isMobile && sidebarOpen && (
          <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', zIndex:40}}/>
        )}

        {/* SIDEBAR — hidden on mobile unless open */}
        {!isMobile ? (
          <SidebarContent/>
        ) : sidebarOpen ? (
          <div style={{position:'fixed', top:0, left:0, bottom:0, width:'280px', zIndex:50, display:'flex', flexDirection:'column'}}>
            <SidebarContent/>
          </div>
        ) : null}

        {/* MAIN */}
        <div style={{flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden'}}>

          {/* HEADER */}
          <header style={{height:'56px', display:'flex', alignItems:'center', gap:'10px', padding:'0 16px', borderBottom:'1px solid #f3f4f6', background:'#fff', flexShrink:0}}>
            {isMobile && (
              <button onClick={()=>setSidebarOpen(true)} style={{background:'none', border:'none', cursor:'pointer', padding:'4px', color:'#374151', flexShrink:0}}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            )}
            {isMobile && (
              <span style={{fontWeight:700, fontSize:'14px', color:'#042C53', flexShrink:0}}>Học Qua Sách</span>
            )}
            <div style={{flex:1, display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', borderRadius:'10px', backgroundColor:'#f9fafb', border:'1px solid #e5e7eb', maxWidth:'400px'}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input placeholder="Tìm kiếm sách..." style={{flex:1, background:'transparent', border:'none', outline:'none', fontSize:'13px', color:'#1f2937'}}/>
            </div>
            <div style={{marginLeft:'auto', width:'30px', height:'30px', borderRadius:'50%', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'12px', fontWeight:700, cursor:'pointer', flexShrink:0}}>P</div>
          </header>

          {/* SCROLLABLE CONTENT */}
          <div style={{flex:1, overflowY:'auto', backgroundColor:'#f9fafb', paddingBottom: player ? '80px' : '0'}}>
            <div style={{padding: isMobile ? '16px' : '20px'}}>

              {/* HERO */}
              <div style={{borderRadius:'16px', padding: isMobile?'16px':'20px', marginBottom:'20px', display:'flex', alignItems:'center', gap: isMobile?'14px':'20px', cursor:'pointer', backgroundColor:featured.bg}} onClick={()=>setPlayer(featured)}>
                {!isMobile && (
                  <div style={{flexShrink:0, width:'80px', height:'112px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', padding:'8px', textAlign:'center', backgroundColor:`${featured.accent}22`}}>
                    <div style={{color:'#fff', fontWeight:900, fontSize:'9px', lineHeight:1.3}}>{featured.title}</div>
                  </div>
                )}
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'inline-block', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', padding:'3px 10px', borderRadius:'20px', marginBottom:'8px', backgroundColor:`${featured.accent}25`, color:featured.accent}}>⚡ Nổi bật tuần này</div>
                  <div style={{fontSize: isMobile?'20px':'24px', fontWeight:900, color:'#fff', marginBottom:'4px', lineHeight:1.2}}>{featured.title}</div>
                  <div style={{fontSize:'13px', marginBottom:'10px', color:'rgba(255,255,255,0.6)'}}>{featured.author}</div>
                  <div style={{display:'flex', gap:'14px', fontSize:'11px', color:'rgba(255,255,255,0.5)', marginBottom:'14px'}}>
                    <span>⏱ {featured.time} phút</span>
                    <span>★ {featured.rating}/5</span>
                  </div>
                  <button onClick={e=>{e.stopPropagation();setPlayer(featured);setPlaying(true);}} style={{display:'inline-flex', alignItems:'center', gap:'6px', backgroundColor:'#00D26A', color:'#fff', fontWeight:700, fontSize:'13px', padding:'8px 16px', borderRadius:'10px', border:'none', cursor:'pointer'}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                    Nghe ngay
                  </button>
                </div>
              </div>

              {/* FILTERS */}
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px'}}>
                <div style={{fontSize:'15px', fontWeight:700, color:'#111827'}}>Khám phá</div>
                <div style={{fontSize:'12px', color:'#9ca3af'}}>{books.length} sách</div>
              </div>
              <div style={{display:'flex', gap:'8px', marginBottom:'16px', overflowX:'auto', paddingBottom:'4px', WebkitOverflowScrolling:'touch'}}>
                {FILTERS.map(f=>(
                  <button key={f.k} onClick={()=>setFilter(f.k)} style={{flexShrink:0, padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:600, border:'none', cursor:'pointer', backgroundColor:filter===f.k?'#00D26A':'#f3f4f6', color:filter===f.k?'#fff':'#6b7280'}}>
                    {f.l}
                  </button>
                ))}
              </div>

              {/* GRID */}
              <div style={{display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(130px,1fr))', gap: isMobile?'12px':'16px'}}>
                {books.map((book:any)=>(
                  <div key={book.id} style={{cursor:'pointer'}} onClick={()=>setPlayer(book)} onMouseEnter={()=>setHoveredBook(book.id)} onMouseLeave={()=>setHoveredBook(null)}>
                    <div style={{position:'relative', borderRadius:'10px', overflow:'hidden', marginBottom:'8px', aspectRatio:'3/4'}}>
                      <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'12px', textAlign:'center', backgroundColor:book.bg}}>
                        <div style={{position:'absolute', top:0, right:0, width:'40px', height:'40px', borderRadius:'50%', backgroundColor:book.accent, opacity:0.2, transform:'translate(30%,-30%)'}}/>
                        <div style={{color:'#fff', fontWeight:900, fontSize:'9px', lineHeight:1.3, position:'relative', zIndex:1}}>{book.title}</div>
                      </div>
                      {book.isNew&&<div style={{position:'absolute', top:'8px', left:'8px', backgroundColor:'#00D26A', color:'#fff', fontWeight:700, borderRadius:'20px', padding:'2px 6px', fontSize:'8px', zIndex:2}}>Mới</div>}
                      {book.hot&&<div style={{position:'absolute', top:'8px', backgroundColor:'#f59e0b', color:'#78350f', fontWeight:700, borderRadius:'20px', padding:'2px 6px', fontSize:'8px', zIndex:2, left:book.isNew?'36px':'8px'}}>Hot</div>}
                      <div style={{position:'absolute', inset:0, backgroundColor:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', opacity:hoveredBook===book.id?1:0, transition:'opacity 0.15s', zIndex:3}}>
                        <button onClick={e=>{e.stopPropagation();setPlayer(book);setPlaying(true);}} style={{width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer'}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{marginLeft:'2px'}}><path d="M5 3l14 9-14 9V3z"/></svg>
                        </button>
                      </div>
                    </div>
                    <div style={{fontSize:'12px', fontWeight:700, color:'#111827', marginBottom:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{book.title}</div>
                    <div style={{fontSize:'11px', color:'#9ca3af', marginBottom:'6px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{book.author}</div>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                      <span style={{fontSize:'11px', color:'#9ca3af'}}>⏱ {book.time} min</span>
                      <button onClick={e=>{e.stopPropagation();setPlayer(book);setPlaying(true);}} style={{width:'22px', height:'22px', borderRadius:'50%', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', flexShrink:0}}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="white" style={{marginLeft:'1px'}}><path d="M5 3l14 9-14 9V3z"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PLAYER */}
          {player&&(
            <div style={{flexShrink:0, position:'relative', display:'flex', alignItems:'center', gap:'10px', padding:'0 14px', backgroundColor:'#042C53', borderTop:'1px solid rgba(255,255,255,0.1)', height:'68px'}}>
              <div style={{position:'absolute', top:0, left:0, right:0, height:'2px', backgroundColor:'rgba(255,255,255,0.1)', cursor:'pointer'}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))));}}>
                <div style={{height:'100%', backgroundColor:'#00D26A', width:`${progress}%`, transition:'width 0.1s'}}/>
              </div>

              <div style={{width:'36px', height:'36px', borderRadius:'6px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:player.bg}}>
                <span style={{color:'rgba(255,255,255,0.8)', fontSize:'7px', fontWeight:900, textAlign:'center', lineHeight:1.2}}>{player.title.slice(0,6)}</span>
              </div>

              <div style={{flex:1, minWidth:0}}>
                <div style={{color:'#fff', fontSize:'12px', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{player.title}</div>
                {!isMobile && <div style={{color:'rgba(255,255,255,0.4)', fontSize:'10px'}}>{player.author}</div>}
              </div>

              <div style={{display:'flex', alignItems:'center', gap:'6px', flexShrink:0}}>
                <button onClick={()=>setProgress(p=>Math.max(0,p-5))} style={{width:'28px', height:'28px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer'}}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                </button>
                <button onClick={()=>setPlaying(p=>!p)} style={{width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer'}}>
                  {playing
                    ?<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    :<svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{marginLeft:'2px'}}><path d="M5 3l14 9-14 9V3z"/></svg>
                  }
                </button>
                <button onClick={()=>setProgress(p=>Math.min(100,p+5))} style={{width:'28px', height:'28px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer'}}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                </button>
              </div>

              {!isMobile && (
                <div style={{display:'flex', alignItems:'center', gap:'6px', flexShrink:0}}>
                  <span style={{color:'rgba(255,255,255,0.4)', fontSize:'10px', minWidth:'28px', textAlign:'center'}}>{fmt(curSec)}</span>
                  <div style={{width:'100px', height:'2px', borderRadius:'2px', backgroundColor:'rgba(255,255,255,0.15)', cursor:'pointer'}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round((e.clientX-r.left)/r.width*100));}}>
                    <div style={{height:'100%', borderRadius:'2px', backgroundColor:'#00D26A', width:`${progress}%`}}/>
                  </div>
                  <span style={{color:'rgba(255,255,255,0.4)', fontSize:'10px', minWidth:'28px', textAlign:'center'}}>{fmt(dur)}</span>
                </div>
              )}

              <button onClick={()=>setPlayer(null)} style={{width:'26px', height:'26px', borderRadius:'6px', backgroundColor:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
