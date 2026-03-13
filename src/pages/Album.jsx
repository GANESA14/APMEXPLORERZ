import { useState, useEffect, useCallback, useMemo } from 'react';

const IMAGES = [
  { t: 'image', s: '/Album/image.webp' },
  ...Array.from({ length: 25 }, (_, i) => ({ 
    t: 'image', 
    s: `/Album/image${i + 1}.webp` 
  })),
  ...Array.from({ length: 12 }, (_, i) => ({ 
    t: 'video', 
    s: `/Album/vid${i + 1}.webm`,
    thumb: `/Album/vid${i + 1}-thumb.webp`
  })),
];

export default function Album() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [loaded, setLoaded] = useState({});

  const visible = useMemo(() => {
    return IMAGES.filter(m => filter === 'all' || m.t === filter);
  }, [filter]);

  const closeLb = useCallback(() => { 
    setLightbox(null); 
    document.body.style.overflow = ''; 
  }, []);

  useEffect(() => {
    const onKey = e => {
      if (lightbox === null) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + visible.length) % visible.length);
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % visible.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, visible.length, closeLb]);

  const openLb = useCallback((globalIdx) => {
    const targetSrc = IMAGES[globalIdx].s;
    const vidx = visible.findIndex(m => m.s === targetSrc);
    if (vidx === -1) return;
    setLightbox(vidx);
    document.body.style.overflow = 'hidden';
  }, [visible]);

  const lbItem = lightbox !== null ? visible[lightbox] : null;

  return (
    <>
      <div style={{ padding: 'clamp(90px,13vw,140px) clamp(1rem,4vw,2.5rem) clamp(28px,5vw,60px)', maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF3D00', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 20, height: 2, background: '#FF3D00', display: 'inline-block' }} />Gallery
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2.6rem,8vw,7rem)', letterSpacing: '0.02em', lineHeight: 0.95, color: 'var(--text)' }}>
            OUR <span style={{ color: '#FF3D00' }}>ALBUM</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'image', 'video'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: 'clamp(6px,1.5vw,8px) clamp(12px,3vw,20px)', borderRadius: 6, fontSize: 'clamp(0.72rem,1.8vw,0.82rem)', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'all .2s', border: filter === f ? 'none' : '1.5px solid var(--border2)', background: filter === f ? 'linear-gradient(135deg,#FF3D00,#FF8A00)' : 'transparent', color: filter === f ? '#fff' : 'var(--text2)' }}>
              {f === 'all' ? 'All' : f === 'image' ? 'Photos' : 'Videos'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 clamp(1rem,4vw,2.5rem) clamp(60px,8vw,80px)', maxWidth: 1200, margin: '0 auto' }}>
        <div className="masonry-grid">
          {IMAGES.map((m, i) => {
            if (filter !== 'all' && m.t !== filter) return null;
            
            const imgSrc = m.t === 'video' ? m.thumb : m.s;
            const isLoaded = loaded[imgSrc];

            return (
              <div key={m.s + i} onClick={() => openLb(i)}
                className="masonry-item"
                style={{ breakInside: 'avoid', marginBottom: 14, borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer', background: 'var(--surface2)', aspectRatio: isLoaded ? undefined : '4/3' }}>
                
                {!isLoaded && (
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--surface2)', zIndex: 1 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)', animation: 'shimmer 1.5s infinite' }} />
                  </div>
                )}

                <img 
                  src={imgSrc} 
                  alt={`Media ${i + 1}`} 
                  loading={i < 9 ? 'eager' : 'lazy'}
                  decoding="async"
                  onLoad={() => setLoaded(p => ({ ...p, [imgSrc]: true }))}
                  style={{ width: '100%', display: 'block', borderRadius: 12, opacity: isLoaded ? 1 : 0, transition: 'opacity .4s, transform .4s cubic-bezier(.16,1,.3,1)' }} 
                />
                
                {m.t === 'video' && (
                  <div style={{ position: 'absolute', bottom: 10, right: 10, width: 30, height: 30, borderRadius: '50%', background: '#FF3D00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', zIndex: 2 }}>
                    <i className="fas fa-play" />
                  </div>
                )}
                
                <div className="gallery-overlay"
                  style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s', zIndex: 3 }}>
                  <i className="fas fa-expand" style={{ color: '#fff', fontSize: '1.8rem', opacity: 0, transform: 'scale(.7)', transition: 'all .3s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lbItem && (
        <div onClick={e => { if (e.target === e.currentTarget) closeLb(); }}
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(10px,3vw,24px)' }}>
          <button onClick={closeLb}
            style={{ position: 'absolute', top: 16, right: 16, width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            onMouseEnter={e => e.currentTarget.style.background = '#FF3D00'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}>
            <i className="fas fa-xmark" />
          </button>
          
          <button onClick={() => setLightbox(i => (i - 1 + visible.length) % visible.length)}
            style={{ position: 'absolute', left: 'clamp(8px,2vw,20px)', top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <i className="fas fa-chevron-left" />
          </button>
          
          <button onClick={() => setLightbox(i => (i + 1) % visible.length)}
            style={{ position: 'absolute', right: 'clamp(8px,2vw,20px)', top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <i className="fas fa-chevron-right" />
          </button>
          
          {lbItem.t === 'image'
            ? <img src={lbItem.s} alt="media" style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' }} />
            : <video src={lbItem.s} controls autoPlay preload="auto" style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, outline: 'none' }} />
          }
        </div>
      )}

      <style>{`
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        .masonry-grid{columns:3;column-gap:14px}
        .masonry-item img { will-change: transform, opacity; }
        .masonry-item:hover img {transform:scale(1.04)}
        .masonry-item:hover .gallery-overlay {background:rgba(0,0,0,.4)!important}
        .masonry-item:hover .gallery-overlay i {opacity:1!important;transform:scale(1)!important}
        @media(max-width:900px){.masonry-grid{columns:2}}
        @media(max-width:480px){.masonry-grid{columns:1}}
      `}</style>
    </>
  );
}