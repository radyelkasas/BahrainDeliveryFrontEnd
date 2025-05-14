// Divider with text
const DividerWithText = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center my-4 ${className}`}>
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-3 text-gray-500 text-sm">{children}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default DividerWithText;
