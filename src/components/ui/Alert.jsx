import { motion } from 'framer-motion';

// Alert component for displaying messages
const Alert = ({ 
  children, 
  message,
  type = 'info', 
  dismissible = true,
  onDismiss,
  className = '' 
}) => {
  const typeClasses = {
    info: 'bg-info-50 text-info-800 border-info-200',
    success: 'bg-success-50 text-success-800 border-success-200',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    error: 'bg-danger-50 text-danger-800 border-danger-200'
  };

  // Use message prop if children not provided
  const content = children || message;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 mb-4 border rounded-lg ${typeClasses[type]} ${className}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{content}</div>
        
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-2 text-secondary-400 hover:text-secondary-600 focus:outline-none"
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

export default Alert;