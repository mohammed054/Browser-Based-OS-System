import React, { useState, useEffect } from 'react';

const LockScreen = ({ isVisible, onUnlock, currentTime, currentDate }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setPassword('');
      setError('');
      setShowLogin(false);
    }
  }, [isVisible]);

  const handleClick = () => {
    setShowLogin(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Fake authentication - accept 'portfolio' as password
    if (password === 'portfolio') {
      onUnlock(password);
    } else {
      setError('Incorrect password. Hint: "portfolio"');
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
              <div className="login-title">Welcome Back</div>
              <div className="login-subtitle">Mohammed Hassoun</div>
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
                  autoFocus
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
                disabled={!password}
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

      <style jsx>{`
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