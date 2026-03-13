import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 100, suffix: '+',  label: 'Adventures Captured' },
  { target: 50,  suffix: 'K+', label: 'Miles Traveled' },
  { target: 25,  suffix: '+',  label: 'Countries Explored' },
];
const FEATURES = [
  { icon: 'fa-earth-americas', title: 'Global Adventures', desc: "Breathtaking journeys across continents, capturing the world's most stunning landscapes." },
  { icon: 'fa-video',          title: '4K Content',        desc: 'Crystal clear videos capturing every moment in stunning cinematic detail.' },
  { icon: 'fa-motorcycle',     title: 'Epic Rides',        desc: 'Two-wheeled adventures through scenic routes and untamed terrain.' },
];

export default function Home() {
  const videoRef    = useRef(null);
  const heroContent = useRef(null);
  const accentRef   = useRef(null);
  const btnRef      = useRef(null);

  useEffect(() => {
    AOS.refresh();
    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
        scale: 1.15, ease: 'none',
      });
      gsap.to(heroContent.current, {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 120, opacity: 0, ease: 'none',
      });
      if (accentRef.current) {
        gsap.to(accentRef.current, { color: '#FF8A00', textShadow: '0 0 20px rgba(255,61,0,0.8)', repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut' });
      }
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = +el.dataset.target, suffix = el.dataset.suffix;
        gsap.to(el, {
          scrollTrigger: { trigger: '#stats', start: 'top 80%' },
          innerHTML: target, duration: 2, ease: 'power2.out', snap: { innerHTML: 1 },
          onUpdate() { el.innerHTML = Math.round(parseFloat(el.innerHTML)) + suffix; },
        });
      });
      gsap.utils.toArray('.gsap-card').forEach(card => {
        const icon = card.querySelector('.feature-icon');
        gsap.to(card, { scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 }, y: -30, ease: 'none' });
        card.addEventListener('mouseenter', () => gsap.to(icon, { rotation: 15, scale: 1.1, duration: 0.3, ease: 'back.out(1.7)' }));
        card.addEventListener('mouseleave', () => gsap.to(icon, { rotation: 0, scale: 1, duration: 0.3, ease: 'power2.out' }));
      });
      if (btnRef.current) gsap.to(btnRef.current, { y: -8, repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* HERO */}
      <section id="hero" style={{ position: 'relative', height: '100svh', minHeight: 500, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' }}>
          <source src="/videoplayback.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(8,8,8,.3) 0%,rgba(8,8,8,0) 40%,rgba(8,8,8,.92) 100%)', pointerEvents: 'none' }} />

        <div ref={heroContent} style={{ position: 'relative', zIndex: 2, padding: '0 clamp(1rem,5vw,2.5rem) clamp(4.5rem,12vh,6rem)', maxWidth: 1200, width: '100%' }}>
          <div data-aos="fade-up" data-aos-delay="100"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF3D00', marginBottom: 14 }}>
            <span style={{ width: 24, height: 2, background: '#FF3D00', display: 'inline-block' }} />Adventure Awaits
          </div>
          <h1 
  data-aos="fade-up" 
  data-aos-delay="300"
  style={{ 
    fontFamily: "'Bebas Neue', sans-serif", 
    fontSize: 'clamp(2.6rem, 9vw, 9rem)', 
    lineHeight: 0.92, 
    letterSpacing: '0.02em', 
    color: '#FFFFFF', // Set explicitly to white
    marginBottom: 20 
  }}
>
  EXPLORE<br />
  THE <span ref={accentRef} style={{ color: '#FF3D00', display: 'inline-block' }}>ROAD</span><br />
  LESS TRAVELED
</h1>
          <p data-aos="fade-up" data-aos-delay="500"
            style={{ fontSize: 'clamp(0.88rem,2.2vw,1.25rem)', color: 'var(--text2)', maxWidth: 520, lineHeight: 1.6, marginBottom: 28, fontWeight: 400 }}>
            Documenting epic rides across breathtaking landscapes. Join the adventure.
          </p>
          <div data-aos="fade-up" data-aos-delay="700" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/videos" className="btn-primary"><i className="fas fa-play" /> Watch Videos</Link>
            <Link to="/about"  className="btn-outline">Our Story</Link>
          </div>
        </div>

        <div className="scroll-hint" data-aos="fade-in" data-aos-delay="900"
          style={{ position: 'absolute', bottom: '2rem', right: '2.5rem', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text3)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span>Scroll</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(180deg,#FF3D00,transparent)', animation: 'scrollLine 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* STATS */}
      <div id="stats" style={{ padding: 'clamp(36px,7vw,80px) clamp(1rem,4vw,2.5rem)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div className="stats-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(12px,3vw,40px)' }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-item" data-aos="fade-up" data-aos-delay={i * 150} style={{ textAlign: 'center' }}>
              <div className="stat-num" data-target={s.target} data-suffix={s.suffix}
                style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(2rem,7vw,5.5rem)', lineHeight: 1, marginBottom: 6, background: 'linear-gradient(90deg,#FF3D00,#FF8A00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>0</div>
              <div style={{ fontSize: 'clamp(0.6rem,1.5vw,0.85rem)', fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: 'clamp(48px,8vw,96px) clamp(1rem,4vw,2.5rem)', maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-eyebrow" data-aos="fade-right">What We Do</div>
        <div className="section-title"   data-aos="fade-right" data-aos-delay="100">WE ARE EXPLORERZ</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card gsap-card" data-aos="fade-up" data-aos-delay={i * 150}
              style={{ padding: 'clamp(18px,3vw,32px)', borderRadius: 16, position: 'relative', overflow: 'hidden', cursor: 'default', transition: 'box-shadow 0.35s', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <div className="feature-icon"
                style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 20, background: 'linear-gradient(135deg,rgba(255,61,0,.15),rgba(255,138,0,.15))', color: '#FF3D00', willChange: 'transform' }}>
                <i className={`fas ${f.icon}`} />
              </div>
              <h3 style={{ fontSize: 'clamp(0.95rem,2.5vw,1.2rem)', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 'clamp(0.8rem,1.8vw,0.9rem)', color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: 'clamp(48px,8vw,96px) clamp(1rem,4vw,2.5rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }} data-aos="zoom-in" data-aos-duration="800">
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Ready?</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(1.9rem,5vw,4.5rem)', letterSpacing: '0.03em', color: 'var(--text)', marginBottom: 16 }}>START YOUR JOURNEY</div>
          <p style={{ fontSize: 'clamp(0.88rem,2vw,1rem)', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 32 }}>
            Subscribe and never miss an adventure. Every ride tells a story.
          </p>
          <Link to="/videos" ref={btnRef} className="btn-primary"
            style={{ fontSize: 'clamp(0.88rem,2vw,1rem)', padding: 'clamp(11px,2vw,14px) clamp(22px,4vw,36px)', display: 'inline-flex' }}>
            <i className="fas fa-compass" /> Explore Now
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes scrollLine{0%,100%{transform:scaleY(1);opacity:1}50%{transform:scaleY(.4);opacity:.4}}
        @media(max-width:500px){.scroll-hint{display:none!important}}
      `}</style>
    </>
  );
}
