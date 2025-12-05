import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicii" className="relative py-20 bg-gradient-to-b from-white to-pink-50 overflow-hidden">
      {/* Cercuri decorative */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-pink-200 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse-slow animation-delay-2000"></div>

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white backdrop-blur px-4 py-2 rounded-full shadow-md mb-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-700">💝 {t('services.badge')}</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#8B4513] leading-tight mb-4">
            {t('services.title')}<br />
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {t('services.titleHighlight')}
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group animate-fade-in-up ${
                pkg.is_popular ? 'border-2 border-pink-400 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badge Popular */}
              {pkg.is_popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce-gentle z-10">
                  ⭐ {t('services.popular')}
                </div>
              )}

              {/* Icon Header */}
              <div className="relative h-32 bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                <span className="text-6xl">{pkg.icon}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="relative p-6">
                {/* Package Name */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                  {getLocalizedContent(pkg, 'name')}
                </h3>

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
                  <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">{t('services.included')}</p>
                  <ul className="space-y-2">
                    {getLocalizedContent(pkg, 'features').map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="mb-6 pt-4 border-t border-gray-100">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-pink-600">{pkg.price}</span>
                    <span className="text-xl text-gray-500 mb-1">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('services.oneTimePayment')}</p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleBooking(pkg)}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  📅 {t('services.bookNow')} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No packages message */}
        {packages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('services.noServices')}</p>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.2;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}

export default Services;