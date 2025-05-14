import { motion } from 'framer-motion';

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
        <h2 className="text-2xl font-bold text-center text-secondary-900 mb-2">
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className="text-secondary-600 text-center mb-6">
          {subtitle}
        </p>
      )}
      
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </motion.div>
  );
};

export default FormContainer;
