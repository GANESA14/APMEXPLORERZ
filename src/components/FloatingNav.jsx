import { useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/', icon: 'fa-house', label: 'Home' },
  { to: '/bikes', icon: 'fa-motorcycle', label: 'Bikes' },
  { to: '/album', icon: 'fa-images', label: 'Album' },
  { to: '/videos', icon: 'fa-play', label: 'Videos' },
  { to: '/trip', icon: 'fa-location-arrow', label: 'Trip' },
  { to: '/riders', icon: 'fa-user-group', label: 'Riders' },
  { to: '/about', icon: 'fa-circle-info', label: 'About' },
];
const MAX_STEPS = LINKS.length - 4;

export default function FloatingNav() {
  const location = useLocation();
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const stateRef = useRef({ currentStep: 0, currentRot: 0 });
  const dragRef = useRef({ isDragging: false, hasDragged: false, startX: 0, startRot: 0 });

  const activeIndex = LINKS.findIndex(l =>
    l.to === '/' ? location.pathname === '/' : location.pathname.startsWith(l.to)
  );

  const applyRot = useCallback(rot => {
    document.documentElement.style.setProperty('--nav-rot', `${rot}deg`);
  }, []);

  const snapToStep = useCallback(step => {
    const s = Math.max(0, Math.min(MAX_STEPS, step));
    stateRef.current.currentStep = s;
    stateRef.current.currentRot = -(s * 30);
    applyRot(stateRef.current.currentRot);
  }, [applyRot]);

  useEffect(() => {
    const step = Math.max(0, Math.min(MAX_STEPS, Math.max(0, activeIndex - 1)));
    snapToStep(step);
  }, [location.pathname, activeIndex, snapToStep]);

  useEffect(() => {
    const container = containerRef.current;
    const nav = navRef.current;
    if (!container || !nav) return;

    const onDown = e => {
      dragRef.current = { isDragging: true, hasDragged: false, startX: e.clientX, startRot: stateRef.current.currentRot };
      nav.style.transition = 'none';
    };
    const onMove = e => {
      if (!dragRef.current.isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      if (Math.abs(dx) > 5) dragRef.current.hasDragged = true;
      let r = dragRef.current.startRot + dx * 0.3;
      r = Math.max(-(MAX_STEPS * 30) - 15, Math.min(15, r));
      stateRef.current.currentRot = r;
      applyRot(r);
    };
    const onUp = () => {
      if (!dragRef.current.isDragging) return;
      dragRef.current.isDragging = false;
      nav.style.transition = '';
      snapToStep(Math.round(-stateRef.current.currentRot / 30));
    };
    const onClick = e => { if (dragRef.current.hasDragged) { e.preventDefault(); e.stopPropagation(); } };

    container.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    container.addEventListener('click', onClick, true);
    return () => {
      container.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      container.removeEventListener('click', onClick, true);
    };
  }, [applyRot, snapToStep]);

  return (
    <div id="nav-container" ref={containerRef}>
      <div className="nav-hover-zone left"
        onMouseEnter={() => { if (stateRef.current.currentStep > 0) snapToStep(stateRef.current.currentStep - 1); }} />
      <nav id="floating-nav" ref={navRef}>
        {LINKS.map((l, i) => (
          <Link key={l.to} to={l.to} className={`fnav-item${i === activeIndex ? ' active' : ''}`}
            onDragStart={e => e.preventDefault()}>
            <i className={`fas ${l.icon}`} />
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
      <div className="nav-hover-zone right"
        onMouseEnter={() => { if (stateRef.current.currentStep < MAX_STEPS) snapToStep(stateRef.current.currentStep + 1); }} />
    </div>
  );
}
