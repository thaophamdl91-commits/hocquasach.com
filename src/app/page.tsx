"use client";
import React, { useState, useEffect } from 'react';
// Đảm bảo đường dẫn này đúng với file books.ts bạn đã tạo
import { books as BOOKS_DATA } from '../data/books';
// Định nghĩa danh mục khớp với dữ liệu trong books.ts
const CATS = ['Kinh doanh', 'Khởi nghiệp', 'Marketing', 'Kinh tế học', 'Phát triển bản thân', 'Tâm lý học'];
export default function HocQuaSachPage() {
  // 1. Khai báo tất cả các State cần thiết
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [screenW, setScreenW] = useState(1200);
  const [player, setPlayer] = useState<any>(null);
  // 2. Xử lý kích thước màn hình (Responsive)
  useEffect(() => {
    const update = () => setScreenW(window.innerWidth);
    if (typeof window !== 'undefined') {
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
  }, []);
  const isMobile = screenW < 768;
  // 3. Logic Lọc sách (Search + Category)
  const filteredBooks = BOOKS_DATA.filter(book => {
    const matchCategory = activeCategory === 'Tất cả' || book.category === activeCategory;
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });
  // 4. Giao diện Sidebar
  const SidebarInner = () => (
    <div style={{display:'flex',flexDirection:'column',height:'100%',backgroundColor:'#042C53',width:'100%'}}>
      <div style={{padding:'20px',borderBottom:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:'28px',height:'28px',borderRadius:'8px',backgroundColor:'#00D26A',display:'flex',alignItems:'center',justifyContent:'center', color:'white', fontWeight:'bold'}}>H</div>
        <div>
          <div style={{color:'#fff',fontWeight:700,fontSize:'14px'}}>Học Qua Sách</div>
          <div style={{color:'rgba(255,255,255,0.4)',fontSize:'9px',textTransform:'uppercase'}}>Book Summaries</div>
        </div>
      </div>
      <div style={{padding:'12px', flex: 1, overflowY: 'auto'}}>
        <div style={{color:'rgba(255,255,255,0.3)',fontSize:'9px',fontWeight:600,textTransform:'uppercase',padding:'0 12px 8px'}}>Danh mục</div>
        <button 
          onClick={() => {setActiveCategory('Tất cả'); setSidebarOpen(false);}}
          style={{width:'100%', padding:'10px 12px', borderRadius:'8px', fontSize:'13px', border:'none', cursor:'pointer', textAlign:'left', marginBottom:'4px', backgroundColor: activeCategory === 'Tất cả' ? 'rgba(0,210,106,0.15)' : 'transparent', color: activeCategory === 'Tất cả' ? '#00D26A' : 'rgba(255,255,255,0.6)'}}
        >
          Tất cả sách
        </button>
        {CATS.map(c => (
          <button 
            key={c} 
            onClick={() => {setActiveCategory(c); setSidebarOpen(false);}} 
            style={{width:'100%', padding:'10px 12px', borderRadius:'8px', fontSize:'13px', border:'none', cursor:'pointer', textAlign:'left', marginBottom:'4px', backgroundColor: activeCategory === c ? 'rgba(0,210,106,0.15)' : 'transparent', color: activeCategory === c ? '#00D26A' : 'rgba(255,255,255,0.6)'}}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{display:'flex',height:'100dvh',maxWidth:'1440px',margin:'0 auto',background:'#fff',position:'relative', overflow:'hidden'}}>
      {!isMobile && <div style={{width:'240px',flexShrink:0}}><SidebarInner/></div>}
      {isMobile && sidebarOpen && (
        <div style={{position:'fixed',inset:0,zIndex:50, display:'flex'}}>
          <div onClick={()=>setSidebarOpen(false)} style={{flex:1, background:'rgba(0,0,0,0.6)'}}/>
          <div style={{width:'280px'}}><SidebarInner/></div>
        </div>
      )}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden', backgroundColor: '#f9fafb'}}>
        <header style={{height:'60px',display:'flex',alignItems:'center',gap:'12px',padding:'0 20px',borderBottom:'1px solid #eee',background:'#fff'}}>
          {isMobile && <button onClick={()=>setSidebarOpen(true)} style={{background:'none', border:'none', fontSize:'20px'}}>☰</button>}
          <div style={{flex:1, display:'flex', alignItems:'center', background:'#f3f4f6', padding:'8px 12px', borderRadius:'10px'}}>
            <input 
              placeholder="Tìm tên sách hoặc tác giả..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{width:'100%', border:'none', background:'transparent', outline:'none', fontSize:'13px'}}
            />
          </div>
          <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'#00D26A', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>P</div>
        </header>
        <main style={{flex:1, overflowY:'auto', padding:'20px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <h2 style={{fontSize:'20px', fontWeight:800, color:'#111827'}}>{activeCategory}</h2>
            <span style={{fontSize:'12px', color:'#9ca3af'}}>{filteredBooks.length} cuốn sách</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))', gap:'20px'}}>
            {filteredBooks.map((book, idx) => (
              <div key={idx} style={{cursor:'pointer', group: 'true'}}>
                <div style={{position:'relative', borderRadius:'14px', overflow:'hidden', aspectRatio:'3/4', backgroundColor: book.bg, marginBottom:'10px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
                  <img src={book.image} alt={book.title} style={{width:'100%', height:'100%', objectFit:'cover', opacity: 0.85}} />
                  <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'15px', textAlign:'center', background:'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'}}>
                    <span style={{color:'white', fontWeight:800, fontSize:'12px', lineHeight: 1.3}}>{book.title}</span>
                  </div>
                  {book.isHot && <div style={{position:'absolute', top:10, left:10, background:'#f59e0b', color:'white', fontSize:'9px', fontWeight:900, padding:'3px 8px', borderRadius:'6px'}}>HOT</div>}
                </div>
                <div style={{fontSize:'14px', fontWeight:700, color:'#111827', marginBottom:'2px'}}>{book.title}</div>
                <div style={{fontSize:'12px', color:'#6b7280'}}>{book.author}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
