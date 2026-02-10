import React, { useState, useEffect } from 'react';
import OSPopup from './OSPopup';
import './LoginScreen.css';

const LoginScreen = ({ onLogin, currentTime, currentDate }) => {
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    // Play login screen appearance sound
    if (typeof window !== 'undefined' && window.soundManager) {
      setTimeout(() => {
        window.soundManager.play('notification');
      }, 300);
    }
  }, []);

  const handleClick = () => {
    setShowForm(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    // Simulate realistic authentication delay (800-1200ms)
    const authDelay = 800 + Math.random() * 400; // Random between 800-1200ms
    await new Promise(resolve => setTimeout(resolve, authDelay));
    
    if (password === 'mohammed' || password === 'portfolio' || password === 'admin') {
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
      
      setError('Incorrect password');
      setShowErrorPopup(true);
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  if (!showForm) {
    return (
      <div className="login-screen" onClick={handleClick}>
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
        
        <div className="system-info">
          BrowserOS Portfolio v1.0
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="login-form" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <div className="login-avatar">MH</div>
          <div className="login-title">mohammed</div>
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
                style={{ 
                  zIndex: 99998, /* Highest priority - above everything */
                  position: 'relative',
                  pointerEvents: 'auto' /* Explicitly enable interactions */
                }}
              />
              {error && (
                <div className="login-error">
                  {error}
                  <div className="login-error-tip">💡 Password is case-sensitive</div>
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
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
      
      <div className="system-info">
        BrowserOS Portfolio v1.0
      </div>
      
      {/* OS-Style Error Popup */}
      <OSPopup
        isVisible={showErrorPopup}
        title="Authentication Error"
        message="Incorrect password. Please try again."
        onClose={() => {
          setShowErrorPopup(false);
          setPassword(''); // Clear password input
          setTimeout(() => setError(''), 100);
        }}
        type="error"
      />
    </div>
  );
};

export default LoginScreen;