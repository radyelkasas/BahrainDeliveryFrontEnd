import { motion } from 'framer-motion';

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
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-200 hover:bg-secondary-300 text-secondary-800',
    success: 'bg-success-600 hover:bg-success-700 text-white',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50'
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

export default Button;
