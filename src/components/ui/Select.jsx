import React from "react";
import PropTypes from "prop-types";

/**
 * Select component for dropdown selections
 * @param {Object} props - Component props
 * @returns {JSX.Element} Select component
 */
const Select = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  name,
  required,
  className,
  disabled,
  ...rest
}) => {
  // Generate a unique ID for accessibility
  const id = `select-${name}-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-secondary-700 mb-1"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 transition-all duration-300 ${
            error
              ? "border-danger-300 focus:ring-danger-500 text-danger-900"
              : "border-secondary-300 focus:ring-primary-500 text-secondary-900"
          } ${disabled ? "bg-secondary-100 cursor-not-allowed" : ""}`}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary-700">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger-500">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
};

Select.propTypes = {
  /** Label for the select element */
  label: PropTypes.string,

  /** Placeholder text (first disabled option) */
  placeholder: PropTypes.string,

  /** Array of options for the select dropdown */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,

  /** Current value of the select */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Change handler function */
  onChange: PropTypes.func.isRequired,

  /** Error message or object from form validation */
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

  /** Name attribute for the input */
  name: PropTypes.string,

  /** Whether the field is required */
  required: PropTypes.bool,

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Whether the select is disabled */
  disabled: PropTypes.bool,
};

Select.defaultProps = {
  label: null,
  placeholder: null,
  value: "",
  error: null,
  name: "",
  required: false,
  className: "",
  disabled: false,
};

export default Select;
