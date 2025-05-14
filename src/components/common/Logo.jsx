import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Animated logo component
const Logo = ({ 
  size = 'md', // 'sm', 'md', 'lg'
  showText = true,
  className = '' 
}) => {
  const { t } = useTranslation();
  
  // Size classes
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };
  
  // Text size classes
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-4 ${className}`}
    >
      {/* Logo image */}
      <img 
        src="/logo.svg" 
        alt={t('common.appName')} 
        className={sizeClasses[size] || sizeClasses.md}
      />
      
      {/* Company name */}
      {showText && (
        <h1 className={`font-bold text-blue-600 ml-2 ${textSizeClasses[size] || textSizeClasses.md}`}>
          {t('common.appName')}
        </h1>
      )}
    </motion.div>
  );
};

export default Logo;
