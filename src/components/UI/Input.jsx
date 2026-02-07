import React from 'react';
import { createInputStyle } from '../../theme';

/**
 * Reusable Input Component
 * Custom styled input with focus effects and placeholder styling
 */
const Input = ({ 
  placeholder = '', 
  value, 
  onChange, 
  type = 'text',
  className = '',
  style = {},
  ...props 
}) => {
  const inputStyle = createInputStyle();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        ...inputStyle,
        ...style
      }}
      className={`custom-input ${className}`}
      {...props}
    />
  );
};

export default Input;