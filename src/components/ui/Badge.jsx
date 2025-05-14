import React from "react";
import PropTypes from "prop-types";

/**
 * Badge component for displaying status indicators, counts, or labels
 *
 * @param {Object} props - Component props
 * @param {string} props.color - Color variant (primary, success, info, warning, danger, secondary)
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Badge content
 * @param {boolean} props.pill - Whether to display as a pill with more rounded corners
 * @param {string} props.size - Size variant (sm, md, lg)
 * @param {boolean} props.outline - Whether to display as an outline badge
 * @param {boolean} props.animated - Whether to apply a pulse animation
 * @returns {React.ReactElement} Badge component
 */
const Badge = ({
  color = "primary",
  className = "",
  children,
  pill = false,
  size = "md",
  outline = false,
  animated = false,
  ...props
}) => {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium";

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  // Pill shape class
  const pillClass = pill ? "rounded-full" : "rounded";

  // Animation class
  const animationClass = animated ? "animate-pulse" : "";

  // Color classes
  const colorClasses = {
    primary: outline
      ? "border border-primary-500 text-primary-700 bg-transparent"
      : "bg-primary-100 text-primary-800",
    secondary: outline
      ? "border border-secondary-400 text-secondary-700 bg-transparent"
      : "bg-secondary-100 text-secondary-800",
    success: outline
      ? "border border-success-500 text-success-700 bg-transparent"
      : "bg-success-100 text-success-800",
    danger: outline
      ? "border border-danger-500 text-danger-700 bg-transparent"
      : "bg-danger-100 text-danger-800",
    warning: outline
      ? "border border-warning-500 text-warning-700 bg-transparent"
      : "bg-warning-100 text-warning-800",
    info: outline
      ? "border border-info-500 text-info-700 bg-transparent"
      : "bg-info-100 text-info-800",
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${pillClass} ${colorClasses[color]} ${animationClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Prop type validation
Badge.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
  ]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  pill: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  outline: PropTypes.bool,
  animated: PropTypes.bool,
};

export default Badge;
