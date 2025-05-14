import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// UI Components
import { LanguageSwitcher } from '../components/ui';
import { Logo } from '../components/common';

// Background animation
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute w-96 h-96 -top-20 -right-20 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute w-96 h-96 -bottom-20 -left-20 bg-blue-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute w-64 h-64 top-1/3 left-1/3 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
    </div>
  );
};

// Footer component with animation
const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="text-center mt-8 text-gray-500 text-sm"
    >
      &copy; {new Date().getFullYear()} {t('common.appName')}
    </motion.div>
  );
};

// Main auth layout component
const AuthLayout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center p-4 relative">
      {/* Animated background elements */}
      <AnimatedBackground />
      
      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Logo size="lg" />
      </div>
      
      {/* Page content with animation */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;
