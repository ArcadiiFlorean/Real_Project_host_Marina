import { useTranslation } from 'react-i18next';
import { useState } from 'react';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Buton curent - DOAR STEAG */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-pink-50 to-orange-50 hover:from-pink-100 hover:to-orange-100 transition-all duration-500 hover:shadow-md group"
      >
        <span className="text-base group-hover:scale-110 transition-transform duration-300">
          {currentLang.flag}
        </span>
        <svg 
          className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-down border border-pink-100">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 ${
                i18n.language === lang.code ? 'bg-gradient-to-r from-pink-100 to-orange-100' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-lg hover:scale-125 transition-transform duration-300">
                {lang.flag}
              </span>
              <span className="text-gray-700 font-medium">
                {lang.name}
              </span>
              {i18n.language === lang.code && (
                <span className="ml-auto text-pink-500 animate-pulse">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default LanguageSelector;