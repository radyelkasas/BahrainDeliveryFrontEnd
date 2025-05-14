import React from "react";
import { motion } from "framer-motion";

/**
 * Spinner component for loading states
 *
 * @param {Object} props Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color class for the spinner
 * @param {string} props.className - Additional classes
 * @param {boolean} props.center - Whether to center the spinner in its container
 * @returns {JSX.Element} Spinner component
 */
const Spinner = ({
  size = "md",
  color = "text-primary-600",
  className = "",
  center = false,
}) => {
  // Size mappings
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  // Wrapper classes for centering
  const wrapperClasses = center ? "flex justify-center items-center" : "";

  return (
    <div className={wrapperClasses}>
      <motion.svg
        className={`animate-spin ${color} ${sizeClasses[size]} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </motion.svg>
    </div>
  );
};

export default Spinner;
