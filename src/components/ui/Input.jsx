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
          <div className="absolute top-0 bottom-0 flex items-center justify-center w-10 text-secondary-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          dir={dir}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300
            ${icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-danger-500 focus:ring-danger-500' : 'border-secondary-300'}
            ${disabled ? 'bg-secondary-100 cursor-not-allowed' : 'bg-white'}
            ${className}`}
          {...inputProps}
          {...rest}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-danger-500"
        >
          {t(error.message || error)}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
