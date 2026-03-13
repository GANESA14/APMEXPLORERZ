import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';

const INSTAGRAM_PLACEHOLDER = "./PlaceHolder.jpeg";

const VIDEOS = [
  { p: 'youtube', id: '4HkkBVreYgg', title: 'Mountain Trail Adventure 2024' },
  { p: 'youtube', id: 'hlKet6Y8uTg', title: 'Coastal Highway Journey' },
  { p: 'instagram', id: 'CpDSyISPTIL', title: 'Weekend Ride Highlights' },
  { p: 'youtube', id: 'qbFwqsRyx5Y', title: 'Desert Expedition Chronicles' },
  { p: 'instagram', id: 'CpLDPy2sXPo', title: 'City Night Ride' },
  { p: 'youtube', id: 'eNEvKJbmVdM', title: 'Forest Trail Exploration' },
  { p: 'instagram', id: 'CpxsRS8rKy6', title: 'Sunset Ride Session' },
  { p: 'youtube', id: 'dE58L4lgx88', title: 'Interstate Road Trip' },
  { p: 'instagram', id: 'Cv9CPhWNlur', title: 'Group Ride Compilation' },
  { p: 'instagram', id: 'CwaFwboNRvA', title: 'Evening Chase' },
  { p: 'instagram', id: 'Cw2WkkXrd0G', title: 'Backroads Discovery' },
  { p: 'instagram', id: 'CziBVkzLk8n', title: 'Weekend Escape' },
  { p: 'instagram', id: 'Cx6vyKqP7Qn', title: 'Golden Hour Ride' },
  { p: 'instagram', id: 'C7vdjeVInz4', title: 'The Long Way Round' },
];

export default function VideoGrid() {
  const [filter, setFilter] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  const visibleVideos = useMemo(() => 
    VIDEOS.filter(v => filter === 'all' || v.p === filter), 
  [filter]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const cards = gridRef.current?.querySelectorAll('.video-card');
    if (cards && cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 15, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [filter, loading]);

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1200px', 
      margin: 'auto', 
      background: 'var(--bg)', 
      minHeight: '100vh', 
      color: 'var(--text)',
      transition: 'background 0.4s ease, color 0.4s ease'
    }}>

      <div style={{ position:'relative', zIndex:1, padding:'clamp(60px,10vw,100px) 1rem 40px', textAlign:'center', maxWidth:860, margin:'0 auto' }}>
        <div style={{ 
          display:'inline-flex', alignItems:'center', gap:8, fontSize:'0.7rem', fontWeight:700, 
          letterSpacing:'.2em', textTransform:'uppercase', color:'#FF3D00', 
          border:'1px solid rgba(255,61,0,.3)', padding:'6px 16px', borderRadius:100, 
          marginBottom:22, background:'rgba(255,61,0,.05)' 
        }}>
          <span style={{ width:6, height:6, background:'#FF3D00', borderRadius:'50%', display:'inline-block' }} />
          Our VIDEOS
        </div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(2.8rem,9vw,7.5rem)', lineHeight:.88, letterSpacing:'.02em', marginBottom:18, color: 'var(--text)' }}>
          RIDE <em style={{ color:'#FF3D00', fontStyle:'normal' }}>VIDEOS</em>
        </h1>
        <p style={{ color:'var(--text2)', fontSize:'clamp(0.88rem,2vw,1.05rem)', lineHeight:1.7, maxWidth:480, margin:'0 auto' }}>
          Join us on the asphalt and the dirt. Watch the best moments, tightest corners, and unforgettable journeys from our riding community.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', justifyContent: 'center' }}>
        {['all', 'youtube', 'instagram'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setActiveVideo(null); }}
            style={{ 
              padding: '10px 24px', borderRadius: '30px', border: '1px solid var(--border)', 
              background: filter === f ? '#FF3D00' : 'var(--bg3)',
              color: filter === f ? '#fff' : 'var(--text2)',
              cursor: 'pointer', fontWeight: '600', textTransform: 'uppercase', transition: '0.3s'
            }}>
            {f}
          </button>
        ))}
      </div>

      <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {visibleVideos.map((video) => {
          const thumbUrl = video.p === 'youtube' 
            ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg` 
            : INSTAGRAM_PLACEHOLDER;

          const isPlaying = activeVideo === video.id;

          return (
            <div key={video.id} className="video-card" style={{ background: 'var(--bg2)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', cursor: 'pointer' }}
                   onClick={() => setActiveVideo(video.id)}>
                {!isPlaying ? (
                  <>
                    <img src={thumbUrl} alt={video.title} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,61,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <iframe 
                    src={video.p === 'youtube' 
                      ? `https://www.youtube.com/embed/${video.id}?autoplay=1` 
                      : `https://www.instagram.com/reel/${video.id}/embed`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; fullscreen"
                    title={video.title}
                  />
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', background: 'var(--surface2)', color: video.p === 'youtube' ? '#ff4444' : '#e1306c', fontWeight: 'bold', textTransform: 'uppercase', display: 'inline-block', marginBottom: '8px' }}>
                  {video.p}
                </span>
                <h3 style={{ fontSize: '16px', margin: 0, color: 'var(--text)', lineHeight: '1.4' }}>{video.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
