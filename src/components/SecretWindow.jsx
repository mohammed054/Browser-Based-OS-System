import React from 'react';

/**
 * Secret Window Component
 * Easter egg window that appears after 5x double-click on desktop
 */
const SecretWindow = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="secret-window-overlay" onClick={onClose}>
      <div 
        className="secret-window" 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          maxHeight: '500px',
          background: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid var(--os-cyan, #38bdf8)',
          borderRadius: '16px',
          padding: '30px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 0 50px var(--os-cyan-glow, rgba(56, 189, 248, 0.5))',
          animation: 'secret-appear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          overflowY: 'auto',
          color: 'white',
          fontFamily: 'var(--font-mono, monospace)',
          zIndex: 999999
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '1px solid var(--os-cyan, #38bdf8)'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              color: 'var(--os-cyan, #38bdf8)',
              textShadow: '0 0 10px var(--os-cyan-glow, rgba(56, 189, 248, 0.5))'
            }}>
              🎉 SECRET UNLOCKED!
            </h2>
            <p style={{
              margin: '5px 0 0 0',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              You found the desktop Easter egg! Here's your reward:
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid var(--os-cyan, #38bdf8)',
              background: 'transparent',
              color: 'var(--os-cyan, #38bdf8)',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--os-cyan, #38bdf8)';
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--os-cyan, #38bdf8)';
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ lineHeight: '1.6' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: 'var(--os-cyan, #38bdf8)',
              fontSize: '18px'
            }}>
              🔐 Developer Secrets Revealed
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '14px'
            }}>
              <li>💡 This portfolio contains <strong>15+ hidden features</strong></li>
              <li>⌨️ <strong>6 global keyboard shortcuts</strong> are waiting to be discovered</li>
              <li>🥚 <strong>5 terminal Easter eggs</strong> beyond what you've found</li>
              <li>🎮 Try the <strong>Konami Code</strong> anywhere in the OS!</li>
              <li>🌟 Custom cursor with <strong>6 different states</strong></li>
              <li>📊 Fake system stats track your <strong>real interactions</strong></li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <h3 style={{
              margin: '0 0 15px 0',
              color: 'var(--os-cyan, #38bdf8)',
              fontSize: '18px'
            }}>
              🚀 Pro Tips for Recruiters
            </h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              <strong>Keyboard Shortcuts:</strong> Ctrl+Space, Alt+Tab, Ctrl+W, Ctrl+`, Alt+F4, Esc
            </p>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              <strong>Terminal Commands:</strong> sudo rm -rf /, hack nasa, matrix, konami, exit
            </p>
            <p style={{ margin: '0', fontSize: '14px' }}>
              <strong>Desktop Actions:</strong> Double-click background 5x, drag the rocket icon
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(45deg, rgba(56, 189, 248, 0.1), rgba(168, 85, 247, 0.1))',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <h3 style={{
              margin: '0 0 10px 0',
              color: 'var(--os-cyan, #38bdf8)',
              fontSize: '18px'
            }}>
              🏆 You're Awesome!
            </h3>
            <p style={{ margin: '0', fontSize: '14px', fontStyle: 'italic' }}>
              "Curiosity is the engine of achievement." - You (just now, by finding this)
            </p>
            <p style={{ margin: '15px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
              This secret window proves you have the attention to detail and curiosity 
              that makes an excellent developer. 👨‍💻
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes secret-appear {
    0% {
      transform: translate(-50%, -50%) scale(0.1) rotate(180deg);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1) rotate(10deg);
    }
    100% {
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  .secret-window-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 999998;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .secret-window::-webkit-scrollbar {
    width: 6px;
  }

  .secret-window::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .secret-window::-webkit-scrollbar-thumb {
    background: var(--os-cyan, #38bdf8);
    border-radius: 3px;
  }

  .secret-window::-webkit-scrollbar-thumb:hover {
    background: var(--os-cyan-hover, rgba(56, 189, 248, 0.2));
    box-shadow: 0 0 10px var(--os-cyan-glow, rgba(56, 189, 248, 0.3));
  }
`;
document.head.appendChild(style);

export default SecretWindow;
