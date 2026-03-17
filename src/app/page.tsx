'use client';
import { useState, useEffect, useRef } from 'react';

const BOOKS = [
  { id:'1', title:'Atomic Habits', author:'James Clear', category:'Kinh doanh', time:15, rating:4.8, hot:true, image:'https://res.cloudinary.com/CLOUD_NAME/image/upload/atomic-habits.jpg', youtubeId:'VIDEO_ID_1', bg:'#0f172a', accent:'#00D26A' },
  { id:'2', title:'Thinking, Fast and Slow', author:'Daniel Kahneman', category:'Tâm lý học', time:18, rating:4.7, hot:true, image:'https://res.cloudinary.com/CLOUD_NAME/image/upload/thinking-fast-slow.jpg', youtubeId:'VIDEO_ID_2', bg:'#1e3a5f', accent:'#60a5fa' },
  { id:'3', title:'Deep Work', author:'Cal Newport', category:'Năng suất', time:12, rating:4.6, isNew:true, image:'https://res.cloudinary.com/CLOUD_NAME/image/upload/deep-work.jpg', youtubeId:'VIDEO_ID_3', bg:'#1c1917', accent:'#f59e0b' },
  { id:'4', title:'The Power of Now', author:'Eckhart Tolle', category:'Triết học', time:10, rating:4.5, image:'https://res.cloudinary.com/CLOUD_NAME/image/upload/power-of-now.jpg', youtubeId:'VIDEO_ID_4', bg:'#2d1b69', accent:'#a78bfa' },
  { id:'5', title:'Sapiens', author:'Yuval Noah Harari', category:'Lịch sử', time:20, rating:4.9, hot:true, image:'https://res.cloudinary.com/CLOUD_NAME/image/upload/sapiens.jpg', youtubeId:'VIDEO_ID_5', bg:'#1a2e1a', accent:'#4ade80' },
  { id:'6', title:'Start with Why', author:'Simon Sinek', category:'Kinh doanh', time:14, rating:4.4, isNew:true, image:'https://res.cloudinary.com/CLOUD_NAME/image/upload/start-with-why.jpg', youtubeId:'VIDEO_ID_6', bg:'#1e1b4b', accent:'#818cf8' },
  { id:'7', title:'Zero to One', author:'Peter Thiel', category:'Kinh doanh', time:9, rating:4.6, image:'https://res.cloudinary.com/CLOUD_NAME/image/upload/zero-to-one.jpg', youtubeId:'VIDEO_ID_7', bg:'#18181b', accent:'#e5e7eb' },
  { id:'8', title:'The Subtle Art', author:'Mark Manson', category:'Tâm lý học', time:7, rating:4.3, isNew:true, image:'https://res.cloudinary.com/CLOUD_NAME/image/upload/subtle-art.jpg', youtubeId:'VIDEO_ID_8', bg:'#7c1d1d', accent:'#fca5a5' },
] as const;

type Book = typeof BOOKS[number];
const CATS = ['Kinh doanh','Tâm lý học','Năng suất','Lịch sử','Triết học'];
const FILTERS = [{l:'Tất cả',k:'all'},{l:'Mới nhất',k:'new'},{l:'Phổ biến',k:'popular'},{l:'Ngắn nhất',k:'short'}];

