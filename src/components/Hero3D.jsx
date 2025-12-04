import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useTranslation } from 'react-i18next';

// Animație gingașă în background - cercuri plutitoare
function GentleBackground() {
  const pointsRef = useRef();
  const count = 600;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      [1, 0.8, 0.85],
      [1, 0.85, 0.85],
      [0.95, 0.85, 0.8],
      [0.85, 0.9, 1],
      [1, 0.9, 0.65],
      [0.9, 0.8, 1],
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 12;

      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color[0];
      colors[i3 + 1] = color[1];
      colors[i3 + 2] = color[2];

      sizes[i] = Math.random() * 3 + 0.8;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime * 0.5;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.005;
        positions[i3] += Math.cos(time + i * 0.1) * 0.004;
        positions[i3 + 2] += Math.sin(time * 0.3 + i * 0.05) * 0.002;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.z = time * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Hero3D() {
  const { t } = useTranslation();

  return (
   <div className="relative flex items-center pt-16 bg-[#f5f1ed]">
      {/* Animație gingașă în background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <GentleBackground />
        </Canvas>
      </div>

      {/* Cercuri decorative animate */}
      <div className="absolute top-16 right-1/3 w-32 h-32 bg-yellow-200 rounded-full opacity-50 blur-2xl animate-pulse-custom"></div>
      <div className="absolute bottom-24 right-1/4 w-56 h-56 bg-pink-200 rounded-full opacity-40 blur-3xl animate-pulse-custom animation-delay-2000"></div>
      <div className="absolute top-1/3 left-16 w-40 h-40 bg-purple-200 rounded-full opacity-35 blur-3xl animate-pulse-custom animation-delay-3000"></div>

      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center justify-items-center">
          {/* PARTEA STÂNGĂ - TEXT */}
  <div className="space-y-4 relative z-10 -mt-64">
            {/* Badge - Consultant certificat */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in text-xs">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full absolute"></span>
              <span className="text-gray-700">
                ✨ {t('hero.certified')}
              </span>
            </div>

            {/* Titlu Principal */}
            <h1 className="text-4xl lg:text-5xl font-bold text-[#8B4513] leading-tight animate-slide-up">
              {t('hero.title')}
              <br />
              <span className="text-[#A0522D]">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            {/* Subtitlu */}
            <p className="text-xl font-semibold text-gray-800 animate-slide-up animation-delay-200">
              {t('hero.subtitle')}
            </p>

            {/* Descriere */}
            <p className="text-base text-gray-600 leading-relaxed max-w-xl animate-slide-up animation-delay-400">
              {t('hero.description')}
            </p>

            {/* Butoane */}
            <div className="flex flex-wrap gap-3 pt-3 animate-slide-up animation-delay-600">
              <button className="group bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 flex items-center gap-2 font-medium text-sm relative overflow-hidden">
                <span className="relative z-10">{t('hero.bookConsultation')}</span>
                <span className="relative z-10 group-hover:translate-x-2 transition-transform duration-300">→</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              <button className="group bg-white border-2 border-orange-300 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-110 flex items-center gap-2 font-medium text-sm hover:shadow-xl">
                <span className="group-hover:rotate-12 transition-transform duration-300">📖</span>
                <span>{t('hero.freeEbook')}</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-4 animate-slide-up animation-delay-800">
              {/* Avatare mame */}
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white animate-float"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white animate-float animation-delay-500"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white animate-float animation-delay-1000"></div>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-semibold text-gray-800">
                    {t('hero.mothersHelped')}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <span className="text-lg animate-bounce-gentle">⭐</span>
                <p className="text-xs font-semibold text-gray-800">
                  {t('hero.rating')}
                </p>
              </div>
            </div>
          </div>

          {/* PARTEA DREAPTĂ - IMAGINE */}
      <div className="relative -mt-90">
            {/* Badge plutitor - Experiență */}
            <div className="absolute top-16 -left-6 bg-gradient-to-br from-white to-green-50 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg z-10 animate-float-strong hover:scale-110 transition-transform duration-300">
              <div className="flex items-center gap-1.5">
                <span className="text-green-500 text-sm animate-pulse">✓</span>
                <p className="text-xs font-medium text-gray-800">
                  {t('hero.experience')}
                </p>
              </div>
            </div>

            {/* Badge plutitor - Support */}
            <div className="absolute bottom-24 -right-3 bg-gradient-to-br from-white to-pink-50 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg z-10 animate-float-strong animation-delay-1500 hover:scale-110 transition-transform duration-300">
              <div className="flex items-center gap-1.5">
                <span className="text-pink-500 text-sm animate-pulse">💬</span>
                <p className="text-xs font-medium text-gray-800">
                  {t('hero.support')}
                </p>
              </div>
            </div>

            {/* Container imagine */}
            <div className="relative animate-fade-in animation-delay-300 max-w-lg mx-auto">
              {/* Cerc decorativ */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-pink-300 rounded-full opacity-40 blur-2xl -z-10 animate-pulse-custom"></div>

              {/* Imagine consultant */}
              <div className="relative rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/consultant.jpg"
                  alt="Marina Cociug - Consultant Lactație"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS pentru animații */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-strong {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-25px) rotate(3deg); 
          }
        }
        
        @keyframes pulse-custom {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.4; 
          }
          50% { 
            transform: scale(1.15); 
            opacity: 0.6; 
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-strong {
          animation: float-strong 4s ease-in-out infinite;
        }
        
        .animate-pulse-custom {
          animation: pulse-custom 4s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
      `}</style>
    </div>
  );
}

export default Hero3D;