import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Loading spinner component
const LoadingSpinner = ({ 
  size = 'md', // 'sm', 'md', 'lg'
  fullScreen = false,
  message = '', 
  className = '' 
}) => {
  const { t } = useTranslation();
  
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  // Container component
  const Container = ({ children }) => {
    if (fullScreen) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
          {children}
        </div>
      );
    }
    
    return <div className={`flex flex-col items-center ${className}`}>{children}</div>;
  };
  
  return (
    <Container>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`border-4 border-blue-100 border-t-blue-600 rounded-full ${sizeClasses[size] || sizeClasses.md}`}
      />
      
      {message && (
        <p className="mt-4 text-gray-600 font-medium">
          {message || t('common.loading')}
        </p>
      )}
    </Container>
  );
};

export default LoadingSpinner;
