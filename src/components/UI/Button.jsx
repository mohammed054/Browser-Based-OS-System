import React from 'react';
import { createButtonStyle } from '../../theme';

/**
 * Reusable Button Component
 * Custom styled button with multiple variants and hover effects
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = '',
  style = {},
  ...props 
}) => {
  const buttonStyle = createButtonStyle(variant);
  
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        ...buttonStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
      className={`custom-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;