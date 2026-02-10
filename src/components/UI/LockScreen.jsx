import React, { useState, useEffect } from 'react';

const LockScreen = ({ isVisible, onUnlock, currentTime, currentDate, autoLogin = false, loginState = 'idle' }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setPassword('');
      setError('');
      setShowLogin(false);
      
      // Auto-login mode
      if (autoLogin) {
        setTimeout(() => setShowLogin(true), 500); // Show login form immediately
        if (loginState === 'signing-in' || loginState === 'authenticating') {
          setPassword('guest'); // Pre-fill guest credentials
        }
      }
    }
  }, [isVisible, autoLogin, loginState]);

  const handleClick = () => {
    setShowLogin(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Auto-login mode or guest credentials
    if (autoLogin || password === 'guest') {
      // Show signing in state briefly
      if (autoLogin) {
        setTimeout(() => {
          onUnlock('guest');
        }, 200);
      } else {
        onUnlock(password);
      }
    } else if (password === 'portfolio') { // Fallback for manual login
      onUnlock(password);
    } else {
      setError('Incorrect password. Hint: "guest" or "portfolio"');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  // Auto-submit form in auto-login mode
  useEffect(() => {
    if (autoLogin && showLogin && loginState === 'authenticating') {
      const timer = setTimeout(() => {
        handleSubmit({ preventDefault: () => {} });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoLogin, showLogin, loginState]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowLogin(false);
      setPassword('');
      setError('');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="lock-screen" onClick={handleClick}>
      {!showLogin ? (
        // Lock Screen View
        <div style={{ textAlign: 'center' }}>
          <div className="lock-clock">
            {currentTime || '00:00'}
          </div>
          <div className="lock-date">
            {currentDate || new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="lock-hint">
            Click to unlock
          </div>
        </div>
      ) : (
        // Login Screen View
        <div className="login-screen" onClick={(e) => e.stopPropagation()}>
          <div className="login-form">
            <div className="login-header">
              <div className="login-avatar">MH</div>
              <div className="login-title">{autoLogin ? 'Mohammed Hassoun' : 'Welcome Back'}</div>
              <div className="login-subtitle">{autoLogin ? 'Browser-Based OS Portfolio' : 'Mohammed Hassoun'}</div>
            </div>

            <form onSubmit={handleSubmit}>
              {autoLogin && (
                <div className="login-input-group" style={{ marginBottom: '12px' }}>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Username"
                    value="guest"
                    disabled
                    style={{ marginBottom: '8px' }}
                  />
                </div>
              )}
              <div className="login-input-group">
                <input
                  type="password"
                  className={`login-input ${error ? 'error' : ''}`}
                  placeholder={autoLogin ? "Password" : "Enter password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  autoFocus={!autoLogin || loginState !== 'authenticating'}
                  disabled={autoLogin && loginState === 'authenticating'}
                />
                {autoLogin && loginState === 'signing-in' && (
                  <div style={{
                    color: '#38bdf8',
                    fontSize: '12px',
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    Signing in...
                  </div>
                )}
                {autoLogin && loginState === 'authenticating' && (
                  <div style={{
                    color: '#34d399',
                    fontSize: '12px',
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    Authenticating...
                  </div>
                )}
                {error && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={!password || (autoLogin && loginState === 'authenticating')}
              >
                {autoLogin ? 'Sign In' : 'Unlock'}
              </button>
            </form>

            <div style={{
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.background = 'none';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .shake {
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default LockScreen;