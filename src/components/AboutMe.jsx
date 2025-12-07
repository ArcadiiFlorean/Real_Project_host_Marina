import { useTranslation } from "react-i18next";
import { ShieldCheck } from 'lucide-react';
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef } from "react";

// Component pentru Counter Animat
function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = "",
  prefix = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration });
      return controls.stop;
    }
  }, [isInView, count, to, duration]);

  return (
    <motion.span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

function AboutMe() {
  const { t } = useTranslation();

  return (
    <section
      id="despre"
      className="relative py-12 bg-gradient-to-b from-pink-50 to-white overflow-hidden"
    >
      {/* Decorative Elements - mai mici */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        {/* Header - mai compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white backdrop-blur px-3 py-1.5 rounded-full shadow-md mb-3">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-700">
              {t("about.badge") || "💝 Poveste de pasiune"}
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-[#8B4513] leading-tight mb-3">
            {t("about.title") || "De la mamă la"}
            <br />
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {t("about.titleHighlight") || "consultant certificat"}
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image & Badge - MAI MIC */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-md mx-auto"
          >
            {/* Certified Badge - mai mic */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
              className="absolute -top-4 -right-4 bg-gradient-to-br from-pink-500 to-orange-500 text-white px-4 py-3 rounded-xl shadow-xl z-10"
            >
              <div className="text-center">
              <div className="mb-1 flex justify-center">
  <ShieldCheck className="w-8 h-8" strokeWidth={2.5} />
</div>
                <p className="text-xs font-bold">Marina Cociug</p>
                <p className="text-[10px] opacity-90">IBCLC Certified</p>
              </div>
            </motion.div>

            {/* Image - MAI MICĂ */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="/images/about-me.jpg"
                alt="Marina Cociug"
                loading="lazy"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>

            {/* Decorative circle - mai mic */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-300 rounded-full blur-2xl -z-10"
            />
          </motion.div>

          {/* Right Side - Content - MAI COMPACT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-gray-700 leading-relaxed"
            >
              {t("about.paragraph1") ||
                "Călătoria mea în lumea consultanței în alăptare a început acum peste 5 ani, când am devenit mamă pentru prima dată. Provocările pe care le-am întâmpinat m-au determinat să studiez profund acest domeniu frumos și să ajut alte mame."}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base text-gray-700 leading-relaxed"
            >
              {t("about.paragraph2") ||
                "Am absolvit cursuri internaționale de certificare IBCLC și am lucrat cu peste 500 de familii, fiecare cu povestea ei unică. Pasiunea mea este să ofer suport personalizat, adaptat nevoilor fiecărei mame și bebeluș."}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base text-gray-700 leading-relaxed"
            >
              {t("about.paragraph3") ||
                "Cred cu tărie că fiecare mamă merită să fie ascultată, înțeleasă și susținută în această călătorie minunată. Sunt aici pentru tine, cu empatie, experiență și soluții practice."}
            </motion.p>

            {/* Stats Grid - MAI COMPACT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6"
            >
              {/* Stat 1 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-3 bg-white rounded-xl shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-1">
                  <AnimatedCounter
                    from={0}
                    to={500}
                    duration={2.5}
                    suffix="+"
                  />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {t("about.stat1") || "Familii ajutate"}
                </p>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ delay: 0.1 }}
                className="text-center p-3 bg-white rounded-xl shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-1">
                  <AnimatedCounter from={0} to={12} duration={2} suffix="+" />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {t("about.stat2") || "Ani experiență"}
                </p>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ delay: 0.2 }}
                className="text-center p-3 bg-white rounded-xl shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-1">
                  <AnimatedCounter from={0} to={98} duration={2.5} suffix="%" />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {t("about.stat3") || "Satisfacție clienți"}
                </p>
              </motion.div>

              {/* Stat 4 - 24/7 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ delay: 0.3 }}
                className="text-center p-3 bg-white rounded-xl shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-1">
                  <AnimatedCounter from={0} to={24} duration={2} />
                  /
                  <AnimatedCounter from={0} to={7} duration={1.5} />
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {t("about.stat4") || "Disponibilitate"}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;