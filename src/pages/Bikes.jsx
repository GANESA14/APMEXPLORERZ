import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

gsap.registerPlugin(ScrollTrigger);

const BIKES = [
  { name: 'Bajaj Discover',         cat: 'Commuter', desc: 'Built for reliability, perfected for everyday adventure. A trusty companion for every journey.',            img: '/bikes/Bajaj-Discover-100-Side-1798.webp',                         specs: [['Engine','100cc'],['Power','7.8 HP'],['Type','Dual Sport']] },
  { name: 'Royal Enfield Classic 350', cat: 'Premium', desc: 'Timeless design meets modern engineering. The perfect companion for long highway cruises.',               img: '/bikes/royal-enfield-classic-350-ash-white.webp',                  specs: [['Engine','350cc'],['Power','20.2 HP'],['Type','Cruiser']] },
  { name: 'Hero Splendor',           cat: 'Cruiser', desc: 'Reliable and efficient. The iconic bike that has stood the test of time on Indian roads.',                  img: '/bikes/splendor-plus-right-side-view-2.webp',                      specs: [['Engine','100cc'],['Power','8.3 HP'],['Type','Commuter']] },
  { name: 'TVS Sport',               cat: 'Sport',   desc: 'Agile and responsive. Perfect for navigating city streets and suburban adventures.',                        img: '/bikes/tvs-sport-kick-start-alloy-electric-green-86695509-ibt24.webp', specs: [['Engine','110cc'],['Power','8.9 HP'],['Type','Naked Sport']] },
  { name: 'Honda Activa 3G',         cat: 'Scooter', desc: 'The undisputed king of Indian streets. Effortless gearless riding, unmatched reliability.',                img: '/bikes/Activa.webp',                                               specs: [['Engine','109cc'],['Power','8.0 HP'],['Type','Scooter']] },
];
const ICON_MAP = { Engine: 'fa-cogs', Power: 'fa-bolt', Type: 'fa-motorcycle' };

export default function Bikes() {
  const heroRef = useRef(null);

  useEffect(() => {
    AOS.refresh();
    const ctx = gsap.context(() => {
      gsap.to(heroRef.current, {
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        y: 100, opacity: 0, ease: 'none',
      });
      gsap.to('.gsap-acc', { color: '#FF8A00', textShadow: '0 0 20px rgba(255,61,0,.6)', repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut' });
      gsap.utils.toArray('.gsap-card').forEach(card => {
        const img   = card.querySelector('.gsap-img');
        const badge = card.querySelector('.gsap-badge');
        if (img)   gsap.to(img,   { scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 }, y: 20, ease: 'none' });
        if (badge) gsap.to(badge, { y: -6, repeat: -1, yoyo: true, duration: 1.5 + Math.random(), ease: 'sine.inOut' });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* HERO */}
      <div ref={heroRef} style={{ padding: 'clamp(100px,14vw,160px) clamp(1rem,4vw,2.5rem) clamp(40px,7vw,80px)', maxWidth: 1200, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', willChange: 'transform,opacity' }}>
        <div data-aos="fade-down" data-aos-delay="100"
          style={{ fontSize: 'clamp(0.7rem,1.8vw,0.85rem)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF3D00', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 30, height: 2, background: '#FF3D00' }} />Our Garage<span style={{ width: 30, height: 2, background: '#FF3D00' }} />
        </div>
        <h1 data-aos="zoom-in" data-aos-delay="300"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3rem,9vw,7.5rem)', letterSpacing: '0.03em', lineHeight: 0.9, margin: '0 0 20px' }}>
          OUR <span className="gsap-acc" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', background: 'none' }}>BIKES</span>
        </h1>
        <p data-aos="fade-up" data-aos-delay="500"
          style={{ fontSize: 'clamp(0.88rem,2.2vw,1.25rem)', color: 'var(--text2)', maxWidth: 600, lineHeight: 1.6 }}>
          Meet the machines that take us on unforgettable adventures across landscapes and roads less traveled.
        </p>
      </div>

      {/* GRID */}
      <div style={{ padding: '0 clamp(1rem,4vw,2.5rem) clamp(80px,10vw,100px)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap: 'clamp(16px,3vw,32px)' }}>
          {BIKES.map((b, i) => (
            <div key={i} className="gsap-card" data-aos="fade-up" data-aos-delay={(i % 3) * 150}
              style={{ borderRadius: 24, overflow: 'hidden', background: '#1a1a1a', border: '1px solid rgba(255,255,255,.08)', transition: 'box-shadow .4s,border-color .4s', cursor: 'default', display: 'flex', flexDirection: 'column' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,61,0,.3)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)'; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ position: 'relative', overflow: 'hidden', height: 'clamp(180px,30vw,260px)', background: '#111' }}>
                <img className="gsap-img" src={b.img} alt={b.name} loading={i < 2 ? 'eager' : 'lazy'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .7s cubic-bezier(.16,1,.3,1)', opacity: .9 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#1a1a1a 0%,transparent 40%)', pointerEvents: 'none' }} />
                <div className="gsap-badge"
                  style={{ position: 'absolute', top: 14, right: 14, padding: '6px 14px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(20,20,20,.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', color: '#FF3D00', zIndex: 2 }}>
                  {b.cat}
                </div>
              </div>
              <div style={{ padding: 'clamp(16px,3vw,24px)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(1.5rem,4vw,2rem)', letterSpacing: '0.04em', marginBottom: 8 }}>{b.name}</div> */}
                <div style={{ color: '#FFFFFF', fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(1.5rem,4vw,2rem)', letterSpacing: '0.04em', marginBottom: 8 }}>{b.name}</div>
                <div style={{ fontSize: 'clamp(0.82rem,2vw,0.95rem)', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20, flexGrow: 1 }}>{b.desc}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.08)' }}>
                  {b.specs.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,.03)', padding: '10px 6px', borderRadius: 12 }}>
                      <i className={`fas ${ICON_MAP[k] || 'fa-info-circle'}`} style={{ fontSize: '1.1rem', color: '#FF3D00', marginBottom: 6 }} />
                      <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{k}</div>
                      {/* <div style={{ fontSize: 'clamp(0.72rem,1.8vw,0.85rem)', fontWeight: 700 }}>{v}</div> */}<div style={{ color: '#FFFFFF', fontSize: 'clamp(0.72rem,1.8vw,0.85rem)', fontWeight: 700 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
