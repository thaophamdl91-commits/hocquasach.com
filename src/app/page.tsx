'use client';
import { useState } from 'react';

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

export default function HomePage() {
  const [activeNav, setActiveNav] = useState(0);
  const [filter, setFilter] = useState('all');
  const [player, setPlayer] = useState<typeof BOOKS[number]|null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredBook, setHoveredBook] = useState<string|null>(null);

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

  const s = {
    app: { display:'flex', height:'100vh', maxHeight:'680px', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', border:'1px solid #e5e7eb', borderRadius:'12px', overflow:'hidden', background:'#fff', maxWidth:'960px', margin:'20px auto' } as React.CSSProperties,
    sidebar: { width:'224px', flexShrink:0, display:'flex', flexDirection:'column' as const, height:'100%', overflowY:'auto' as const, backgroundColor:'#042C53' },
    logoArea: { padding:'20px', borderBottom:'1px solid rgba(255,255,255,0.1)' },
    logoIcon: { width:'28px', height:'28px', borderRadius:'8px', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
    logoText: { color:'#fff', fontWeight:700, fontSize:'14px', lineHeight:1 },
    logoSub: { color:'rgba(255,255,255,0.4)', fontSize:'9px', textTransform:'uppercase' as const, letterSpacing:'0.5px', marginTop:'2px' },
    navSection: { padding:'12px', borderBottom:'1px solid rgba(255,255,255,0.1)' },
    navLabel: { color:'rgba(255,255,255,0.3)', fontSize:'9px', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'1px', padding:'0 12px 6px' },
    catSection: { padding:'12px', flex:1 },
    cta: { margin:'12px', padding:'12px', borderRadius:'10px', backgroundColor:'rgba(0,210,106,0.1)' },
    ctaTitle: { color:'#fff', fontWeight:700, fontSize:'12px', marginBottom:'4px' },
    ctaSub: { color:'rgba(255,255,255,0.45)', fontSize:'10px', marginBottom:'10px', lineHeight:1.4 },
    ctaBtn: { width:'100%', padding:'6px', borderRadius:'8px', backgroundColor:'#00D26A', color:'#fff', fontWeight:700, fontSize:'11px', border:'none', cursor:'pointer' },
    main: { flex:1, display:'flex', flexDirection:'column' as const, minWidth:0, overflow:'hidden' },
    header: { height:'56px', display:'flex', alignItems:'center', gap:'12px', padding:'0 20px', borderBottom:'1px solid #f3f4f6', background:'#fff', flexShrink:0 },
    searchBox: { flex:1, display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', borderRadius:'10px', backgroundColor:'#f9fafb', border:'1px solid #e5e7eb', maxWidth:'380px' },
    searchInput: { flex:1, background:'transparent', border:'none', outline:'none', fontSize:'13px', color:'#1f2937' },
    avatar: { width:'28px', height:'28px', borderRadius:'50%', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'11px', fontWeight:700, cursor:'pointer' },
    content: { flex:1, overflowY:'auto' as const, backgroundColor:'#f9fafb', padding:'20px' },
    hero: { borderRadius:'16px', padding:'20px', marginBottom:'24px', display:'flex', alignItems:'center', gap:'20px', cursor:'pointer' },
    heroCover: { flexShrink:0, width:'80px', height:'112px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', padding:'8px', textAlign:'center' as const },
    heroCoverText: { color:'#fff', fontWeight:900, fontSize:'9px', lineHeight:1.3 },
    heroBadge: { display:'inline-block', fontSize:'10px', fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.5px', padding:'3px 10px', borderRadius:'20px', marginBottom:'8px' },
    heroTitle: { fontSize:'22px', fontWeight:900, color:'#fff', marginBottom:'4px', lineHeight:1.2 },
    heroAuthor: { fontSize:'13px', marginBottom:'12px', color:'rgba(255,255,255,0.6)' },
    heroMeta: { display:'flex', gap:'16px', fontSize:'11px', color:'rgba(255,255,255,0.5)', marginBottom:'14px' },
    heroBtn: { display:'inline-flex', alignItems:'center', gap:'6px', backgroundColor:'#00D26A', color:'#fff', fontWeight:700, fontSize:'13px', padding:'8px 16px', borderRadius:'10px', border:'none', cursor:'pointer' },
    sectionHead: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' },
    sectionTitle: { fontSize:'15px', fontWeight:700, color:'#111827' },
    filterRow: { display:'flex', gap:'8px', marginBottom:'16px', overflowX:'auto' as const },
    grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'16px' },
    card: { cursor:'pointer', position:'relative' as const },
    coverWrap: { position:'relative' as const, borderRadius:'10px', overflow:'hidden', marginBottom:'8px', aspectRatio:'3/4' as const },
    coverInner: { position:'absolute' as const, inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'12px', textAlign:'center' as const },
    coverTitle: { color:'#fff', fontWeight:900, fontSize:'9px', lineHeight:1.3, position:'relative' as const, zIndex:1 },
    badge: { position:'absolute' as const, top:'8px', left:'8px', color:'#fff', fontWeight:700, borderRadius:'20px', padding:'2px 6px', fontSize:'8px', zIndex:2 },
    coverOverlay: { position:'absolute' as const, inset:0, backgroundColor:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', transition:'opacity 0.15s', zIndex:3 },
    playCircle: { width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer' },
    bookTitle: { fontSize:'12px', fontWeight:700, color:'#111827', marginBottom:'2px', whiteSpace:'nowrap' as const, overflow:'hidden', textOverflow:'ellipsis' },
    bookAuthor: { fontSize:'11px', color:'#9ca3af', marginBottom:'6px', whiteSpace:'nowrap' as const, overflow:'hidden', textOverflow:'ellipsis' },
    bookMeta: { display:'flex', alignItems:'center', justifyContent:'space-between' },
    readTime: { fontSize:'11px', color:'#9ca3af', display:'flex', alignItems:'center', gap:'3px' },
    playSmall: { width:'22px', height:'22px', borderRadius:'50%', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', flexShrink:0 },
    player: { flexShrink:0, position:'relative' as const, display:'flex', alignItems:'center', gap:'12px', padding:'0 16px', backgroundColor:'#042C53', borderTop:'1px solid rgba(255,255,255,0.1)', height:'68px' },
    playerProg: { position:'absolute' as const, top:0, left:0, right:0, height:'2px', backgroundColor:'rgba(255,255,255,0.1)', cursor:'pointer' },
    playerProgFill: { height:'100%', backgroundColor:'#00D26A', transition:'width 0.1s' },
    playerCover: { width:'36px', height:'36px', borderRadius:'6px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' },
    playerInfo: { flex:1, minWidth:0 },
    playerTitle: { color:'#fff', fontSize:'12px', fontWeight:600, whiteSpace:'nowrap' as const, overflow:'hidden', textOverflow:'ellipsis' },
    playerAuthor: { color:'rgba(255,255,255,0.4)', fontSize:'10px' },
    ctrlBtn: { width:'28px', height:'28px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer' },
    playMain: { width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer' },
    progWrap: { display:'flex', alignItems:'center', gap:'6px' },
    progBar: { width:'100px', height:'2px', borderRadius:'2px', backgroundColor:'rgba(255,255,255,0.15)', cursor:'pointer' },
    progFill: { height:'100%', borderRadius:'2px', backgroundColor:'#00D26A' },
    timeLbl: { color:'rgba(255,255,255,0.4)', fontSize:'10px', minWidth:'28px', textAlign:'center' as const },
    closeBtn: { width:'26px', height:'26px', borderRadius:'6px', backgroundColor:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center' },
  };

  return (
    <div style={s.app}>
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={s.logoArea}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={s.logoIcon}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            </div>
            <div>
              <div style={s.logoText}>Học Qua Sách</div>
              <div style={s.logoSub}>Book Summaries</div>
            </div>
          </div>
        </div>

        <div style={s.navSection}>
          {['Khám phá','Thư viện','Danh mục'].map((n,i)=>(
            <button key={n} onClick={()=>setActiveNav(i)} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',borderRadius:'8px',fontSize:'13px',fontWeight:500,marginBottom:'2px',border:'none',cursor:'pointer',textAlign:'left' as const,backgroundColor:activeNav===i?'rgba(0,210,106,0.12)':'transparent',color:activeNav===i?'#fff':'rgba(255,255,255,0.55)',borderLeft:activeNav===i?'2px solid #00D26A':'2px solid transparent'}}>
              {n}
              {activeNav===i&&<span style={{marginLeft:'auto',width:'6px',height:'6px',borderRadius:'50%',backgroundColor:'#00D26A'}}/>}
            </button>
          ))}
        </div>

        <div style={s.catSection}>
          <div style={s.navLabel}>Danh mục</div>
          {CATS.map(c=>(
            <button key={c} style={{width:'100%',display:'flex',alignItems:'center',padding:'7px 12px',borderRadius:'8px',fontSize:'12px',border:'none',cursor:'pointer',backgroundColor:'transparent',color:'rgba(255,255,255,0.55)',textAlign:'left' as const}}>
              <span style={{flex:1}}>{c}</span>
            </button>
          ))}
        </div>

        <div style={s.cta}>
          <div style={s.ctaTitle}>Nâng cấp Premium</div>
          <div style={s.ctaSub}>Đọc không giới hạn 2,500+ sách</div>
          <button style={s.ctaBtn}>Dùng thử miễn phí</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={s.main}>
        {/* HEADER */}
        <header style={s.header}>
          <div style={s.searchBox}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Tìm kiếm sách, tác giả..." style={s.searchInput}/>
          </div>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'8px'}}>
            <button style={{background:'none',border:'none',cursor:'pointer',position:'relative' as const,padding:'4px'}}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span style={{position:'absolute',top:'4px',right:'4px',width:'6px',height:'6px',borderRadius:'50%',backgroundColor:'#00D26A'}}/>
            </button>
            <div style={s.avatar}>P</div>
          </div>
        </header>

        {/* CONTENT */}
        <div style={s.content}>
          {/* HERO */}
          <div style={{...s.hero, backgroundColor:featured.bg}} onClick={()=>setPlayer(featured)}>
            <div style={{...s.heroCover, backgroundColor:`${featured.accent}22`}}>
              <div style={s.heroCoverText}>{featured.title}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{...s.heroBadge, backgroundColor:`${featured.accent}25`, color:featured.accent}}>⚡ Nổi bật tuần này</div>
              <div style={s.heroTitle}>{featured.title}</div>
              <div style={s.heroAuthor}>{featured.author}</div>
              <div style={s.heroMeta}>
                <span>⏱ {featured.time} phút</span>
                <span>★ {featured.rating}/5</span>
              </div>
              <button style={s.heroBtn} onClick={e=>{e.stopPropagation();setPlayer(featured);setPlaying(true);}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                Nghe ngay
              </button>
            </div>
          </div>

          {/* SECTION HEAD */}
          <div style={s.sectionHead}>
            <div style={s.sectionTitle}>Khám phá</div>
          </div>

          {/* FILTERS */}
          <div style={s.filterRow}>
            {[{l:'Tất cả',k:'all'},{l:'Mới nhất',k:'new'},{l:'Phổ biến',k:'popular'},{l:'Ngắn nhất',k:'short'}].map(f=>(
              <button key={f.k} onClick={()=>setFilter(f.k)} style={{flexShrink:0,padding:'5px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:600,border:'none',cursor:'pointer',backgroundColor:filter===f.k?'#00D26A':'#f3f4f6',color:filter===f.k?'#fff':'#6b7280'}}>
                {f.l}
              </button>
            ))}
          </div>

          {/* GRID */}
          <div style={s.grid}>
            {books.map((book:any)=>(
              <div key={book.id} style={s.card} onClick={()=>setPlayer(book)} onMouseEnter={()=>setHoveredBook(book.id)} onMouseLeave={()=>setHoveredBook(null)}>
                <div style={s.coverWrap}>
                  <div style={{...s.coverInner, backgroundColor:book.bg}}>
                    <div style={{position:'absolute',top:0,right:0,width:'40px',height:'40px',borderRadius:'50%',backgroundColor:book.accent,opacity:0.2,transform:'translate(30%,-30%)'}}/>
                    <div style={s.coverTitle}>{book.title}</div>
                  </div>
                  {book.isNew&&<div style={{...s.badge,backgroundColor:'#00D26A'}}>Mới</div>}
                  {book.hot&&<div style={{...s.badge,backgroundColor:'#f59e0b',color:'#78350f',left:book.isNew?'36px':'8px'}}>Hot</div>}
                  <div style={{...s.coverOverlay, opacity:hoveredBook===book.id?1:0}}>
                    <button style={s.playCircle} onClick={e=>{e.stopPropagation();setPlayer(book);setPlaying(true);}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{marginLeft:'2px'}}><path d="M5 3l14 9-14 9V3z"/></svg>
                    </button>
                  </div>
                </div>
                <div style={s.bookTitle}>{book.title}</div>
                <div style={s.bookAuthor}>{book.author}</div>
                <div style={s.bookMeta}>
                  <div style={s.readTime}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    {book.time} min
                  </div>
                  <button style={s.playSmall} onClick={e=>{e.stopPropagation();setPlayer(book);setPlaying(true);}}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="white" style={{marginLeft:'1px'}}><path d="M5 3l14 9-14 9V3z"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PLAYER */}
        {player&&(
          <div style={s.player}>
            <div style={s.playerProg} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))));}}>
              <div style={{...s.playerProgFill,width:`${progress}%`}}/>
            </div>
            <div style={{...s.playerCover,backgroundColor:player.bg}}>
              <span style={{color:'rgba(255,255,255,0.8)',fontSize:'7px',fontWeight:900,textAlign:'center' as const,lineHeight:1.2,padding:'0 2px'}}>{player.title.slice(0,6)}</span>
            </div>
            <div style={s.playerInfo}>
              <div style={s.playerTitle}>{player.title}</div>
              <div style={s.playerAuthor}>{player.author}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
              <button style={s.ctrlBtn} onClick={()=>setProgress(p=>Math.max(0,p-5))}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
              </button>
              <button style={s.playMain} onClick={()=>setPlaying(p=>!p)}>
                {playing
                  ?<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  :<svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{marginLeft:'2px'}}><path d="M5 3l14 9-14 9V3z"/></svg>
                }
              </button>
              <button style={s.ctrlBtn} onClick={()=>setProgress(p=>Math.min(100,p+5))}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              </button>
            </div>
            <div style={s.progWrap}>
              <span style={s.timeLbl}>{fmt(curSec)}</span>
              <div style={s.progBar} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round((e.clientX-r.left)/r.width*100));}}>
                <div style={{...s.progFill,width:`${progress}%`}}/>
              </div>
              <span style={s.timeLbl}>{fmt(dur)}</span>
            </div>
            <button style={s.closeBtn} onClick={()=>setPlayer(null)}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
