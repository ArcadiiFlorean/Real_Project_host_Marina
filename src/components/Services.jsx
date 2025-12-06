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
    <section id="servicii" className="relative py-12 bg-gradient-to-b from-white to-pink-50 overflow-hidden">
      {/* Decorative Circles - mai mici */}
      <div className="absolute top-10 right-10 w-48 h-48 bg-pink-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-orange-200 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header - mai compact */}
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
            <span className="text-xs text-gray-700">💝 {t('services.badge')}</span>
          </motion.div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-[#8B4513] leading-tight mb-3">
            {t('services.title')}<br />
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {t('services.titleHighlight')}
            </span>
          </h2>
          
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        {/* Packages Grid - mai compact */}
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
              whileHover={{ y: -8, scale: pkg.is_popular ? 1.02 : 1.03 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group ${
                pkg.is_popular ? 'border-2 border-pink-400' : ''
              }`}
            >
              {/* Popular Badge - mai mic */}
              {pkg.is_popular && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10"
                >
                  ⭐ {t('services.popular')}
                </motion.div>
              )}

              {/* Icon Header - mai mic */}
              <div className="relative h-24 bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center overflow-hidden">
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl relative z-10"
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

              <div className="relative p-5">
                {/* Package Name - mai mic */}
                <motion.h3
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors"
                >
                  {getLocalizedContent(pkg, 'name')}
                </motion.h3>

                {/* Description - mai mic */}
                <p className="text-gray-600 text-xs leading-relaxed mb-3">
                  {getLocalizedContent(pkg, 'description')}
                </p>

                {/* Duration - mai compact */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-100">
                  <span>⏱️</span>
                  <span className="font-medium">{pkg.duration_minutes} {t('services.minutes')}</span>
                </div>

                {/* Features - mai compact */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    {t('services.included')}
                  </p>
                  <ul className="space-y-1.5">
                    {getLocalizedContent(pkg, 'features').map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-start gap-2 text-xs text-gray-600"
                      >
                        <span className="text-green-500 mt-0.5 text-sm">✓</span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Price - mai compact */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-4 pt-3 border-t border-gray-100"
                >
                  <div className="flex items-end gap-2">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-3xl font-bold text-pink-600"
                    >
                      {pkg.price}
                    </motion.span>
                    <span className="text-lg text-gray-500 mb-1">€</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{t('services.oneTimePayment')}</p>
                </motion.div>

                {/* CTA Button - mai compact */}
                <motion.button
                  onClick={() => handleBooking(pkg)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
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
            className="text-center py-10"
          >
            <p className="text-gray-500 text-base">{t('services.noServices')}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Services;