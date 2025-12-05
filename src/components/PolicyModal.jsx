import { useTranslation } from 'react-i18next';

function PolicyModal({ isOpen, onClose, type }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getContent = () => {
    switch(type) {
      case 'privacy':
        return {
          title: t('policies.privacy.title'),
          content: (
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.privacy.section1Title')}</h3>
              <p>{t('policies.privacy.section1Content')}</p>
              
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.privacy.section2Title')}</h3>
              <p>{t('policies.privacy.section2Content')}</p>
              
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.privacy.section3Title')}</h3>
              <p>{t('policies.privacy.section3Content')}</p>
            </div>
          )
        };
      
      case 'terms':
        return {
          title: t('policies.terms.title'),
          content: (
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.terms.section1Title')}</h3>
              <p>{t('policies.terms.section1Content')}</p>
              
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.terms.section2Title')}</h3>
              <p>{t('policies.terms.section2Content')}</p>
              
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.terms.section3Title')}</h3>
              <p>{t('policies.terms.section3Content')}</p>
            </div>
          )
        };
      
      case 'cookies':
        return {
          title: t('policies.cookies.title'),
          content: (
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.cookies.section1Title')}</h3>
              <p>{t('policies.cookies.section1Content')}</p>
              
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.cookies.section2Title')}</h3>
              <p>{t('policies.cookies.section2Content')}</p>
              
              <h3 className="text-lg font-semibold text-gray-900">{t('policies.cookies.section3Title')}</h3>
              <p>{t('policies.cookies.section3Content')}</p>
            </div>
          )
        };
      
      default:
        return { title: '', content: null };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {content}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 font-medium"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}

export default PolicyModal;