function YouTubePlayer({ youtubeId, playing }: { youtubeId: string; playing: boolean }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${playing?1:0}&controls=1&rel=0&modestbranding=1`}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
}

export default function HomePage() {
  const [activeNav, setActiveNav] = useState(0);
  const [filter, setFilter] = useState('all');
  const [player, setPlayer] = useState<Book|null>(null);
  const [playing, setPlaying] = useState(false);
  const [showYT, setShowYT] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [screenW, setScreenW] = useState(1200);
  const [imgErrors, setImgErrors] = useState<Record<string,boolean>>({});

  useEffect(() => {
    const update = () => setScreenW(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const isMobile = screenW < 768;

  const books = (() => {
    const list = [...BOOKS] as any[];
    if(filter==='new') return list.filter((b:any)=>b.isNew);
    if(filter==='popular') return [...list].sort((a:any,b:any)=>b.rating-a.rating);
    if(filter==='short') return [...list].sort((a:any,b:any)=>a.time-b.time);
    return list;
  })();

  const openPlayer = (book: Book) => {
    setPlayer(book);
    setPlaying(true);
    setShowYT(false);
    setTimeout(() => setShowYT(true), 100);
  };

  const SidebarInner = () => (
    <div style={{display:'flex',flexDirection:'column',height:'100%',backgroundColor:'#042C53',width:'100%'}}>
      <div style={{padding:'20px',borderBottom:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'28px',height:'28px',borderRadius:'8px',backgroundColor:'#00D26A',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <div>
            <div style={{color:'#fff',fontWeight:700,fontSize:'14px'}}>Học Qua Sách</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:'9px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Book Summaries</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={()=>setSidebarOpen(false)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.7)',padding:'4px'}}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>
      <div style={{padding:'12px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        {['Khám phá','Thư viện','Danh mục'].map((n,i)=>(
          <button key={n} onClick={()=>{setActiveNav(i);setSidebarOpen(false);}} style={{width:'100%',display:'flex',alignItems:'center',gap:'10px',padding:'9px 12px',borderRadius:'8px',fontSize:'13px',fontWeight:500,marginBottom:'2px',border:'none',cursor:'pointer',textAlign:'left',backgroundColor:activeNav===i?'rgba(0,210,106,0.12)':'transparent',color:activeNav===i?'#fff':'rgba(255,255,255,0.55)',borderLeft:activeNav===i?'2px solid #00D26A':'2px solid transparent'}}>
            {n}{activeNav===i&&<span style={{marginLeft:'auto',width:'6px',height:'6px',borderRadius:'50%',backgroundColor:'#00D26A'}}/>}
          </button>
        ))}
      </div>
      <div style={{padding:'12px',flex:1}}>
        <div style={{color:'rgba(255,255,255,0.3)',fontSize:'9px',fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',padding:'0 12px 8px'}}>Danh mục</div>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setSidebarOpen(false)} style={{width:'100%',display:'flex',padding:'8px 12px',borderRadius:'8px',fontSize:'13px',border:'none',cursor:'pointer',backgroundColor:'transparent',color:'rgba(255,255,255,0.55)',textAlign:'left'}}>{c}</button>
        ))}
      </div>
      <div style={{margin:'12px',padding:'14px',borderRadius:'10px',backgroundColor:'rgba(0,210,106,0.1)'}}>
        <div style={{color:'#fff',fontWeight:700,fontSize:'12px',marginBottom:'4px'}}>Nâng cấp Premium</div>
        <div style={{color:'rgba(255,255,255,0.45)',fontSize:'10px',marginBottom:'10px',lineHeight:1.4}}>Đọc không giới hạn 2,500+ sách</div>
        <button style={{width:'100%',padding:'8px',borderRadius:'8px',backgroundColor:'#00D26A',color:'#fff',fontWeight:700,fontSize:'12px',border:'none',cursor:'pointer'}}>Dùng thử miễn phí</button>
      </div>
    </div>
  );

  const featured = BOOKS[0];

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f3f4f6}
        input{font-family:inherit;font-size:13px}
        button{font-family:inherit}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:4px}
      `}</style>

      <div style={{display:'flex',height:'100dvh',maxWidth:'960px',margin:'0 auto',background:'#fff',overflow:'hidden',position:'relative',boxShadow:'0 0 40px rgba(0,0,0,0.08)'}}>

        {!isMobile && (
          <div style={{width:'224px',flexShrink:0,height:'100%',overflow:'hidden'}}>
            <SidebarInner/>
          </div>
        )}

        {isMobile && sidebarOpen && (
          <>
            <div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.55)',zIndex:40}}/>
            <div style={{position:'fixed',top:0,left:0,bottom:0,width:'280px',zIndex:50,overflow:'hidden'}}>
              <SidebarInner/>
            </div>
          </>
        )}

        <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,overflow:'hidden'}}>

          <header style={{height:'54px',display:'flex',alignItems:'center',gap:'10px',padding:'0 16px',borderBottom:'1px solid #f3f4f6',background:'#fff',flexShrink:0}}>
            {isMobile && (
              <button onClick={()=>setSidebarOpen(true)} style={{background:'none',border:'none',cursor:'pointer',padding:'4px',color:'#374151',flexShrink:0}}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            )}
            <div style={{flex:1,display:'flex',alignItems:'center',gap:'8px',padding:'7px 12px',borderRadius:'10px',backgroundColor:'#f9fafb',border:'1px solid #e5e7eb'}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input placeholder="Tìm kiếm sách..." style={{flex:1,background:'transparent',border:'none',outline:'none',color:'#1f2937'}}/>
            </div>
            <div style={{width:'30px',height:'30px',borderRadius:'50%',backgroundColor:'#00D26A',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'12px',fontWeight:700,cursor:'pointer',flexShrink:0}}>P</div>
          </header>

          <div style={{flex:1,overflowY:'auto',backgroundColor:'#f9fafb',paddingBottom:player?'280px':'0'}}>
            <div style={{padding:isMobile?'14px':'20px'}}>

              {/* HERO */}
              <div style={{borderRadius:'14px',padding:isMobile?'16px':'20px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'16px',cursor:'pointer',backgroundColor:featured.bg}} onClick={()=>openPlayer(featured)}>
                <div style={{flexShrink:0,width:isMobile?'70px':'90px',height:isMobile?'98px':'126px',borderRadius:'10px',overflow:'hidden',boxShadow:'0 8px 24px rgba(0,0,0,0.3)'}}>
                  {!imgErrors[featured.id] ? (
                    <img src={featured.image} alt={featured.title} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={()=>setImgErrors(e=>({...e,[featured.id]:true}))}/>
                  ) : (
                    <div style={{width:'100%',height:'100%',backgroundColor:`${featured.accent}22`,display:'flex',alignItems:'center',justifyContent:'center',padding:'8px',textAlign:'center'}}>
                      <span style={{color:'#fff',fontWeight:900,fontSize:'9px',lineHeight:1.3}}>{featured.title}</span>
                    </div>
                  )}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'inline-block',fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',padding:'3px 10px',borderRadius:'20px',marginBottom:'8px',backgroundColor:`${featured.accent}25`,color:featured.accent}}>⚡ Nổi bật tuần này</div>
                  <div style={{fontSize:isMobile?'18px':'22px',fontWeight:900,color:'#fff',marginBottom:'4px',lineHeight:1.2}}>{featured.title}</div>
                  <div style={{fontSize:'13px',marginBottom:'10px',color:'rgba(255,255,255,0.6)'}}>{featured.author}</div>
                  <div style={{display:'flex',gap:'14px',fontSize:'11px',color:'rgba(255,255,255,0.5)',marginBottom:'14px'}}>
                    <span>⏱ {featured.time} phút</span><span>★ {featured.rating}/5</span>
                  </div>
                  <button onClick={e=>{e.stopPropagation();openPlayer(featured);}} style={{display:'inline-flex',alignItems:'center',gap:'6px',backgroundColor:'#00D26A',color:'#fff',fontWeight:700,fontSize:'13px',padding:'8px 16px',borderRadius:'10px',border:'none',cursor:'pointer'}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                    Nghe ngay
                  </button>
                </div>
              </div>

              {/* FILTERS */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                <div style={{fontSize:'15px',fontWeight:700,color:'#111827'}}>Khám phá</div>
                <div style={{fontSize:'11px',color:'#9ca3af'}}>{books.length} sách</div>
              </div>
              <div style={{display:'flex',gap:'8px',marginBottom:'16px',overflowX:'auto',paddingBottom:'4px'}}>
                {FILTERS.map(f=>(
                  <button key={f.k} onClick={()=>setFilter(f.k)} style={{flexShrink:0,padding:'6px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:600,border:'none',cursor:'pointer',backgroundColor:filter===f.k?'#00D26A':'#f3f4f6',color:filter===f.k?'#fff':'#6b7280'}}>
                    {f.l}
                  </button>
                ))}
              </div>

              {/* BOOK GRID */}
              <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(auto-fill,minmax(140px,1fr))',gap:isMobile?'12px':'16px'}}>
                {books.map((book:any)=>(
                  <div key={book.id} style={{cursor:'pointer'}} onClick={()=>openPlayer(book)}>
                    <div style={{position:'relative',borderRadius:'10px',overflow:'hidden',marginBottom:'8px',aspectRatio:'3/4',backgroundColor:book.bg}}>
                      {!imgErrors[book.id] ? (
                        <img src={book.image} alt={book.title} style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} onError={()=>setImgErrors(e=>({...e,[book.id]:true}))}/>
                      ) : (
                        <>
                          <div style={{position:'absolute',top:0,right:0,width:'40px',height:'40px',borderRadius:'50%',backgroundColor:book.accent,opacity:0.2,transform:'translate(30%,-30%)'}}/>
                          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',padding:'12px',textAlign:'center'}}>
                            <span style={{color:'#fff',fontWeight:900,fontSize:'9px',lineHeight:1.3,zIndex:1}}>{book.title}</span>
                          </div>
                        </>
                      )}
                      {book.isNew&&<div style={{position:'absolute',top:'8px',left:'8px',backgroundColor:'#00D26A',color:'#fff',fontWeight:700,borderRadius:'20px',padding:'2px 6px',fontSize:'8px',zIndex:2}}>Mới</div>}
                      {book.hot&&<div style={{position:'absolute',top:'8px',backgroundColor:'#f59e0b',color:'#78350f',fontWeight:700,borderRadius:'20px',padding:'2px 6px',fontSize:'8px',zIndex:2,left:(book as any).isNew?'36px':'8px'}}>Hot</div>}
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',zIndex:1}}/>
                    </div>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#111827',marginBottom:'2px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{book.title}</div>
                    <div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'6px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{book.author}</div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontSize:'11px',color:'#9ca3af'}}>⏱ {book.time} min</span>
                      <button onClick={e=>{e.stopPropagation();openPlayer(book);}} style={{width:'22px',height:'22px',borderRadius:'50%',backgroundColor:'#00D26A',display:'flex',alignItems:'center',justifyContent:'center',border:'none',cursor:'pointer',flexShrink:0}}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="white" style={{marginLeft:'1px'}}><path d="M5 3l14 9-14 9V3z"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* YOUTUBE PLAYER PANEL */}
          {player && (
            <div style={{position:'absolute',bottom:0,left:isMobile?0:'224px',right:0,backgroundColor:'#042C53',borderTop:'1px solid rgba(255,255,255,0.1)',zIndex:30}}>
              {/* Mini info bar */}
              <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <div style={{width:'36px',height:'48px',borderRadius:'6px',overflow:'hidden',flexShrink:0}}>
                  {!imgErrors[player.id] ? (
                    <img src={player.image} alt={player.title} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={()=>setImgErrors(e=>({...e,[player.id]:true}))}/>
                  ) : (
                    <div style={{width:'100%',height:'100%',backgroundColor:player.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{color:'rgba(255,255,255,0.8)',fontSize:'6px',fontWeight:900,textAlign:'center',padding:'2px'}}>{player.title.slice(0,6)}</span>
                    </div>
                  )}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:'#fff',fontSize:'13px',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{player.title}</div>
                  <div style={{color:'rgba(255,255,255,0.5)',fontSize:'11px'}}>{player.author} · {player.time} phút</div>
                </div>
                <button onClick={()=>{setPlayer(null);setShowYT(false);}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.6)',padding:'4px',flexShrink:0}}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {/* YouTube embed */}
              <div style={{position:'relative',width:'100%',paddingBottom:'56.25%',backgroundColor:'#000'}}>
                {showYT && (
                  <YouTubePlayer youtubeId={player.youtubeId} playing={playing}/>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
