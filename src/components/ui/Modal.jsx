import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Modal component for dialogs
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  footer = null,
  closeOnClickOutside = true,
}) => {
  const { t } = useTranslation();

  const handleOverlayClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`${sizeClasses[size]} w-full bg-white rounded-lg shadow-xl overflow-hidden`}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
          <button
            type="button"
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Modal footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-secondary-200 bg-secondary-50">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Modal;
