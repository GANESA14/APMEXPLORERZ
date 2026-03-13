import { useEffect } from 'react';
import gsap from 'gsap';
import AOS from 'aos';

const RIDERS = [
  { name:'Savage King',     role:'Developer & Designer',    bio:'The mastermind behind this platform, blending technology and adventure.',              img:'/Riders/SavageKing.jpg',    ig:'https://www.instagram.com/tn_savage_king_a14?igsh=dTZra243ZXIzM2k1', miles:'7K+',  trips:'65+' },
  { name:'AB Gaming',       role:'Editor',                   bio:'Turning raw adventure footage into captivating stories.',                               img:'/Riders/Alex.webp',          ig:'https://www.instagram.com/gaming_alexz',                              miles:'4.2K+',trips:'38+' },
  { name:'Subash',          role:'Extreme Terrain Explorer', bio:'Conqueror of off-road paths and steep climbs.',                                         img:'/Riders/Subash.webp',        ig:'https://www.instagram.com/rolex_subash_001',                           miles:'5K+',  trips:'42+' },
  { name:'Vishnu',          role:'City Adventure Scout',     bio:'Discovering secret city spots and metropolitan adventures.',                            img:'/Riders/Vishnu.webp',        ig:'https://www.instagram.com/moon_night__god_56_',                        miles:'3K+',  trips:'29+' },
  { name:'Madhan',          role:'Visual Storyteller',       bio:'Combining love for riding with photography.',                                           img:'/Riders/Madhan.webp',        ig:'https://www.instagram.com/m_dhn._',                                    miles:'3.8K+',trips:'37+' },
  { name:'Bala Murugan',    role:'Route Designer',           bio:'My journey, challenges, and growth make my story uniquely powerful.',                   img:'/Riders/Bala.jpeg',          ig:'https://www.instagram.com/bala_murugan_apm',                           miles:'4.5K+',trips:'45+' },
  { name:'Kathiresan',      role:'Adventure Strategist',     bio:'Expert in planning high-intensity routes and discovering thrilling paths.',              img:'/Riders/Kathir.jpeg',        ig:'https://www.instagram.com/_kathir_013',                                miles:'4K+',  trips:'41+' },
  { name:'Lingesh Uzumaki', role:'Long-Distance Rider',      bio:'Champion of endurance rides and overnight adventures.',                                 img:'/Riders/Lingesh.webp',       ig:'https://www.instagram.com/lingesh_11_n_45',                            miles:'5.2K+',trips:'50+' },
  { name:'Barath Kanna',    role:'Scenic Route Specialist',  bio:'Discovering breathtaking landscapes and inspiring routes.',                             img:'/Riders/513759235_17937596757043590_3224795872355862748_n.webp', ig:'https://www.instagram.com/itachi_uchiha_75__', miles:'4.7K+',trips:'46+' },
  { name:'Gopal',           role:'Boost Specialist',         bio:"Full throttle, full send — the team's unofficial hype man.",                            img:'/Riders/Gopal.webp',         ig:'https://www.instagram.com/im_xobax_67',                                miles:'4.1K+',trips:'12+' },
  { name:'Koushik',         role:'Local Fighter',            bio:'Never backs down from a challenging route or a good adventure.',                        img:'/Riders/Koushik.webp',       ig:'https://www.instagram.com/__iam.koushik__',                            miles:'2.1K+',trips:'3+'  },
];

