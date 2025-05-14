// Social login button
const SocialButton = ({
  children,
  onClick,
  variant = 'facebook',
  className = '',
  ...rest
}) => {
  const variantClasses = {
    facebook: 'bg-[#3b5998] hover:bg-[#324b80] text-white',
    google: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
    apple: 'bg-black hover:bg-gray-900 text-white',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center w-full py-2 rounded-lg transition-colors duration-300 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default SocialButton;
