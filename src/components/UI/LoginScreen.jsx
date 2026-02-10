import React, { useState } from 'react';
import './LoginScreen.css';

const LoginScreen = ({ onLogin, currentTime, currentDate }) => {
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === 'mohammed' || password === 'portfolio' || password === 'admin') {
      if (onLogin) {
        onLogin();
      }
    } else {
      setError('Hint: Try your name, "portfolio", or "admin"');
      setTimeout(() => setError(''), 4000);
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
    <div className="login-screen" onClick={(e) => e.stopPropagation()}>
      <div className="login-form">
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
    </div>
  );
};

export default LoginScreen;