import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Input component with error display
const Input = ({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  register,
  disabled = false,
  className = '',
  dir = 'auto',
  icon,
  ...rest
}) => {
  const { t } = useTranslation();
  
  // If using react-hook-form
  const inputProps = register
    ? register(name)
    : {
        id,
        name,
        value,
        onChange,
        onBlur
      };

  return (
    <div className="mb-4 relative">
      <div className="relative">
        {icon && (
          <div className="absolute top-0 bottom-0 flex items-center justify-center w-10 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          dir={dir}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
            ${icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${className}`}
          {...inputProps}
          {...rest}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {t(error.message || error)}
        </motion.p>
      )}
    </div>
  );
};

// Button component with loading state
const Button = ({
  children,
  type = 'button',
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  icon,
  ...rest
}) => {
  const baseClass = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClass}
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.primary}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && !loading && <span className="mr-2">{icon}</span>}
      
      {children}
    </button>
  );
};

// Form container component with animation
const FormContainer = ({ 
  children, 
  title, 
  subtitle,
  onSubmit,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`max-w-md w-full mx-auto p-6 bg-white rounded-xl shadow-md ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className="text-gray-600 text-center mb-6">
          {subtitle}
        </p>
      )}
      
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </motion.div>
  );
};

// Alert component for displaying messages
const Alert = ({ 
  children, 
  type = 'info', 
  dismissible = false,
  onDismiss,
  className = '' 
}) => {
  const typeClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 mb-4 border rounded-lg ${typeClasses[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{children}</div>
        
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Card component
const Card = ({
  children,
  title,
  className = '',
  ...rest
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`} {...rest}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

// Divider with text
const DividerWithText = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center my-4 ${className}`}>
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-3 text-gray-500 text-sm">{children}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

// Social login button
const SocialButton = ({
  children,
  onClick,
  variant = 'facebook',
  className = '',
  ...rest
}) => {
  const variantClasses = {
    facebook: 'bg-[#3b5998] hover:bg-[#324b80] text-white',
    google: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
    apple: 'bg-black hover:bg-gray-900 text-white',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center w-full py-2 rounded-lg transition-colors duration-300 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

// Language switcher
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

export {
  Input,
  Button,
  FormContainer,
  Alert,
  Card,
  DividerWithText,
  SocialButton,
  LanguageSwitcher
};
