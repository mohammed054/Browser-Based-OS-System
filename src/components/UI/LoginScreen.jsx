import React, { useState, useEffect, useRef } from 'react';
import OSPopup from './OSPopup';
import './LoginScreen.css';
import { PROFILE } from '../../config/profile';

const LoginScreen = ({ onLogin, currentTime, currentDate }) => {
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  
  const passwordInputRef = useRef(null);

  // Focus management function
  const ensureFocus = () => {
    const passwordInput = passwordInputRef.current;
    if (passwordInput && document.activeElement !== passwordInput) {
      passwordInput.focus();
      passwordInput.select();
    }
  };

  useEffect(() => {
    // Auto-focus password input when form appears and maintain focus
    if (showForm && !isSubmitting) {
      const passwordInput = passwordInputRef.current;
      if (passwordInput && document.activeElement !== passwordInput) {
        passwordInput.focus();
        passwordInput.select();
      }
    }
  }, [showForm, isSubmitting]);

  useEffect(() => {
    // Play login screen appearance sound
    if (typeof window !== 'undefined' && window.soundManager) {
      setTimeout(() => {
        window.soundManager.play('notification');
      }, 300);
    }
  }, []);

  // Enhanced password change handler with auto-refocus
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
    
    // Only re-focus if input is not already focused to prevent text replacement
    const passwordInput = passwordInputRef.current;
    if (passwordInput && document.activeElement !== passwordInput) {
      setTimeout(() => {
        passwordInput.focus();
        passwordInput.select();
      }, 100);
    }
  };

  // Force state update in separate tick to bypass any React batching
  const handleClick = (e) => {
    e.stopPropagation();
    
    // Force state update in separate tick to bypass any React batching
    setTimeout(() => {
      setShowForm(true);
      // Force re-render after state update
    }, 0);
    
    // Ensure focus in next tick
    setTimeout(() => {
      ensureFocus();
    }, 50);
  };

  // Handle Enter key to show form
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!showForm) {
        handleClick(e);
      }
    }
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
    ensureFocus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    // Simulate realistic authentication delay (800-1200ms)
    const authDelay = 800 + Math.random() * 400;
    await new Promise(resolve => setTimeout(resolve, authDelay));
    
    if (password === 'mohammd' || password === 'mohammed' || password === 'portfolio' || password === 'admin' || password === 'guest' || password === 'user' || password === 'demo') {
      // Play success sound
      if (typeof window !== 'undefined' && window.soundManager) {
        window.soundManager.play('windowOpen');
      }
      
      // Brief delay before desktop transition
      setTimeout(() => {
        if (onLogin) {
          onLogin();
        }
      }, 300);
    } else {
      // Play error sound
      if (typeof window !== 'undefined' && window.soundManager) {
        window.soundManager.play('error');
      }
      
      setShowErrorPopup(true);
      setIsSubmitting(false);
      
      // Clear password field after error
      setTimeout(() => {
        setPassword('');
        setTimeout(() => setError(''), 100);
        
        // Re-focus after clearing
        const passwordInput = passwordInputRef.current;
        if (passwordInput) {
          passwordInput.focus();
          passwordInput.select();
        }
      }, 50);
    }
  };

  // Handle Enter key to submit form when form is visible
  const handleFormKeyPress = (e) => {
    if (e.key === 'Enter' && showForm && password && !isSubmitting) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!showForm) {
    return (
      <div className="login-screen" onClick={handleClick} onKeyPress={handleKeyPress} tabIndex={0}>
        {/* Lock screen view */}
        <div className="login-lock">
          <div className="login-clock">{currentTime || '00:00'}</div>
          <div className="login-date">{currentDate || new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
          <div className="login-hint">Click to sign in</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen" onClick={handleClick} onKeyPress={handleKeyPress} tabIndex={0}>
      {/* Lock screen view */}
      <div className="login-lock">
        <div className="login-clock">{currentTime || '00:00'}</div>
        <div className="login-date">{currentDate || new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
          <div className="login-hint">Click to sign in</div>
      </div>
      
      {/* Login form view */}
      {showForm && (
        <div className="login-form" onClick={handleFormClick} onKeyPress={handleFormKeyPress}>
          <div className="login-header">
            <div className="login-avatar">{PROFILE.initials}</div>
            <div className="login-title">{PROFILE.firstName.toLowerCase()}</div>
            <div className="login-subtitle">BrowserOS Portfolio</div>
          </div>
        
          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <input
                type="text"
                className="login-input"
                placeholder="Username"
                value="guest"
                disabled
                style={{ marginBottom: '12px' }}
              />
              <input
                type="password"
                className={`login-input ${error ? 'error' : ''}`}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                autoFocus
                disabled={isSubmitting}
                ref={passwordInputRef}
                style={{ 
                  zIndex: 99998, /* Highest priority */
                  position: 'relative',
                  pointerEvents: 'auto', /* Explicitly enable */
                  border: '2px solid #38bdf8',
                  borderRadius: '4px',
                  padding: '12px',
                  background: '#0b0e14',
                  color: '#eaeaea',
                  fontSize: '16px',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
              {error && (
                <div className="login-error">
                  {error}
                  <div className="login-error-tip">Try: mohammd, mohammed, portfolio, admin, guest, user, or demo</div>
                </div>
              )}
              {isSubmitting && (
                <div className="login-loading">
                  <div className="login-spinner"></div>
                  Authenticating...
                </div>
              )}
            </div>
          
            <button 
              type="submit" 
              className="login-button" 
              disabled={!password || isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                border: '2px solid #38bdf8',
                borderRadius: '4px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: password && !isSubmitting ? 'pointer' : 'not-allowed',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
              }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      )}
      
      {/* OS-Style Error Popup */}
      <OSPopup
        isVisible={showErrorPopup}
        title="Authentication Error"
        message="Incorrect password. Please try again."
        onClose={() => {
          setShowErrorPopup(false);
          setTimeout(() => setError(''), 100);
        }}
        type="error"
      />
    </div>
  );
};

export default LoginScreen;

