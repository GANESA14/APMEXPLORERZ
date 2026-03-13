import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import AOS from 'aos';

const TICKER = ['ADVENTURE AWAITS','EXPLORE THE WORLD','DISCOVER HIDDEN GEMS','TRAVEL RESPONSIBLY','CAPTURE MEMORIES','EMBRACE DIVERSITY','LEAVE FOOTPRINTS'];
const SLIDES  = [
  '/Scroll/IMG20230319185101.webp','/Scroll/IMG20230322180918.webp',
  '/Scroll/IMG20240126141035.webp','/Scroll/IMG20250828115119.webp',
  '/Scroll/IMG_20241201_100851695_HDR_AE.webp','/Scroll/IMG_20241230_071051577_HDR.webp',
  '/Scroll/Adventure.webp','/Scroll/IMG_20250629_164255.webp',
  '/Scroll/IMG_20250831_153725.webp','/Scroll/IMG_20250910_145751.webp',
  '/Scroll/IMG_20250910_150742.webp','/Scroll/IMG_20250910_150747.webp',
  '/Scroll/IMG_20250910_150749.webp','/Scroll/IMG_20250910_150757.webp',
  '/Scroll/IMG_20250910_154702.webp',
];
const STATS = [
  { count: 150, label: 'Destinations Explored' },
  { count: 320, label: 'Adventures Documented' },
  { count: 48,  label: 'Countries Visited' },
];
const CARDS = [
  { icon: 'fa-bullseye',       title: 'OUR MISSION', text: "To inspire others to explore the beauty of our planet, one adventure at a time. Every journey tells a story, and we're here to share ours with the world." },
  { icon: 'fa-globe-americas', title: 'OUR VISION',  text: 'A community of explorers who appreciate the wonders of nature, embrace cultural diversity, and travel responsibly while leaving positive footprints.' },
];

function clampFallback(min, val, max) { 
  return `clamp(${min},${val},${max})`; 
}

