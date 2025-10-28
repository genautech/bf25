import React from 'react';

// FIX: Add a `size` prop to allow for different button paddings.
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  isLoading = false,
  // FIX: Add `size` prop with 'md' as the default value.
  size = 'md',
  ...props
}) => {
  // FIX: Removed hardcoded padding 'px-4 py-2' to be handled by the new `size` prop.
  const baseClasses = 'rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-brand-primary text-gray-900 hover:bg-brand-secondary focus:ring-brand-primary',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-500',
  };

  // FIX: Add size classes to control padding based on the `size` prop.
  const sizeClasses = {
    sm: 'p-2',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  return (
    <button
      // FIX: Apply the appropriate size class along with other classes.
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};

export default Button;
