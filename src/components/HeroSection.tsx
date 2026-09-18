import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { EduSphereLogo } from './EduSphereLogo';
import { Play, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface HeroSectionProps {
  onOpenDemoModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemoModal }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const magnetBtnRef = useRef<HTMLButtonElement>(null);

  // THREE.JS CANVAS SCENE
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.02);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 700;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Cyber Emerald Sphere (Schools Network Globe)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Point cloud globe
    const radius = 6;
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color('#00C896');
    const color2 = new THREE.Color('#00875A');
    const color3 = new THREE.Color('#38BDF8');

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = color1.clone().lerp(i % 2 === 0 ? color2 : color3, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const globeGeo = new THREE.BufferGeometry();
    globeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    globeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const globeMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const globePoints = new THREE.Points(globeGeo, globeMat);
    globeGroup.add(globePoints);

    // Latitude Wireframe Rings
    const ringMat = new THREE.LineBasicMaterial({ color: 0x00c896, transparent: true, opacity: 0.2 });
    for (let i = -4; i <= 4; i += 2) {
      const r = Math.sqrt(Math.max(0, radius * radius - i * i));
      const ringGeo = new THREE.BufferGeometry();
      const ringPts = [];
      for (let j = 0; j <= 64; j++) {
        const theta = (j / 64) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(r * Math.cos(theta), i, r * Math.sin(theta)));
      }
      ringGeo.setFromPoints(ringPts);
      const ring = new THREE.Line(ringGeo, ringMat);
      globeGroup.add(ring);
    }

    // 2. Floating 3D ERP Module Cubes (Holographic Nodes)
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const moduleData = [
      { name: 'Smart Fee', color: 0x00c896, pos: [8, 4, 2] },
      { name: 'RFID Attendance', color: 0x38bdf8, pos: [-8, 2, -1] },
      { name: 'GPS Bus Tracker', color: 0xf59e0b, pos: [6, -4, 3] },
      { name: 'Report Cards', color: 0x10b981, pos: [-7, -3, 1] },
    ];

    const cubes: THREE.Mesh[] = [];

    moduleData.forEach((mod) => {
      const boxGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: mod.color, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edges, lineMat);

      const meshMat = new THREE.MeshBasicMaterial({
        color: mod.color,
        transparent: true,
        opacity: 0.15,
        wireframe: false,
      });
      const cubeMesh = new THREE.Mesh(boxGeo, meshMat);
      cubeMesh.add(wireframe);

      cubeMesh.position.set(mod.pos[0], mod.pos[1], mod.pos[2]);
      cubeGroup.add(cubeMesh);
      cubes.push(cubeMesh);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00c896, 1.5);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) / 100;
      mouseY = (e.clientY - windowHalfY) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Globe Rotation
      globeGroup.rotation.y = elapsedTime * 0.15;
      globeGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      // Rotate Cubes
      cubes.forEach((cube, idx) => {
        cube.rotation.x += 0.01 * (idx + 1);
        cube.rotation.y += 0.015 * (idx + 1);
        cube.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.008;
      });

      // Camera Parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX * 1.2;
      camera.position.y = -targetY * 1.2;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // GSAP Kinetic Typography Entrance Animation
  useEffect(() => {
    if (!heroTextRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
      );

      gsap.fromTo(
        '.hero-title-line',
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo(
        '.hero-description',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.6 }
      );

      gsap.fromTo(
        '.hero-cta-group',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 }
      );

      gsap.fromTo(
        '.hero-trust-badges',
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 1 }
      );
    }, heroTextRef);

    return () => ctx.revert();
  }, []);

  // Magnetic Button Mouse Interaction
  const handleMagnetMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = magnetBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0) scale(1.04)`;
  };

  const handleMagnetLeave = () => {
    const btn = magnetBtnRef.current;
    if (!btn) return;
    btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 overflow-hidden flex flex-col justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Three.js 3D Background Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        aria-hidden="true"
      />

      {/* Decorative Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={heroTextRef}>
        {/* Top Floating Badge Eyebrow */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2 mb-6 glass-panel rounded-full border border-teal-500/30 text-[#00C896] text-xs sm:text-sm font-bold font-mono-code tracking-[0.25em] uppercase shadow-lg shadow-teal-500/10">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>BHARAT'S NEXT GENERATION PLATFORM</span>
        </div>

        {/* Hero Title with High Impact Bold Typography & Outline Effect */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[92px] font-black tracking-tighter text-white mb-8 leading-[0.88] max-w-5xl mx-auto font-display uppercase">
          <span className="hero-title-line block">
            SMART <span className="text-stroke-emerald">SCHOOL</span>
          </span>
          <span className="hero-title-line block mt-1 text-slate-100">
            ECOSYSTEM.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-description text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal mb-10 leading-relaxed">
          A unified Platform designed for the scale of Bharath's education. Seamlessly integrate admissions, payments, and an AI-powered interface.
        </p>

        {/* CTA Button Group */}
        <div className="hero-cta-group flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          {/* Magnet Primary Button with Pill Aesthetic */}
          <button
            ref={magnetBtnRef}
            onClick={onOpenDemoModal}
            onMouseMove={handleMagnetMove}
            onMouseLeave={handleMagnetLeave}
            className="w-full sm:w-auto relative group inline-flex items-center justify-center gap-3 px-10 py-5 text-sm sm:text-base font-extrabold text-white bg-[#00875A] hover:bg-[#00C896] rounded-full shadow-[0_0_25px_rgba(0,135,90,0.5)] hover:shadow-[0_0_35px_rgba(0,200,150,0.7)] tracking-widest uppercase transition-all duration-300 cursor-pointer animate-pulse-glow"
          >
            <Zap className="w-5 h-5 text-white fill-white" />
            <span>Transform Your School</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Secondary Video/Explore Button */}
          <a
            href="#modules"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 text-sm font-bold tracking-widest uppercase text-slate-200 glass-panel-light hover:bg-slate-800/80 rounded-full border border-slate-700/80 hover:border-teal-400/50 transition-all duration-300 group"
          >
            <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
            <span>Interactive 3D Walkthrough</span>
          </a>
        </div>

        {/* Hero CTA End */}
      </div>
    </section>
  );
};
