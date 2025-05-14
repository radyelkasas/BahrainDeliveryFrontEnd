import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "react-feather";

/**
 * Dropdown component for selection lists
 *
 * @param {Object} props - Component props
 * @param {Array} props.options - Array of option objects with value and label
 * @param {any} props.value - Currently selected value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.placeholder - Placeholder text when no option is selected
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the dropdown is disabled
 * @returns {JSX.Element} Dropdown component
 */
const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find the selected option label
  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary-50"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          role="listbox"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-50  ${
                value === option.value
                  ? "bg-primary-100 text-primary-900"
                  : "text-secondary-900"
              }`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={value === option.value}
            >
              <span
                className={`block truncate ${
                  value === option.value ? "font-medium" : "font-normal"
                }`}
              >
                {option.label}
              </span>
              {value === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Dropdown;
