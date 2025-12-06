import { motion, useScroll, useTransform } from 'framer-motion';

function ParallaxBackground() {
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50">
      {/* Layer 1 - Roz INTENS */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 right-10 w-96 h-96 bg-pink-400 rounded-full opacity-60 blur-2xl"
      />
      
      {/* Layer 2 - Portocaliu INTENS */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-40 left-20 w-[500px] h-[500px] bg-orange-400 rounded-full opacity-50 blur-2xl"
      />
      
      {/* Layer 3 - Mov INTENS */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-400 rounded-full opacity-40 blur-2xl"
      />

      {/* Layer 4 - Galben (nou) */}
      <motion.div
        style={{ y: useTransform(scrollY, [0, 1000], [0, 100]) }}
        className="absolute top-1/3 left-1/2 w-80 h-80 bg-yellow-300 rounded-full opacity-40 blur-2xl"
      />

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />
    </div>
  );
}

export default ParallaxBackground;