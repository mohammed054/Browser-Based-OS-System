import React, { useEffect, useState } from 'react';
import './OSPopup.css';

const OSPopup = ({ 
  isVisible, 
  title = 'Error', 
  message, 
  onClose, 
  type = 'error' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-focus on OK button
      const timeout = setTimeout(() => {
        const okButton = document.querySelector('.os-popup-ok-button');
        if (okButton) {
          okButton.focus();
        }
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  return (
    <div className={`os-popup-overlay ${isAnimating ? 'visible' : ''}`}>
      <div className={`os-popup ${type} ${isAnimating ? 'visible' : ''}`}>
        <div className="os-popup-header">
          <div className="os-popup-icon">
            {type === 'error' ? '⚠️' : 'ℹ️'}
          </div>
          <div className="os-popup-title">{title}</div>
        </div>
        
        <div className="os-popup-content">
          <p>{message}</p>
        </div>
        
        <div className="os-popup-footer">
          <button 
            className="os-popup-ok-button"
            onClick={handleClose}
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default OSPopup;