import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Header() {
  const { isDark, toggle } = useTheme();
  return (
    <header>
      <Link to="/" className="nav-logo">
        <span><span className="logo-gradient">APM</span> EXPLORERZ</span>
      </Link>
      <button id="theme-toggle" onClick={toggle} aria-label="Toggle theme">
        <i id="theme-icon" className={isDark ? 'fas fa-moon' : 'fas fa-sun'}></i>
      </button>
    </header>
  );
}
