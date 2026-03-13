export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ marginTop: 100, borderTop: '1px solid var(--border)', padding: 'clamp(32px,6vw,48px) clamp(1rem,4vw,2rem) 120px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(1.4rem,4vw,1.8rem)', letterSpacing: '0.05em', marginBottom: 10 }}>
            <span style={{ background: 'linear-gradient(90deg,#FF3D00,#FF8A00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>APM</span>{' '}EXPLORERZ
          </div>
          <p style={{ color: 'var(--text2)', fontSize: 'clamp(0.8rem,2vw,0.875rem)', lineHeight: 1.7, maxWidth: 220 }}>
            Exploring the world, one ride at a time.
          </p>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>Follow</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { href: 'https://m.youtube.com/@APM_Explorers', icon: 'fa-youtube', hover: '#FF0000', label: 'YouTube' },
              { href: 'https://www.instagram.com/apm_explorers_', icon: 'fa-instagram', hover: '#E1306C', label: 'Instagram' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label}
                style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = s.hover; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = s.hover; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <i className={`fab ${s.icon}`} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '32px auto 0', paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ color: 'var(--text3)', fontSize: 'clamp(0.7rem,1.8vw,0.8rem)' }}>© {year} APM Explorerz. All rights reserved. <small style={{ opacity: 0.5 }}>v1.25</small></span>
        <span style={{ color: 'var(--text3)', fontSize: 'clamp(0.7rem,1.8vw,0.8rem)' }}>
          Developed by <a href="https://ganesa14.github.io/Portfolios/" style={{ color: '#FF3D00', textDecoration: 'none', fontWeight: 600 }}>Savage King</a>
        </span>
      </div>
    </footer>
  );
}