export default function About() {
  const circleRef  = useRef(null);
  const countRef   = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    AOS.refresh();
    
    let ctx;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!ctx) {
            ctx = gsap.context(() => {
              gsap.to('.orb-1',{x:50,y:70,duration:9,repeat:-1,yoyo:true,ease:'sine.inOut',force3D:true});
              gsap.to('.orb-2',{x:-44,y:-54,duration:11,repeat:-1,yoyo:true,ease:'sine.inOut',delay:.8,force3D:true});
              gsap.to('.about-acc',{backgroundPosition:'200% center',duration:4,ease:'linear',repeat:-1,force3D:true});
              gsap.to('.info-card',{y:-10,duration:2.5,ease:'sine.inOut',repeat:-1,yoyo:true,stagger:.3,force3D:true});
              gsap.to('.card-icon',{rotation:5,scale:1.05,duration:1.5,ease:'sine.inOut',repeat:-1,yoyo:true,stagger:.2,force3D:true});
              gsap.to('.float-btn',{y:-5,duration:1.5,ease:'sine.inOut',repeat:-1,yoyo:true,force3D:true});
            });
          } else {
            ctx.resume();
          }
        } else if (ctx) {
          ctx.pause();
        }
      });
    }, { threshold: 0.01 });

    if (containerRef.current) observer.observe(containerRef.current);

    const countIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, tgt = +el.dataset.count, dur = 1600;
        let start = null;
        const step = ts => { 
          if (!start) start = ts;
          const p = Math.min((ts - start)/dur,1); 
          el.textContent = Math.round(p*p*tgt)+'+'; 
          if(p<1) requestAnimationFrame(step); 
        };
        requestAnimationFrame(step);
        countIo.unobserve(el);
      });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('[data-count]').forEach(el => countIo.observe(el));
    
    return () => { 
      if (ctx) ctx.revert(); 
      observer.disconnect();
      countIo.disconnect(); 
    };
  }, []);

  const onAutoplayTimeLeft = (_, time, progress) => {
    if (circleRef.current) circleRef.current.style.setProperty('--p', 1 - progress);
    if (countRef.current)  countRef.current.textContent = Math.ceil(time / 1000) + 's';
  };

  return (
    <div ref={containerRef}>
      <div style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden',contain:'strict' }}>
        <div className="orb-1" style={{ position:'absolute',borderRadius:'50%',filter:'blur(70px)',opacity:.09,width:'clamp(250px,40vw,500px)',height:'clamp(250px,40vw,500px)',background:'#FF3D00',top:'-120px',left:'-120px',willChange:'transform',transform:'translateZ(0)',backfaceVisibility:'hidden' }} />
        <div className="orb-2" style={{ position:'absolute',borderRadius:'50%',filter:'blur(70px)',opacity:.07,width:'clamp(180px,28vw,360px)',height:'clamp(180px,28vw,360px)',background:'#FF8A00',bottom:'15%',right:'-100px',willChange:'transform',transform:'translateZ(0)',backfaceVisibility:'hidden' }} />
      </div>

      <div style={{ overflow:'hidden',borderTop:'1px solid rgba(255,255,255,.08)',borderBottom:'1px solid rgba(255,255,255,.08)',padding:'13px 0',position:'relative',zIndex:2,background:'rgba(255,61,0,.04)',contain:'layout' }}>
        <div style={{ display:'flex',width:'max-content',animation:'tick 30s linear infinite',willChange:'transform',transform:'translateZ(0)' }}
          onMouseEnter={e=>e.currentTarget.style.animationPlayState='paused'}
          onMouseLeave={e=>e.currentTarget.style.animationPlayState='running'}>
          {[...TICKER,...TICKER].map((t,i)=>(
            <span key={i} style={{ whiteSpace:'nowrap',fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(0.85rem,2.2vw,1.05rem)',letterSpacing:'.15em',color:'#a1a1aa',padding:'0 clamp(20px,4vw,44px)',display:'inline-flex',alignItems:'center',gap:12 }}>
              <span style={{ width:5,height:5,borderRadius:'50%',background:'#FF3D00',flexShrink:0 }} />{t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding:'clamp(80px,12vw,150px) clamp(1rem,4vw,2.5rem) clamp(40px,7vw,70px)',maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2 }}>
        <div data-aos="fade-down" style={{ fontSize:'clamp(0.68rem,1.8vw,0.8rem)',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'#FF3D00',marginBottom:18,display:'flex',alignItems:'center',gap:10 }}>
          <span style={{ width:28,height:2,background:'#FF3D00' }} />Who We Are<span style={{ width:28,height:2,background:'#FF3D00' }} />
        </div>
        <h1 data-aos="fade-up" data-aos-delay="100"
          style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2.8rem,8vw,7.5rem)',letterSpacing:'.03em',lineHeight:.92,marginBottom:20 }}>
          ABOUT{' '}
          <span className="about-acc" style={{ backgroundImage:'linear-gradient(45deg,#FF3D00,#FF8A00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',backgroundSize:'200% auto',willChange:'background-position' }}>EXPLORERZ</span>
        </h1>
        <p data-aos="fade-up" data-aos-delay="200"
          style={{ fontSize:'clamp(0.88rem,2.2vw,1.2rem)',color:'#a1a1aa',maxWidth:560,lineHeight:1.65 }}>
          Passionate adventurers documenting journeys across breathtaking landscapes and hidden gems around the world.
        </p>
      </div>

      <div style={{ padding:'0 clamp(1rem,4vw,2.5rem) clamp(40px,7vw,72px)',maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,180px),1fr))',gap:2,position:'relative',zIndex:2 }}>
        {STATS.map((s,i)=>(
          <div key={i} data-aos="fade-up" data-aos-delay={100+i*100}
            style={{ padding:'clamp(20px,4vw,36px)',textAlign:'center',background:'#1a1a1a',border:'1px solid rgba(255,255,255,.08)',position:'relative',overflow:'hidden',borderRadius:i===0?'22px 0 0 22px':i===STATS.length-1?'0 22px 22px 0':0,transform:'translateZ(0)' }}>
            <div data-count={s.count} style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2rem,5vw,3.4rem)',color:'#FF3D00',lineHeight:1,marginBottom:6 }}>0</div>
            <div style={{ fontSize:'clamp(0.65rem,1.5vw,0.8rem)',letterSpacing:'.1em',textTransform:'uppercase',color:'#a1a1aa' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div data-aos="zoom-in" data-aos-duration="900" style={{ padding:'clamp(32px,6vw,60px) clamp(1rem,4vw,2.5rem)',maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2 }}>
        <Swiper
          modules={[Autoplay,Pagination,Navigation]} loop
          autoplay={{ delay:3000,disableOnInteraction:false }}
          pagination={{ dynamicBullets:true,clickable:true }}
          navigation={{ nextEl:'.car-btn.next',prevEl:'.car-btn.prev' }}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          style={{ borderRadius:20,height:'clamp(220px,45vw,540px)',boxShadow:'0 18px 48px rgba(0,0,0,.5)',border:'1px solid rgba(255,255,255,.08)',position:'relative',transform:'translateZ(0)' }}
          className="about-swiper">
          {SLIDES.map((src,i)=>(
            <SwiperSlide key={i}>
              <img src={src} alt={`Slide ${i+1}`} loading="lazy" decoding="async"
                style={{ width:'100%',height:'100%',objectFit:'cover',display:'block' }} />
            </SwiperSlide>
          ))}
          <button className="car-btn prev"
            style={{ position:'absolute',top:'50%',transform:'translateY(-50%)',left:14,width:42,height:42,borderRadius:'50%',border:'1px solid rgba(255,255,255,.08)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .25s',fontSize:'1rem',zIndex:10,background:'rgba(20,20,20,.6)',color:'#fff',backdropFilter:'blur(10px)' }}
            onMouseEnter={e=>e.currentTarget.style.background='#FF3D00'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(20,20,20,.6)'}>
            <i className="fas fa-chevron-left" />
          </button>
          <button className="car-btn next"
            style={{ position:'absolute',top:'50%',transform:'translateY(-50%)',right:14,width:42,height:42,borderRadius:'50%',border:'1px solid rgba(255,255,255,.08)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .25s',fontSize:'1rem',zIndex:10,background:'rgba(20,20,20,.6)',color:'#fff',backdropFilter:'blur(10px)' }}
            onMouseEnter={e=>e.currentTarget.style.background='#FF3D00'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(20,20,20,.6)'}>
            <i className="fas fa-chevron-right" />
          </button>
          <div style={{ position:'absolute',right:16,bottom:16,zIndex:10,width:42,height:42,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,color:'#fff',background:'rgba(20,20,20,.6)',borderRadius:'50%',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,.1)' }}>
            <svg ref={circleRef} viewBox="0 0 48 48" style={{ '--p':0,position:'absolute',left:0,top:0,width:'100%',height:'100%',stroke:'#FF3D00',fill:'none',strokeWidth:3,strokeDashoffset:'calc(125.6*(1 - var(--p)))',strokeDasharray:'125.6',transform:'rotate(-90deg)',borderRadius:'50%' }}>
              <circle cx="24" cy="24" r="20" />
            </svg>
            <span ref={countRef} style={{ zIndex:11,fontSize:'.8rem' }} />
          </div>
        </Swiper>
      </div>

      <div style={{ padding:'0 clamp(1rem,4vw,2.5rem) clamp(40px,7vw,90px)',maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:clampFallback('20px','3vw','28px'),position:'relative',zIndex:2 }}>
        {CARDS.map((c,i)=>(
          <div key={i} className="info-card" data-aos={i===0?'fade-right':'fade-left'} data-aos-delay={i*150}
            style={{ padding:'clamp(24px,4vw,44px)',borderRadius:22,background:'#1a1a1a',border:'1px solid rgba(255,255,255,.08)',position:'relative',overflow:'hidden',willChange:'transform',transform:'translateZ(0)' }}>
            <div className="card-icon" style={{ width:52,height:52,borderRadius:14,background:'rgba(255,61,0,.1)',color:'#FF3D00',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'clamp(1.2rem,3vw,1.6rem)',marginBottom:20,willChange:'transform' }}>
              <i className={`fas ${c.icon}`} />
            </div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",color:'#FF3D00',fontSize:'clamp(1.6rem,4vw,2.3rem)',letterSpacing:'.04em',marginBottom:12 }}>{c.title}</h2>
            <p style={{ fontSize:'clamp(0.85rem,2vw,0.97rem)',color:'#a1a1aa',lineHeight:1.7 }}>{c.text}</p>
          </div>
        ))}
      </div>

      <div data-aos="flip-up" data-aos-duration="1000" style={{ padding:'0 clamp(1rem,4vw,2.5rem) clamp(60px,8vw,90px)',maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2 }}>
        <div style={{ padding:'clamp(40px,7vw,76px) clamp(20px,4vw,40px)',borderRadius:22,textAlign:'center',background:'#1a1a1a',border:'1px solid rgba(255,255,255,.08)' }}>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",color:'#FF3D00',fontSize:'clamp(1.8rem,5vw,3.8rem)',letterSpacing:'.03em',marginBottom:12 }}>JOIN OUR JOURNEY</h2>
          <p style={{ color:'#a1a1aa',fontSize:'clamp(0.88rem,2vw,1.05rem)',lineHeight:1.6,margin:'0 auto 28px',maxWidth:460 }}>
            Follow us on social media to stay updated with our latest adventures, travel tips, and stunning photography.
          </p>
          <Link to="/videos" className="float-btn btn-primary" style={{ display:'inline-flex',padding:'clamp(12px,2vw,15px) clamp(22px,4vw,38px)',borderRadius:50,boxShadow:'0 8px 20px rgba(255,61,0,.28)',willChange:'transform',transform:'translateZ(0)' }}>
            <i className="fas fa-play" style={{ marginRight: '8px' }}/>Watch Our Videos
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes tick{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(-50%,0,0)}}
        .about-swiper::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(0,0,0,.8) 100%);pointer-events:none;z-index:2}
        .car-btn::after{display:none!important}
        .swiper-pagination{bottom:18px!important;z-index:10}
        .swiper-pagination-bullet{background:rgba(255,255,255,.45);opacity:1}
        .swiper-pagination-bullet-active{background:#FF3D00}
        @media(max-width:600px){
          .car-btn{display:none!important}
          [data-count]{font-size:clamp(1.6rem,6vw,2.2rem)!important}
        }
      `}</style>
    </div>
  );
}