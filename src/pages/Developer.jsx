import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { title:'GANESA SAVAGEKING',     body:'A passionate innovator driven by creativity and technology, blending ideas into impactful digital experiences.' },
  { title:'COMPUTER APPLICATIONS', body:'Exploring the world of software solutions, from coding fundamentals to advanced system development.' },
  { title:'FULLSTACK DEVELOPER',   body:'Skilled in building complete web solutions — from dynamic front-end interfaces to powerful back-end systems.' },
  { title:'DEVOPS ENGINEER',       body:'Streamlining development and operations by automating workflows, ensuring scalability, and delivering reliability.' },
];

export default function Developer() {
  const canvasRef    = useRef(null);
  const rotLblRef    = useRef(null);
  const scaleLblRef  = useRef(null);
  const scrollLblRef = useRef(null);

  useEffect(() => {
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (canvasRef.current) canvasRef.current.appendChild(renderer.domElement);
    camera.position.z = 5;

    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 1),
      new THREE.MeshStandardMaterial({ color:0x00ffff, emissive:0x0044ff, emissiveIntensity:.5, metalness:.8, roughness:.2, flatShading:true })
    );
    scene.add(crystal);

    const wfMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.01, 1),
      new THREE.MeshBasicMaterial({ color:0xff00ff, wireframe:true, transparent:true, opacity:.3 })
    );
    scene.add(wfMesh);

    scene.add(new THREE.AmbientLight(0xffffff, .5));
    const l1 = new THREE.PointLight(0x00ffff, 2, 100); l1.position.set(5,5,5);   scene.add(l1);
    const l2 = new THREE.PointLight(0xff00ff, 2, 100); l2.position.set(-5,-5,5); scene.add(l2);

    const pPos = new Float32Array(1000*3);
    for (let i = 0; i < pPos.length; i++) pPos[i] = (Math.random()-.5)*20;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size:.02, color:0xffffff, transparent:true, opacity:.6 }));
    scene.add(particles);

    const state = { rotation:0, scale:1, colorShift:0 };

    const sCtx = gsap.context(() => {
      gsap.to(state, {
        scrollTrigger: {
          trigger:'.dev-content', start:'top top', end:'bottom bottom', scrub:1,
          onUpdate(self) {
            const p = self.progress;
            state.rotation = p * Math.PI * 4;
            state.scale    = 1 + Math.sin(p * Math.PI * 2) * .5;
            state.colorShift = p;
            if (rotLblRef.current)    rotLblRef.current.textContent    = Math.round(p*1440) + '°';
            if (scaleLblRef.current)  scaleLblRef.current.textContent  = state.scale.toFixed(2);
            if (scrollLblRef.current) scrollLblRef.current.textContent = Math.round(p*100) + '%';
          },
        },
      });
      gsap.utils.toArray('.dev-txt').forEach(box => {
        gsap.to(box, { scrollTrigger:{ trigger:box, start:'top 80%', end:'top 20%', scrub:1 }, opacity:1, y:0 });
      });
      gsap.to('.dev-scroll-ind', {
        scrollTrigger:{ trigger:'.dev-content', start:'top top', end:'100 top', scrub:1 }, opacity:0,
      });
    });

    let t = 0, raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t  += 0.01;
      crystal.rotation.set(state.rotation, state.rotation*.7, t*.3);
      wfMesh.rotation.set(state.rotation*1.2, state.rotation*.9, t*.2);
      crystal.scale.setScalar(state.scale);
      wfMesh.scale.setScalar(state.scale);
      const hue = state.colorShift * 360;
      crystal.material.color.setHSL(hue/360, 1, .5);
      crystal.material.emissive.setHSL((hue+180)/360, 1, .3);
      wfMesh.material.color.setHSL((hue+120)/360, 1, .5);
      particles.rotation.y = t*.1; particles.rotation.x = t*.05;
      l1.position.set(Math.sin(t)*5, Math.cos(t)*5, 5);
      l2.position.set(Math.cos(t)*5, Math.sin(t)*5, 5);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    const onMouse  = e => { gsap.to(camera.position, { x:(e.clientX/window.innerWidth-.5), y:-(e.clientY/window.innerHeight-.5), duration:1 }); };
    window.addEventListener('resize', onResize);
    document.addEventListener('mousemove', onMouse);
    return () => {
      cancelAnimationFrame(raf); sCtx.revert();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouse);
      renderer.dispose();
      if (canvasRef.current) canvasRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div style={{ background:'#000', color:'#fff', minHeight:'100vh', overflow:'hidden', fontFamily:'Inter,-apple-system,sans-serif' }}>
      <div ref={canvasRef} style={{ position:'fixed',top:0,left:0,width:'100%',height:'100vh',zIndex:1 }} />

      {/* HUD */}
      <div style={{ position:'fixed', top:'clamp(56px,10vw,80px)', right:'clamp(8px,2vw,20px)', background:'rgba(0,0,0,.55)', padding:'clamp(8px,1.5vw,15px) clamp(10px,2vw,20px)', borderRadius:10, border:'1px solid rgba(255,255,255,.2)', zIndex:10, fontSize:'clamp(0.65rem,1.6vw,0.875rem)', backdropFilter:'blur(10px)' }}>
        <div style={{ margin:'4px 0',color:'#00ffff' }}>Rotation: <span ref={rotLblRef}>0°</span></div>
        <div style={{ margin:'4px 0',color:'#00ffff' }}>Scale: <span ref={scaleLblRef}>1.0</span></div>
        <div style={{ margin:'4px 0',color:'#00ffff' }}>Scroll: <span ref={scrollLblRef}>0%</span></div>
      </div>

      {/* Scroll indicator */}
      <div className="dev-scroll-ind" style={{ position:'fixed', bottom:'clamp(18px,4vw,30px)', left:'50%', transform:'translateX(-50%)', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', gap:8, animation:'bounce 2s infinite' }}>
        <span style={{ fontSize:'clamp(0.6rem,1.4vw,0.875rem)', color:'rgba(255,255,255,.6)', letterSpacing:2 }}>SCROLL</span>
        <div style={{ width:'clamp(22px,4vw,30px)', height:'clamp(36px,6vw,50px)', border:'2px solid rgba(255,255,255,.6)', borderRadius:15, position:'relative' }}>
          <div style={{ width:4, height:9, background:'rgba(255,255,255,.6)', position:'absolute', top:9, left:'50%', transform:'translateX(-50%)', borderRadius:2, animation:'scrollAnim 2s infinite' }} />
        </div>
      </div>

      {/* Scroll sections */}
      <div className="dev-content" style={{ position:'relative', zIndex:2, pointerEvents:'none' }}>
        {SECTIONS.map((s,i) => (
          <div key={i} style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:'clamp(16px,5vw,50px)', textAlign:'center' }}>
            <div className="dev-txt" style={{ maxWidth:'clamp(260px,80vw,600px)', opacity:0, transform:'translateY(50px)' }}>
              <h1 style={{ fontSize:'clamp(1.5rem,5vw,4rem)', marginBottom:16, background:'linear-gradient(45deg,#00ffff,#ff00ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', fontWeight:900, lineHeight:1.1 }}>
                {s.title}
              </h1>
              <p style={{ fontSize:'clamp(0.85rem,2.2vw,1.2rem)', lineHeight:1.8, color:'rgba(255,255,255,.8)' }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-10px)}}
        @keyframes scrollAnim{0%{top:9px;opacity:1}100%{top:28px;opacity:0}}
        @media(max-width:480px){.dev-scroll-ind{display:none!important}}
      `}</style>
    </div>
  );
}
