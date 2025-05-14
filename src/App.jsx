import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "./utils/i18n";

const App = () => {
  const { i18n } = useTranslation();

  // Set the document direction based on the current language
  useEffect(() => {
    const currentLang = getCurrentLanguage();
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  return null; // This component doesn't render anything, it just handles language setup
};

export default App;