export default function Riders() {
  useEffect(() => {
    AOS.refresh();
    const ctx = gsap.context(() => {
      gsap.fromTo('.riders-title', { opacity: 0.3, y: 15 }, { opacity: 1, y: -8, stagger: 0.2, duration: 1.5, ease: 'power1.inOut', repeat: -1, yoyo: true });
      gsap.to('.acc-grad', { backgroundPosition: '200% center', duration: 5, ease: 'none', repeat: -1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* HERO */}
      <div style={{ padding: 'clamp(110px,16vw,180px) clamp(1rem,4vw,2.5rem) clamp(48px,8vw,100px)', maxWidth: 1200, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div data-aos="fade-down" data-aos-duration="900"
          style={{ fontSize: 'clamp(0.68rem,1.8vw,0.85rem)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF3D00', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 30, height: 2, background: '#FF3D00' }} />The Team<span style={{ width: 30, height: 2, background: '#FF3D00' }} />
        </div>
        <h1 className="riders-title"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(3rem,9vw,7.5rem)', letterSpacing: '0.03em', lineHeight: 0.9, margin: '0 0 20px' }}>
          MEET OUR{' '}
          <span className="acc-grad"
            style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(45deg,#FF3D00,#FF8A00)', backgroundSize: '200% auto', display: 'inline-block' }}>
            RIDERS
          </span>
        </h1>
        <p className="riders-title"
          style={{ fontSize: 'clamp(0.88rem,2.2vw,1.2rem)', color: 'var(--text2)', maxWidth: 580, lineHeight: 1.65 }}>
          The passionate adventurers behind every journey, every mile, every memory.
        </p>
      </div>

      {/* GRID */}
      <div style={{ padding: '0 clamp(1rem,4vw,2.5rem) clamp(60px,8vw,100px)', maxWidth: 1200, margin: '0 auto' }}>
        <div className="riders-grid">
          {RIDERS.map((r, i) => (
            <div key={i} className="rider-card" data-aos="fade-up" data-aos-delay={(i % 3) * 80} data-aos-duration="700">
              <img className="rider-img" src={r.img} alt={r.name} loading={i < 4 ? 'eager' : 'lazy'} />

              <div className="rider-glass">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                   <div style={{ color: '#fff', fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(1.3rem,3.5vw,1.8rem)', letterSpacing: '0.04em', lineHeight: 1, marginBottom: 3 }}>{r.name}</div>
                    {/* <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(1.3rem,3.5vw,1.8rem)', letterSpacing: '0.04em', lineHeight: 1, marginBottom: 3 }}>{r.name}</div> */}
                    <div style={{ fontSize: 'clamp(0.62rem,1.5vw,0.75rem)', fontWeight: 600, color: '#FF3D00', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{r.role}</div>
                  </div>
                  <a href={r.ig} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                    className="ig-btn"
                    style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '1rem', transition: 'all .3s', flexShrink: 0 }}>
                    <i className="fab fa-instagram" />
                  </a>
                </div>

                <div className="rider-details">
                  <div style={{ fontSize: 'clamp(0.78rem,1.8vw,0.85rem)', color: '#ccc', lineHeight: 1.5, marginBottom: 14 }}>{r.bio}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[['fa-road', r.miles], ['fa-map-marked-alt', r.trips]].map(([icon, val]) => (
                      <span key={icon} style={{ padding: 'clamp(4px,1vw,6px) clamp(8px,2vw,12px)', borderRadius: 8, fontSize: 'clamp(0.68rem,1.6vw,0.75rem)', fontWeight: 600, background: 'rgba(255,255,255,.1)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <i className={`fas ${icon}`} />{val}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .riders-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:clamp(16px,3vw,32px)}
        .rider-card{border-radius:20px;overflow:hidden;position:relative;cursor:pointer;aspect-ratio:3/4.2;background:#1a1a1a;box-shadow:0 10px 30px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.05);transition:all .4s cubic-bezier(.16,1,.3,1)}
        .rider-card:hover{transform:translateY(-8px);border-color:rgba(255,61,0,.3);box-shadow:0 20px 40px rgba(255,61,0,.15)}
        .rider-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.16,1,.3,1)}
        .rider-card:hover .rider-img{transform:scale(1.08)}
        .rider-glass{position:absolute;bottom:10px;left:10px;right:10px;background:rgba(20,20,20,.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:clamp(12px,2.5vw,20px)}
        .rider-details{max-height:0;opacity:0;overflow:hidden;margin-top:0;transition:all .4s cubic-bezier(.16,1,.3,1)}
        .rider-card:hover .rider-details{max-height:140px;opacity:1;margin-top:14px}
        .ig-btn:hover{background:#E1306C!important;transform:scale(1.1) rotate(5deg)}
        @media(hover:none){
          .rider-details{max-height:unset!important;opacity:1!important;margin-top:10px!important}
          .rider-card{transform:none!important}
        }
        @media(max-width:400px){
          .riders-grid{gap:12px}
          .rider-card{aspect-ratio:3/3.6}
        }
      `}</style>
    </>
  );
}
