import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

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
        .from('consultation_packages')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedContent = (pkg, field) => {
    const lang = i18n.language;
    return pkg[`${field}_${lang}`] || pkg[`${field}_ro`];
  };

  const handleBooking = (pkg) => {
    alert(`${t('services.bookNow')}: ${getLocalizedContent(pkg, 'name')} - ${pkg.price}€`);
    // TODO: Redirect către Stripe Checkout
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"
          />
        </div>
      </section>
    );
  }

  return (
    <section id="servicii" className="relative py-20 bg-gradient-to-b from-white to-pink-50 overflow-hidden">
      {/* Decorative Circles */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-pink-200 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 bg-white backdrop-blur px-4 py-2 rounded-full shadow-md mb-4"
          >
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-700">💝 {t('services.badge')}</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#8B4513] leading-tight mb-4">
            {t('services.title')}<br />
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {t('services.titleHighlight')}
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {/* Packages Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={cardVariants}
              whileHover={{ y: -10, scale: pkg.is_popular ? 1.02 : 1.05 }}
              className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group ${
                pkg.is_popular ? 'border-2 border-pink-400' : ''
              }`}
            >
              {/* Popular Badge */}
              {pkg.is_popular && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10"
                >
                  ⭐ {t('services.popular')}
                </motion.div>
              )}

              {/* Icon Header */}
              <div className="relative h-32 bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center overflow-hidden">
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-6xl relative z-10"
                >
                  {pkg.icon}
                </motion.span>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-orange-400/30"
                />
              </div>

              <div className="relative p-6">
                {/* Package Name */}
                <motion.h3
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors"
                >
                  {getLocalizedContent(pkg, 'name')}
                </motion.h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {getLocalizedContent(pkg, 'description')}
                </p>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                  <span>⏱️</span>
                  <span className="font-medium">{pkg.duration_minutes} {t('services.minutes')}</span>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    {t('services.included')}
                  </p>
                  <ul className="space-y-2">
                    {getLocalizedContent(pkg, 'features').map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature}</span>
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
                  className="mb-6 pt-4 border-t border-gray-100"
                >
                  <div className="flex items-end gap-2">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="text-4xl font-bold text-pink-600"
                    >
                      {pkg.price}
                    </motion.span>
                    <span className="text-xl text-gray-500 mb-1">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('services.oneTimePayment')}</p>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => handleBooking(pkg)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2"
                  >
                    📅 {t('services.bookNow')} →
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No packages message */}
        {packages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">{t('services.noServices')}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Services;