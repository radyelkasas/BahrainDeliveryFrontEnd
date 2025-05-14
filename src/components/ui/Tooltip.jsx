import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

/**
 * Tooltip component for displaying information on hover
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Element that triggers the tooltip
 * @param {string} props.content - Content to display in the tooltip
 * @param {string} props.position - Position of the tooltip: 'top', 'right', 'bottom', or 'left'
 * @param {string} props.className - Additional CSS classes for the tooltip
 * @returns {JSX.Element} Tooltip component
 */
const Tooltip = ({ children, content, position = "top", className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top, left;

    switch (position) {
      case "top":
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left =
          triggerRect.left +
          scrollX +
          triggerRect.width / 2 -
          tooltipRect.width / 2;
        break;
      case "right":
        top =
          triggerRect.top +
          scrollY +
          triggerRect.height / 2 -
          tooltipRect.height / 2;
        left = triggerRect.right + scrollX + 8;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + 8;
        left =
          triggerRect.left +
          scrollX +
          triggerRect.width / 2 -
          tooltipRect.width / 2;
        break;
      case "left":
        top =
          triggerRect.top +
          scrollY +
          triggerRect.height / 2 -
          tooltipRect.height / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        break;
      default:
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left =
          triggerRect.left +
          scrollX +
          triggerRect.width / 2 -
          tooltipRect.width / 2;
    }

    // Keep tooltip within viewport
    if (left < 0) left = 0;
    if (left + tooltipRect.width > window.innerWidth)
      left = window.innerWidth - tooltipRect.width;
    if (top < 0) top = 0;
    if (top + tooltipRect.height > window.innerHeight + scrollY)
      top = triggerRect.bottom + scrollY + 8;

    setTooltipStyle({
      top: `${top}px`,
      left: `${left}px`,
    });
  };

  // Show tooltip
  const showTooltip = () => {
    setIsVisible(true);
    // Use setTimeout to ensure tooltip is rendered before calculating position
    setTimeout(() => {
      calculatePosition();
    }, 0);
  };

  // Hide tooltip
  const hideTooltip = () => {
    setIsVisible(false);
  };

  // Add window resize listener
  useEffect(() => {
    if (isVisible) {
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition);
    }

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition);
    };
  }, [isVisible]);

  // Tooltip arrow class based on position
  const arrowClass = {
    top: "bottom-[-4px] left-1/2 transform -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-secondary-900",
    right:
      "left-[-4px] top-1/2 transform -translate-y-1/2 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-secondary-900",
    bottom:
      "top-[-4px] left-1/2 transform -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-secondary-900",
    left: "right-[-4px] top-1/2 transform -translate-y-1/2 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-secondary-900",
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible &&
        content &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`fixed z-50 bg-secondary-900 text-white text-xs py-1 px-2 rounded shadow-md max-w-xs ${className}`}
            style={tooltipStyle}
            role="tooltip"
          >
            {content}
            <div className={`absolute w-0 h-0 ${arrowClass[position]}`}></div>
          </div>,
          document.body
        )}
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  className: PropTypes.string,
};

export default Tooltip;
