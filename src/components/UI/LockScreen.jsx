import React, { useState } from 'react';
import { PROFILE } from '../../config/profile';

const LockScreen = ({ isVisible, onUnlock, currentTime, currentDate, autoLogin = false, loginState = 'idle' }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleClick = () => {
    if (!showLogin) {
      setPassword('');
      setError('');
    }
    setShowLogin(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'guest' || password === 'portfolio') {
      onUnlock(password);
      setShowLogin(false);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password. Hint: "guest" or "portfolio"');
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  

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
              <div className="login-avatar">{PROFILE.initials}</div>
              <div className="login-title">Welcome Back</div>
              <div className="login-subtitle">{PROFILE.name}</div>
            </div>

            <form onSubmit={handleSubmit}>
              
              <div className="login-input-group">
                <input
                  type="password"
                  className={`login-input ${error ? 'error' : ''}`}
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  autoFocus={!autoLogin || loginState !== 'authenticating'}
                  
                />
                
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
                Unlock
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
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.background = 'none';
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

