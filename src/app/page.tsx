"use client";
import React, { useState, useEffect } from 'react';
// Import dữ liệu từ file kho chứa
import { books as BOOKS_DATA } from '../data/books';
export default function HocQuaSachPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [screenW, setScreenW] = useState(1200);
  // Danh mục lấy từ ảnh giao diện của bạn
  const CATS = ['Kinh doanh', 'Tâm lý học', 'Năng suất', 'Lịch sử', 'Triết học'];
  useEffect(() => {
    const update = () => setScreenW(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const isMobile = screenW < 768;
  // LOGIC LỌC SÁCH: Kết hợp lọc theo Danh mục và Tìm kiếm
  const filteredBooks = BOOKS_DATA.filter(book => {
    const matchCategory = activeCategory === 'Tất cả' || book.category === activeCategory;
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });
  const SidebarInner = () => (
    <div style={{display:'flex',flexDirection:'column',height:'100%',backgroundColor:'#042C53',width:'100%'}}>
      <div style={{padding:'20px',borderBottom:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',gap:'8px'}}>
        <div style={{width:'28px',height:'28px',borderRadius:'8px',backgroundColor:'#00D26A',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{color:'white', fontWeight: 'bold'}}>H</span>
        </div>
        <div>
          <div style={{color:'#fff',fontWeight:700,fontSize:'14px'}}>Học Qua Sách</div>
          <div style={{color:'rgba(255,255,255,0.4)',fontSize:'9px',textTransform:'uppercase'}}>Book Summaries</div>
        </div>
      </div>
      <div style={{padding:'12px', flex: 1}}>
        <div style={{color:'rgba(255,255,255,0.3)',fontSize:'9px',fontWeight:600,textTransform:'uppercase',padding:'0 12px 8px'}}>Danh mục</div>
        {/* Nút "Tất cả" */}
        <button 
          onClick={() => {setActiveCategory('Tất cả'); setSidebarOpen(false);}}
          style={{
            width:'100%', display:'flex', padding:'10px 12px', borderRadius:'8px', fontSize:'13px', border:'none', cursor:'pointer', textAlign:'left', marginBottom: '4px',
            backgroundColor: activeCategory === 'Tất cả' ? 'rgba(0,210,106,0.15)' : 'transparent',
            color: activeCategory === 'Tất cả' ? '#00D26A' : 'rgba(255,255,255,0.6)'
          }}
        >
          Tất cả sách
        </button>
        {/* Danh sách các danh mục động */}
        {CATS.map(c => (
          <button 
            key={c} 
            onClick={() => {setActiveCategory(c); setSidebarOpen(false);}} 
            style={{
              width:'100%', display:'flex', padding:'10px 12px', borderRadius:'8px', fontSize:'13px', border:'none', cursor:'pointer', textAlign:'left', marginBottom: '4px',
              backgroundColor: activeCategory === c ? 'rgba(0,210,106,0.15)' : 'transparent',
              color: activeCategory === c ? '#00D26A' : 'rgba(255,255,255,0.6)'
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={{margin:'12px',padding:'14px',borderRadius:'10px',backgroundColor:'rgba(0,210,106,0.1)'}}>
        <div style={{color:'#fff',fontWeight:700,fontSize:'12px',marginBottom:'4px'}}>Nâng cấp Premium</div>
        <button style={{width:'100%',padding:'8px',borderRadius:'8px',backgroundColor:'#00D26A',color:'#fff',fontWeight:700,fontSize:'12px',border:'none',cursor:'pointer'}}>Dùng thử miễn phí</button>
      </div>
    </div>
  );
  return (
    <div style={{display:'flex',height:'100dvh',maxWidth:'1200px',margin:'0 auto',background:'#fff',position:'relative'}}>
      {/* Sidebar - Desktop & Mobile */}
      {!isMobile && <div style={{width:'224px',flexShrink:0}}><SidebarInner/></div>}
      {isMobile && sidebarOpen && (
        <div style={{position:'fixed',inset:0,zIndex:50, display:'flex'}}>
          <div onClick={()=>setSidebarOpen(false)} style={{flex:1, background:'rgba(0,0,0,0.5)'}}/>
          <div style={{width:'260px'}}><SidebarInner/></div>
        </div>
      )}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden', backgroundColor: '#f9fafb'}}>
        {/* Header với Search */}
        <header style={{height:'60px',display:'flex',alignItems:'center',gap:'12px',padding:'0 20px',borderBottom:'1px solid #eee',background:'#fff'}}>
          {isMobile && <button onClick={()=>setSidebarOpen(true)}>☰</button>}
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
        {/* Nội dung chính: Grid sách */}
        <main style={{flex:1, overflowY:'auto', padding:'20px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <h2 style={{fontSize:'18px', fontWeight:800}}>{activeCategory}</h2>
            <span style={{fontSize:'12px', color:'#999'}}>{filteredBooks.length} kết quả</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(160px, 1fr))', gap:'20px'}}>
            {filteredBooks.map((book, idx) => (
              <div key={idx} style={{cursor:'pointer'}}>
                <div style={{position:'relative', borderRadius:'12px', overflow:'hidden', aspectRatio:'3/4', backgroundColor: book.bg, marginBottom:'8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                  <img src={book.image} alt={book.title} style={{width:'100%', height:'100%', objectFit:'cover', opacity: 0.8}} />
                  <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'10px', textAlign:'center'}}>
                    <span style={{color:'white', fontWeight:800, fontSize:'11px'}}>{book.title}</span>
                  </div>
                  {book.isHot && <div style={{position:'absolute', top:8, left:8, background:'#f59e0b', color:'white', fontSize:'8px', fontWeight:900, padding:'2px 6px', borderRadius:'4px'}}>HOT</div>}
                </div>
                <div style={{fontSize:'13px', fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{book.title}</div>
                <div style={{fontSize:'11px', color:'#999'}}>{book.author}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
