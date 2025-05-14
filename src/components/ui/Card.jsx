// Card component for UI elements
const Card = ({
  children,
  title,
  className = '',
  ...rest
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`} {...rest}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
