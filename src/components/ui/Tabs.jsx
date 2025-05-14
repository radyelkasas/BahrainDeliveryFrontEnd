import React from "react";
import PropTypes from "prop-types";

/**
 * Tabs component for switching between different sections of content
 * @param {Object} props - Component props
 * @returns {JSX.Element} Tabs component
 */
const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={`border-b border-secondary-200 ${className}`}>
      <nav className="-mb-px flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
              }
              transition-all duration-200 focus:outline-none
            `}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

Tabs.propTypes = {
  /** Array of tab objects with id and label */
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,

  /** ID of the currently active tab */
  activeTab: PropTypes.string.isRequired,

  /** Function called when a tab is clicked */
  onChange: PropTypes.func.isRequired,

  /** Additional CSS classes */
  className: PropTypes.string,
};

Tabs.defaultProps = {
  className: "",
};

export default Tabs;
