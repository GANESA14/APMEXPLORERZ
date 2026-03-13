import { useState, useEffect, useRef, useCallback } from 'react';

const TRIPS = [
  { slug:'border-ghats-run', title:'Border Ghats Run', from:'Anaikulam',to:'Thenmalai', via:'Surandai, Courtallam, Shencottah', date:'May 2026', status:'planned', dist:'75 KM', diff:'Medium', img:'https://www.coffeecountyresorts.com/assets/images/placesinsirumalai/large/thenmalai.jpg', desc:'A scenic border-crossing ride through the waterfalls of Courtallam and the dense forest canopy of Aryankavu pass into Kerala.', waypoints:[[8.9564,77.4225],[8.9818,77.4037],[8.9587,77.3144],[8.9341,77.2693],[8.9806,77.2476],[8.9754,77.1428],[8.9619,77.0620]],center:[8.96,77.24],zoom:11 },
  { slug:'chill-trip', title:'Chill Trip', from:'Anaikulam',to:'Valparai', via:'Theni · Kodaikanal · Pazhani', date:'June 2026', status:'upcoming', dist:'420 KM', diff:'Pro', img:'https://www.redtaxi.co.in/blog/images/valparai-a-destination-for-tourism-and-tea-estate.webp', desc:'A chill yet challenging climb through 40+ hairpin bends, misty peaks, and sprawling tea estates.', waypoints:[[8.9564,77.4225],[10.0104,77.4768],[10.2381,77.4892],[10.4491,77.5186],[10.5855,77.2435],[10.3279,76.9554]],center:[9.7,77.3],zoom:8 },
  { slug:'grand-loop', title:'The Grand Southern Loop', from:'Anaikulam',to:'Bangalore', via:'Rameswaram · Madurai · Ooty · Mysore',date:'Not Confirmed',status:'planned', dist:'1,120 KM', diff:'Extreme', img:'https://i.ytimg.com/vi/IoElbogbGGc/hq720.jpg', desc:"A massive cross-state odyssey through the Pamban bridge, poet's land, Nilgiris and beyond.", waypoints:[[8.9564,77.4225],[8.7139,77.7567],[9.1504,77.9972],[9.2876,79.3126],[9.9252,78.1198],[11.3410,77.7172],[11.4102,76.6950],[12.2958,76.6394],[12.9716,77.5946]],center:[10.8,78.5],zoom:7 },
  { slug:'red-sand', title:'Red Sand & Coastal Run', from:'Anaikulam',to:'Tiruchendur', via:'Tirunelveli · Thoothukudi', date:'May 2024', status:'completed', dist:'320 KM', diff:'Medium', img:'https://c9admin.cottage9.com/uploads/5017/thiruchendur-murugan-temple-a-historical-overview.jpg', desc:'A spiritual run through the Pandyan territory, visiting red sand dunes and the pearl city.', waypoints:[[8.9773,77.4206],[8.8700,77.5000],[8.7288,77.7046],[8.8053,78.1460],[8.6300,78.0200],[8.5089,78.0453],[8.4946,78.1219]],center:[8.7,77.8],zoom:9 },
];

const BADGE = {
  live:      { background:'rgba(255,0,60,.9)',      color:'#fff' },
  upcoming:  { background:'rgba(0,220,130,.15)',      color:'#00DC82', border:'1px solid rgba(0,220,130,.3)' },
  planned:   { background:'rgba(100,160,255,.15)',    color:'#64A0FF', border:'1px solid rgba(100,160,255,.3)' },
  completed: { background:'rgba(255,255,255,.1)',     color:'#fff',    border:'1px solid rgba(255,255,255,.2)' },
};

const routeCache = {};

