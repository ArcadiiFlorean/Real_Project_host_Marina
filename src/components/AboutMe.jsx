import { useTranslation } from 'react-i18next';

function AboutMe() {
  const { t } = useTranslation();

  return (
    <section id="despre" className="relative py-16 bg-white overflow-hidden">
      {/* Animații de fundal - cercuri colorate animate */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full opacity-15 blur-3xl animate-float-slow"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-15 blur-3xl animate-float-slow animation-delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-15 blur-3xl animate-float-slow animation-delay-2000"></div>
      <div className="absolute bottom-32 right-10 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full opacity-15 blur-3xl animate-float-slow animation-delay-3000"></div>

      {/* Particule plutitoare decorative */}
      <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-float-particle opacity-40"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-float-particle animation-delay-1000 opacity-40"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2.5 h-2.5 bg-purple-400 rounded-full animate-float-particle animation-delay-2000 opacity-40"></div>
      <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-float-particle animation-delay-3000 opacity-40"></div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Badge + Titlu */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-orange-100 backdrop-blur px-4 py-2 rounded-full shadow-md mb-4 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-gentle">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
            <span className="w-2 h-2 bg-pink-500 rounded-full absolute"></span>
            <span className="text-sm text-gray-800 font-medium">✨ {t('about.badge')}</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-[#8B4513] leading-tight mb-3 animate-fade-in-up animation-delay-200">
            {t('about.title')}<br />
            <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
              {t('about.titleHighlight')}
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Conținut principal */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* STÂNGA - IMAGINE cu animații */}
          <div className="relative animate-slide-in-left order-2 lg:order-1">
            {/* Glow effect animat */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-orange-400 to-purple-400 rounded-3xl opacity-20 blur-2xl animate-pulse-glow"></div>
            
            {/* Container imagine */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-pink-300/50 transition-all duration-500 transform hover:scale-105 hover:rotate-1 max-w-md mx-auto group">
              <img
                src="/images/about-me.jpg"
                alt="Marina Cociug - Despre mine"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay gradient animat */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shine effect la hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* Badge plutitor cu animație */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 animate-float-badge hover:scale-110 transition-transform duration-300 group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xl animate-bounce-gentle shadow-lg">
                  💝
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-pink-600 transition-colors">Marina Cociug</p>
                  <p className="text-xs text-gray-600">IBCLC Certified</p>
                </div>
              </div>
            </div>
          </div>

          {/* DREAPTA - TEXT cu animații */}
          <div className="space-y-5 animate-slide-in-right order-1 lg:order-2">
            <div className="space-y-4">
              <p className="text-base text-gray-700 leading-relaxed animate-fade-in-up animation-delay-600 hover:text-gray-900 transition-colors">
                {t('about.paragraph1')}
              </p>
              <p className="text-base text-gray-700 leading-relaxed animate-fade-in-up animation-delay-800 hover:text-gray-900 transition-colors">
                {t('about.paragraph2')}
              </p>
              <p className="text-base font-medium bg-gradient-to-r from-pink-700 to-orange-700 bg-clip-text text-transparent leading-relaxed animate-fade-in-up animation-delay-1000">
                {t('about.paragraph3')}
              </p>
            </div>

            {/* Stats cards cu animații complexe */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-white rounded-2xl p-4 text-center transform hover:scale-110 hover:-rotate-2 transition-all duration-300 shadow-md hover:shadow-xl animate-fade-in-up animation-delay-1200 group cursor-pointer">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent mb-1 group-hover:scale-125 transition-transform duration-300">500+</div>
                <div className="text-xs text-gray-600 group-hover:text-pink-700 transition-colors">{t('about.stats.families')}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-white rounded-2xl p-4 text-center transform hover:scale-110 hover:rotate-2 transition-all duration-300 shadow-md hover:shadow-xl animate-fade-in-up animation-delay-1400 group cursor-pointer">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-1 group-hover:scale-125 transition-transform duration-300">12+</div>
                <div className="text-xs text-gray-600 group-hover:text-orange-700 transition-colors">{t('about.stats.years')}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-white rounded-2xl p-4 text-center transform hover:scale-110 hover:-rotate-2 transition-all duration-300 shadow-md hover:shadow-xl animate-fade-in-up animation-delay-1600 group cursor-pointer">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-1 group-hover:scale-125 transition-transform duration-300">98%</div>
                <div className="text-xs text-gray-600 group-hover:text-purple-700 transition-colors">{t('about.stats.satisfaction')}</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-2xl p-4 text-center transform hover:scale-110 hover:rotate-2 transition-all duration-300 shadow-md hover:shadow-xl animate-fade-in-up animation-delay-1800 group cursor-pointer">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-1 group-hover:scale-125 transition-transform duration-300">24/7</div>
                <div className="text-xs text-gray-600 group-hover:text-blue-700 transition-colors">{t('about.stats.available')}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CSS Animații extensive */}
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
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
          }
          33% { 
            transform: translate(30px, -30px) scale(1.1);
          }
          66% { 
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.8;
          }
        }
        
        @keyframes float-badge {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          50% { 
            transform: translateY(-15px) rotate(3deg);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-5px);
          }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out 0.2s both;
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 8s ease-in-out infinite;
        }
        
        .animate-float-badge {
          animation: float-badge 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        .animation-delay-1600 { animation-delay: 1.6s; }
        .animation-delay-1800 { animation-delay: 1.8s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
      `}</style>
    </section>
  );
}

export default AboutMe;