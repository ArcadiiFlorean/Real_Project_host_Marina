import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

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

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div
      id="home"
      className="relative flex items-center pt-14 md:pt-20 bg-[#f5f1ed] overflow-hidden"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 opacity-100 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <GentleBackground />
        </Canvas>
      </div>

      {/* Decorative Circles */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-10 right-1/4 w-24 h-24 md:w-32 md:h-32 bg-yellow-200 rounded-full blur-2xl"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-16 right-1/3 w-40 h-40 md:w-56 md:h-56 bg-pink-200 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute top-1/3 left-8 w-32 h-32 md:w-40 md:h-40 bg-purple-200 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* LEFT SIDE - TEXT CONTENT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 md:space-y-6 relative z-10 text-center lg:text-left order-2 lg:order-1"
          >
            {/* Certified Badge */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs md:text-sm text-gray-700 font-medium">
                ✨ {t("hero.certified")}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#8B4513] leading-tight"
            >
              {t("hero.title")}
              <br />
              <span className="text-[#A0522D] bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              {t("hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base relative overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">{t("hero.bookConsultation")}</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative z-10 text-lg"
                >
                  →
                </motion.span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white border-2 border-orange-300 text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base shadow-md hover:shadow-xl w-full sm:w-auto"
              >
                <motion.span
                  whileHover={{ rotate: 12 }}
                  className="text-xl"
                >
                  📖
                </motion.span>
                <span>{t("hero.freeEbook")}</span>
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white shadow-md"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white shadow-md"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white shadow-md"
                  />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-800">
                    {t("hero.mothersHelped")}
                  </p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl md:text-2xl"
                >
                  ⭐
                </motion.span>
                <p className="text-xs sm:text-sm font-bold text-gray-800">
                  {t("hero.rating")}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - IMAGE */}
          <div className="relative order-1 lg:order-2">
            {/* Floating Badge - Experience */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="hidden sm:block absolute top-8 md:top-16 -left-3 md:-left-6 bg-gradient-to-br from-white to-green-50 backdrop-blur-md px-3 md:px-4 py-2 md:py-3 rounded-xl shadow-lg z-10"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-base md:text-lg">✓</span>
                <p className="text-xs md:text-sm font-semibold text-gray-800">
                  {t("hero.experience")}
                </p>
              </div>
            </motion.div>

            {/* Floating Badge - Support */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="hidden sm:block absolute bottom-16 md:bottom-24 -right-2 md:-right-3 bg-gradient-to-br from-white to-pink-50 backdrop-blur-md px-3 md:px-4 py-2 md:py-3 rounded-xl shadow-lg z-10"
            >
              <div className="flex items-center gap-2">
                <span className="text-pink-500 text-base md:text-lg">💬</span>
                <p className="text-xs md:text-sm font-semibold text-gray-800">
                  {t("hero.support")}
                </p>
              </div>
            </motion.div>

            {/* Image Container */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="relative max-w-md md:max-w-lg mx-auto"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 md:-bottom-6 -right-4 md:-right-6 w-32 h-32 md:w-48 md:h-48 bg-pink-300 rounded-full blur-2xl -z-10"
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative md:rounded-3xl overflow-hidden"
              >
                <img
                  src="/images/consultant.jpg"
                  alt="Marina Cociug - Consultant Lactație"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero3D;