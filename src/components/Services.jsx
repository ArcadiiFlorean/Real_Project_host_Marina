import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { createCheckoutSession } from "../lib/stripe";
import { Heart } from "lucide-react";

function Services() {
  const { t, i18n } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("consultation_packages")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedContent = (pkg, field) => {
    const lang = i18n.language;
    return pkg[`${field}_${lang}`] || pkg[`${field}_ro`];
  };

  const handleBooking = async (pkg) => {
    try {
      console.log("📦 Package from DB:", pkg);
      console.log("💰 Price from DB:", pkg.price, "Type:", typeof pkg.price);

      const packageData = {
        id: pkg.id,
        name: getLocalizedContent(pkg, "name"),
        description: getLocalizedContent(pkg, "description"),
        price: parseFloat(pkg.price) || 0, // ⭐ CONVERSIE AICI
      };

      console.log(
        "💰 Price after parse:",
        packageData.price,
        "Type:",
        typeof packageData.price
      );

      await createCheckoutSession(packageData);
    } catch (error) {
      console.error("Error:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      id="servicii"
      className="relative py-12 bg-gradient-to-b from-white to-pink-50 overflow-hidden"
    >
      {/* Decorative Circles */}
      <div className="absolute top-10 right-10 w-48 h-48 bg-pink-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-orange-200 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 bg-white backdrop-blur px-3 py-1.5 rounded-full shadow-md mb-3"
          >
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
            <span className="text-xs text-gray-700">{t("services.badge")}</span>
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-bold text-[#8B4513] leading-tight mb-3">
            {t("services.title")}
            <br />
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {t("services.titleHighlight")}
            </span>
          </h2>

          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </motion.div>

        {/* Packages Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group ${
                pkg.is_popular ? "ring-2 ring-pink-300 ring-offset-4" : ""
              }`}
            >
              {/* Popular Badge */}
              {pkg.is_popular && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  className="absolute top-4 right-4 z-10"
                >
                  <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur">
                    ⭐ {t("services.popular")}
                  </div>
                </motion.div>
              )}

              {/* Elegant Header */}
              <div className="relative h-32 bg-gradient-to-br from-pink-50 via-orange-50 to-pink-50 flex items-end justify-start overflow-hidden px-6 pb-4">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full blur-2xl opacity-20"></div>

                {/* Package Name */}
                <motion.h3
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-bold text-gray-800 relative z-10 group-hover:text-pink-600 transition-colors"
                >
                  {getLocalizedContent(pkg, "name")}
                </motion.h3>
              </div>

              <div className="relative p-6">
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5 min-h-[60px]">
                  {getLocalizedContent(pkg, "description")}
                </p>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                  <span className="font-medium">
                    {pkg.duration_minutes} {t("services.minutes")}
                  </span>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    {t("services.included")}
                  </p>
                  <ul className="space-y-2.5">
                    {getLocalizedContent(pkg, "features").map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        {/* Elegant checkmark */}
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center mt-0.5">
                          <svg
                            className="w-3 h-3 text-pink-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="flex-1">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-5 py-4"
                >
                  <div className="flex items-baseline gap-2 justify-center">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent"
                    >
                      {pkg.price}
                    </motion.span>
                    <span className="text-xl text-gray-400">£</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {t("services.oneTimePayment")}
                  </p>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => handleBooking(pkg)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group/btn w-full relative overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl"></div>

                  {/* Hover effect */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />

                  {/* Button content */}
                  <div className="relative py-3.5 text-white font-medium text-sm flex items-center justify-center gap-2">
                    <span>{t("services.bookNow")}</span>
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.button>
              </div>

              {/* Bottom decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-orange-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* No packages message */}
        {packages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10"
          >
            <p className="text-gray-500 text-base">
              {t("services.noServices")}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Services;