export default function Trip() {
  const [modal, setModal] = useState(null);
  const leafletRef = useRef(null);
  const layerRef = useRef(null);
  const markersRef = useRef(null);
  const timerRef = useRef(null);
  const progressTextRef = useRef(null);

  const closeModal = useCallback(() => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    if (leafletRef.current) {
      leafletRef.current.remove();
      leafletRef.current = null;
    }
    layerRef.current = null; 
    markersRef.current = null;
    setModal(null);
    document.body.style.overflow = '';
    window.location.hash = '';
  }, []);

  useEffect(() => {
    const k = e => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', k, { passive: true });
    return () => window.removeEventListener('keydown', k);
  }, [closeModal]);

  const setProgress = (text) => {
    if (progressTextRef.current) progressTextRef.current.innerText = text;
  };

  const openModal = useCallback(async trip => {
    setModal(trip);
    document.body.style.overflow = 'hidden';
    window.location.hash = trip.slug;

    requestAnimationFrame(async () => {
      const L = (await import('leaflet')).default;
      const canvas = document.getElementById('map-canvas');
      if (!canvas) return;

      if (!leafletRef.current) {
        leafletRef.current = L.map('map-canvas', { 
            zoomControl: false, 
            attributionControl: false,
            preferCanvas: true,
            zoomAnimation: false,
            markerZoomAnimation: false
        });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
            updateWhenZooming: false,
            updateWhenIdle: true,
            keepBuffer: 2
        }).addTo(leafletRef.current);
        L.control.zoom({ position:'bottomright' }).addTo(leafletRef.current);
      }

      leafletRef.current.invalidateSize();

      if (layerRef.current)   leafletRef.current.removeLayer(layerRef.current);
      if (markersRef.current) leafletRef.current.removeLayer(markersRef.current);
      if (timerRef.current)   cancelAnimationFrame(timerRef.current);

      setProgress('Fetching road data...');
      
      let path = trip.waypoints;
      
      if (routeCache[trip.slug]) {
        path = routeCache[trip.slug];
      } else {
        try {
          const coords = trip.waypoints.map(p => p[1]+','+p[0]).join(';');
          const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
          const d = await r.json();
          if (d.routes?.[0]) {
            path = d.routes[0].geometry.coordinates.map(c => [c[1],c[0]]);
            routeCache[trip.slug] = path;
          }
        } catch(_) {}
      }

      leafletRef.current.fitBounds(L.latLngBounds(path), { padding:[40,40], animate: false });

      const mg = L.layerGroup().addTo(leafletRef.current);
      markersRef.current = mg;

      const originIcon = L.divIcon({ className:'', html:'<div style="width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #FF3D00;box-shadow:0 0 16px rgba(255,61,0,.8)"></div>', iconSize:[14,14], iconAnchor:[7,7] });
      L.marker(path[0], { icon:originIcon, zIndexOffset:1000 }).addTo(mg).bindPopup(`<b>${trip.from}</b>`, { closeButton:false });

      const bgTrack = L.polyline(path, { color:'rgba(255,255,255,0.05)', weight:4, smoothFactor: 0 }).addTo(leafletRef.current);
      const glow = L.polyline([], { color:'rgba(255,100,0,.15)', weight:16, lineCap:'round', smoothFactor: 0 }).addTo(leafletRef.current);
      const main = L.polyline([], { color:'#FF3D00', weight:3.5, lineCap:'round', smoothFactor: 0 }).addTo(leafletRef.current);
      
      layerRef.current = L.layerGroup([bgTrack, glow, main]);

      const headIcon = L.divIcon({ className:'', html:'<div style="width:10px;height:10px;border-radius:50%;background:#FF3D00;border:2px solid rgba(255,255,255,.8);box-shadow:0 0 12px rgba(255,61,0,.8)"></div>', iconSize:[10,10], iconAnchor:[5,5] });
      const head = L.marker(path[0], { icon:headIcon, zIndexOffset:2000 }).addTo(mg);

      const total = path.length;
      const speed = Math.max(15, Math.floor(total / 45)); 
      let drawn = 0;

      function step() {
        if (!leafletRef.current) return;
        
        if (drawn >= total) {
          const destIcon = L.divIcon({ className:'', html:'<div style="background:#FF3D00;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 16px rgba(255,61,0,.8)"></div>', iconSize:[14,14], iconAnchor:[7,7] });
          L.marker(path[total-1], { icon:destIcon, zIndexOffset:1000 }).addTo(mg).bindPopup(`<b>${trip.to}</b>`, { closeButton:false });
          leafletRef.current.removeLayer(head);
          setProgress(`Route complete · ${trip.dist}`);
          return;
        }

        const chunk = Math.min(speed, total - drawn);
        const newGlowPoints = [];
        const newMainPoints = [];
        
        for (let i = 0; i < chunk; i++) { 
          newGlowPoints.push(path[drawn+i]); 
          newMainPoints.push(path[drawn+i]); 
        }
        
        glow.addLatLng(newGlowPoints[newGlowPoints.length - 1]);
        glow.setLatLngs([...glow.getLatLngs(), ...newGlowPoints]);
        main.setLatLngs([...main.getLatLngs(), ...newMainPoints]);
        
        drawn += chunk;
        setProgress(`Plotting… ${Math.round((drawn/total)*100)}%`);
        head.setLatLng(path[drawn-1]);
        
        timerRef.current = requestAnimationFrame(step);
      }
      
      step();
    });
  }, []);

  return (
    <>
      <div style={{ position:'relative',zIndex:1,padding:'clamp(90px,14vw,140px) clamp(1rem,4vw,2rem) clamp(40px,7vw,60px)',textAlign:'center',maxWidth:860,margin:'0 auto' }}>
        <div style={{ display:'inline-flex',alignItems:'center',gap:8,fontSize:'clamp(0.62rem,1.6vw,0.7rem)',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'#FF3D00',border:'1px solid rgba(255,61,0,.3)',padding:'6px 16px',borderRadius:100,marginBottom:22,background:'rgba(255,61,0,.05)' }}>
          <span style={{ width:6,height:6,background:'#FF3D00',borderRadius:'50%',animation:'blink 1.5s infinite',display:'inline-block' }} />
          Tamil Nadu Expeditions
        </div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(2.8rem,9vw,7.5rem)',lineHeight:.88,letterSpacing:'.02em',marginBottom:18 }}>
          ROADS WE <em style={{ color:'#FF3D00',fontStyle:'normal' }}>RIDE</em>
        </h1>
        <p style={{ color:'#888',fontSize:'clamp(0.88rem,2vw,1.05rem)',lineHeight:1.7,maxWidth:480,margin:'0 auto' }}>
          From coastal salt winds to misty hilltop hairpins. Every route a story waiting to be written.
        </p>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,290px),1fr))',gap:2,padding:'clamp(28px,5vw,60px) clamp(1rem,4vw,2rem) clamp(60px,8vw,100px)',maxWidth:1400,margin:'0 auto' }} className="trip-grid">
        {TRIPS.map((t,i) => {
          const badge = BADGE[t.status] || {};
          const radius = i===0?'20px 0 0 0':i===1?'0 20px 0 0':i===2?'0 0 0 20px':'0 0 20px 0';
          return (
            <div key={t.slug} onClick={() => openModal(t)}
              className="trip-card"
              style={{ background:'#111',border:'1px solid rgba(255,255,255,.08)',overflow:'hidden',cursor:'pointer',position:'relative',display:'flex',flexDirection:'column',transition:'border-color .2s,background .2s',borderRadius:radius,opacity:0,transform:'translateY(24px)',animation:`fadeUp .4s cubic-bezier(0.16, 1, 0.3, 1) ${i*60+50}ms forwards`, willChange: 'opacity, transform' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,61,0,.35)';e.currentTarget.style.background='#181818'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.08)';e.currentTarget.style.background='#111'}}>
              <div style={{ position:'relative',height:'clamp(160px,28vw,220px)',overflow:'hidden' }}>
                <div style={{ ...badge,position:'absolute',top:12,left:12,fontSize:'clamp(0.58rem,1.4vw,0.62rem)',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',padding:'5px 12px',borderRadius:100,backdropFilter:'blur(12px)',zIndex:2, willChange: 'transform' }}>
                  {t.status}
                </div>
                <img src={t.img} alt={t.title} loading="lazy" decoding="async"
                  style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform .5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter .3s',filter:'brightness(.7) saturate(.8)', willChange: 'transform, filter' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.04)';e.currentTarget.style.filter='brightness(.6) saturate(1)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.filter='brightness(.7) saturate(.8)'}} />
                <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(8,8,8,.9) 0%,transparent 50%)', pointerEvents: 'none' }} />
              </div>
              <div style={{ padding:'clamp(16px,3vw,24px)',flex:1,display:'flex',flexDirection:'column' }}>
                <div style={{ fontSize:'clamp(0.65rem,1.5vw,0.72rem)',color:'#FF3D00',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6 }}>{t.date}</div>
                <h2 style={{ color: '#FFFFFF', fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.5rem,3.5vw,2rem)', lineHeight:1, marginBottom:8, letterSpacing:'.03em' }}>{t.title}</h2>
                <div style={{ fontSize:'clamp(0.75rem,1.8vw,0.8rem)',color:'#FFFFFF',marginBottom:14,display:'flex',alignItems:'center',gap:6 }}>
                  <i className="fas fa-map-pin" style={{ color:'#FF3D00',fontSize:'0.7rem' }} />{t.from} → {t.to}
                </div>
                <div style={{ display:'flex',gap:'clamp(12px,3vw,24px)',paddingTop:14,borderTop:'1px solid rgba(255,255,255,.08)',marginTop:'auto' }}>
                  {[['Distance',t.dist],['Difficulty',t.diff]].map(([k,v])=>(
                    <div key={k}>
                      <span style={{ display:'block',fontSize:'clamp(0.55rem,1.3vw,0.6rem)',color:'#888',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:2 }}>{k}</span>
                      <strong style={{ fontSize:'clamp(0.82rem,2vw,0.9rem)', color: '#FFFFFF' }}>{v}</strong>
                    </div>
                  ))}
                </div>
                <div className="view-route-btn"
                  style={{ marginTop:16,padding:'clamp(10px,2vw,13px)',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,textAlign:'center',fontSize:'clamp(0.78rem,1.8vw,0.85rem)',fontWeight:600,color:'#888',transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center',gap:7, willChange: 'background, color, box-shadow' }}>
                  <i className="fas fa-map-marked-alt" />View Route
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div onClick={e=>{if(e.target===e.currentTarget)closeModal()}}
          style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,.85)',backdropFilter:'blur(8px)',display:'flex',animation:'fadeIn .2s ease-out forwards', willChange: 'opacity' }}>
          <div className="modal-inner" style={{ width:'100%',height:'100%',display:'grid',gridTemplateColumns:'clamp(280px,35%,400px) 1fr',position:'relative', animation: 'slideRight .3s cubic-bezier(0.16, 1, 0.3, 1) forwards', willChange: 'transform' }}>
            
            <button onClick={closeModal}
              style={{ position:'absolute',top:16,right:16,zIndex:10001,width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.08)',color:'#fff',fontSize:'.95rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#000';e.currentTarget.style.transform='scale(1.1)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.color='#fff';e.currentTarget.style.transform='scale(1)'}}>
              <i className="fas fa-times" />
            </button>

            <div style={{ background:'rgba(10,10,10,1)',borderRight:'1px solid rgba(255,255,255,.08)',padding:'clamp(32px,5vw,48px) clamp(20px,4vw,36px)',display:'flex',flexDirection:'column',overflowY:'auto',zIndex:10,position:'relative' }}>
              <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#FF3D00,transparent)' }} />
              <div style={{ fontSize:'clamp(0.58rem,1.4vw,0.65rem)',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#FF3D00',marginBottom:14 }}>
                <i className="fas fa-route" style={{ marginRight:6 }} />{modal.date}
              </div>
              <h2 style={{ color: '#FFFFFF', fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(1.8rem,4vw,3rem)',lineHeight:.95,marginBottom:22,letterSpacing:'.03em' }}>{modal.title}</h2>

              {[{label:'Origin',name:modal.from},{label:'Via',name:modal.via},{label:'Destination',name:modal.to}].map((n,i,a)=>(
                <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:12,padding:'10px 0',position:'relative' }}>
                  {i<a.length-1 && <div style={{ position:'absolute',left:9,top:30,bottom:-10,width:1,background:'rgba(255,255,255,.08)' }} />}
                  <div style={{ width:18,height:18,borderRadius:'50%',border:'2px solid #FF3D00',background:(i===0||i===2)?'#FF3D00':'#080808',flexShrink:0,marginTop:3,position:'relative',zIndex:1,boxShadow:(i===0||i===2)?'0 0 12px rgba(255,61,0,.4)':'none' }} />
                  <div>
                    <div style={{ fontSize:'clamp(0.55rem,1.3vw,0.62rem)',color:'#888',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:2 }}>{n.label}</div>
                    <div style={{ color: '#FFFFFF', fontSize:'clamp(0.85rem,2vw,1rem)',fontWeight:600 }}>{n.name}</div>
                  </div>
                </div>
              ))}

              <p style={{ fontSize:'clamp(0.82rem,1.8vw,0.9rem)',color:'#888',lineHeight:1.7,margin:'20px 0',flexGrow:1 }}>{modal.desc}</p>

              <div style={{ display:'flex',gap:'clamp(12px,3vw,24px)',padding:'clamp(14px,2.5vw,20px)',background:'rgba(255,61,0,.06)',border:'1px solid rgba(255,61,0,.15)',borderRadius:12,flexWrap:'wrap' }}>
                {[['Distance',modal.dist],['Difficulty',modal.diff],['Status',modal.status.toUpperCase()]].map(([k,v])=>(
                  <div key={k}>
                    <span style={{ display:'block',fontSize:'clamp(0.55rem,1.3vw,0.6rem)',color:'#888',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3 }}>{k}</span>
                    <strong style={{ fontSize:'clamp(0.88rem,2vw,1.05rem)',fontWeight:700,color:'#FF3D00' }}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position:'relative',width:'100%',height:'100%',minHeight:280 }}>
              <div id="map-canvas" style={{ width:'100%',height:'100%',background:'#0d0d0d' }} />
              <div style={{ position:'absolute',bottom:16,left:16,zIndex:1000,background:'rgba(10,10,10,.9)',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'10px 14px',fontSize:'clamp(0.68rem,1.6vw,0.75rem)',color:'#888',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',gap:8 }}>
                <div style={{ width:7,height:7,borderRadius:'50%',background:'#FF3D00',animation:'blink 1s infinite' }} />
                <strong ref={progressTextRef} style={{ color:'#fff' }}>Plotting route...</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideRight{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}
        .leaflet-container{background:#0d0d0d!important}
        .leaflet-popup-content-wrapper{background:#1a1a1a;color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5)}
        .leaflet-popup-tip{background:#1a1a1a}
        .leaflet-popup-content{font-family:'Space Grotesk',sans-serif;font-size:.85rem;font-weight:600}
        .trip-card:hover .view-route-btn{background:#FF3D00!important;color:#fff!important;box-shadow:0 8px 24px rgba(255,61,0,.35)}
        .leaflet-fade-anim .leaflet-tile,.leaflet-zoom-anim .leaflet-zoom-animated{will-change:auto!important}
        @media(max-width:900px){
          .modal-inner{grid-template-columns:1fr!important;grid-template-rows:auto 1fr}
          .modal-inner>div:first-child{max-height:50vh;overflow-y:auto}
        }
        @media(max-width:600px){
          .trip-grid{gap:12px!important}
          .trip-grid>div{border-radius:16px!important}
        }
      `}</style>
    </>
  );
}