import { useTranslation } from 'react-i18next';

// Language switcher component
const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    localStorage.setItem('language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-200 ${className}`}
      aria-label="Toggle Language"
    >
      {i18n.language === 'ar' ? 'English' : 'العربية'}
    </button>
  );
};

export default LanguageSwitcher;
