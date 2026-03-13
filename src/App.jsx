import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Header from './components/Header.jsx';
import FloatingNav from './components/FloatingNav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Bikes from './pages/Bikes.jsx';
import Album from './pages/Album.jsx';
import Videos from './pages/Videos.jsx';
import Trip from './pages/Trip.jsx';
import Riders from './pages/Riders.jsx';
import About from './pages/About.jsx';
import Developer from './pages/Developer.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    AOS.init({ once: false, mirror: true, offset: 50, duration: 800, easing: 'ease-out-cubic' });
  }, []);

  return (
    <ThemeProvider>
      <ScrollTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bikes" element={<Bikes />} />
        <Route path="/album" element={<Album />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/trip" element={<Trip />} />
        <Route path="/riders" element={<Riders />} />
        <Route path="/about" element={<About />} />
        <Route path="/developer" element={<Developer />} />
      </Routes>
      <Footer />
      <FloatingNav />
    </ThemeProvider>
  );
}
