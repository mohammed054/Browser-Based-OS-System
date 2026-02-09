import React, { useState, useEffect } from 'react';
import { theme } from '../../theme';
import { createButtonStyle } from '../../theme';

/**
 * Hero Window Component
 * Introduction popup that appears when users interact with the desktop
 */
const HeroWindow = ({ isVisible, onClose, openWindow }) => {
  const [animationState, setAnimationState] = useState('');

  useEffect(() => {
    if (isVisible) {
      setAnimationState('opening');
      setTimeout(() => setAnimationState(''), 180);
    }
  }, [isVisible]);

  const handleClose = () => {
    setAnimationState('closing');
    setTimeout(() => {
      onClose();
      setAnimationState('');
    }, 180);
  };

  const handleNavigate = (windowName) => {
    handleClose();
    setTimeout(() => {
      openWindow(windowName);
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div className="hero-window-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: theme.zIndex.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: animationState === 'closing' ? 0 : 1,
      transition: 'opacity 180ms ease-out'
    }}>
      <div 
        className="hero-window"
        style={{
          backgroundColor: theme.colors.windowBg,
          borderRadius: theme.dimensions.windowBorderRadius,
          boxShadow: theme.shadows.window,
          border: `1px solid ${theme.colors.accentPrimary}`,
          width: '500px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transform: animationState === 'opening' ? 'scale(0.96)' : 
                     animationState === 'closing' ? 'scale(0.98)' : 'scale(1)',
          transition: 'transform 180ms ease-out',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        {/* Window Header */}
        <div 
          className="hero-window-header"
          style={{
            backgroundColor: theme.colors.panel,
            borderBottom: `1px solid ${theme.colors.accentPrimary}`,
            padding: theme.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{
            fontFamily: theme.typography.heading,
            fontSize: theme.typography.sizes.xl,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            🚀 Welcome to My Portfolio OS
          </div>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: theme.colors.textPrimary,
              fontSize: theme.typography.sizes.lg,
              cursor: 'pointer',
              padding: theme.spacing.sm,
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              fontFamily: theme.typography.system
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>

        {/* Window Content */}
        <div 
          className="hero-window-content"
          style={{
            padding: theme.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
            flex: 1
          }}
        >
          <div style={{
            textAlign: 'center',
            marginBottom: theme.spacing.lg
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: theme.spacing.lg,
              animation: 'rocket-bob 3s ease-in-out infinite'
            }}>
              🚀
            </div>
            <h2 style={{
              fontFamily: theme.typography.heading,
              fontSize: theme.typography.sizes['3xl'],
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.accentPrimary,
              marginBottom: theme.spacing.md
            }}>
              Hi, I'm Mohammed.
            </h2>
            <p style={{
              fontFamily: theme.typography.system,
              fontSize: theme.typography.sizes.lg,
              color: theme.colors.textSecondary,
              lineHeight: 1.6,
              marginBottom: theme.spacing.lg
            }}>
              Welcome to my interactive portfolio OS! This is a unique desktop environment showcasing my work and projects in an innovative way.
            </p>
            <p style={{
              fontFamily: theme.typography.system,
              fontSize: theme.typography.sizes.base,
              color: theme.colors.textMuted,
              lineHeight: 1.5
            }}>
              Explore the desktop, click on icons to open apps, and interact with the environment just like a real operating system.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: theme.spacing.md,
            marginTop: theme.spacing.lg
          }}>
            <button
              onClick={() => handleNavigate('Settings')}
              style={{
                ...createButtonStyle('primary'),
                padding: theme.spacing.lg,
                flexDirection: 'column',
                gap: theme.spacing.sm,
                minHeight: '100px',
                backgroundColor: theme.colors.accentPrimary,
                border: 'none',
                borderRadius: theme.dimensions.buttonBorderRadius,
                cursor: 'pointer',
                transition: theme.animations.hover,
                fontFamily: theme.typography.system,
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textInverted
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = theme.animations.scaleOut;
                e.currentTarget.style.boxShadow = theme.shadows.buttonHover;
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = theme.animations.scaleNormal;
                e.currentTarget.style.boxShadow = theme.shadows.button;
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              <div style={{ fontSize: theme.typography.sizes['2xl'] }}>👤</div>
              <div style={{ fontWeight: theme.typography.weights.medium }}>About Me</div>
            </button>

            <button
              onClick={() => handleNavigate('Chrome')}
              style={{
                ...createButtonStyle('secondary'),
                padding: theme.spacing.lg,
                flexDirection: 'column',
                gap: theme.spacing.sm,
                minHeight: '100px',
                backgroundColor: theme.colors.accentSecondary,
                border: 'none',
                borderRadius: theme.dimensions.buttonBorderRadius,
                cursor: 'pointer',
                transition: theme.animations.hover,
                fontFamily: theme.typography.system,
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textInverted
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = theme.animations.scaleOut;
                e.currentTarget.style.boxShadow = theme.shadows.buttonHover;
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = theme.animations.scaleNormal;
                e.currentTarget.style.boxShadow = theme.shadows.button;
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              <div style={{ fontSize: theme.typography.sizes['2xl'] }}>💼</div>
              <div style={{ fontWeight: theme.typography.weights.medium }}>Projects</div>
            </button>

            <button
              onClick={() => handleNavigate('Notes')}
              style={{
                ...createButtonStyle('secondary'),
                padding: theme.spacing.lg,
                flexDirection: 'column',
                gap: theme.spacing.sm,
                minHeight: '100px',
                backgroundColor: theme.colors.accentTertiary,
                border: 'none',
                borderRadius: theme.dimensions.buttonBorderRadius,
                cursor: 'pointer',
                transition: theme.animations.hover,
                fontFamily: theme.typography.system,
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textInverted
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = theme.animations.scaleOut;
                e.currentTarget.style.boxShadow = theme.shadows.buttonHover;
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = theme.animations.scaleNormal;
                e.currentTarget.style.boxShadow = theme.shadows.button;
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              <div style={{ fontSize: theme.typography.sizes['2xl'] }}>📧</div>
              <div style={{ fontWeight: theme.typography.weights.medium }}>Contact</div>
            </button>
          </div>

          {/* Tips */}
          <div style={{
            marginTop: theme.spacing.lg,
            padding: theme.spacing.md,
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            borderRadius: theme.dimensions.buttonBorderRadius,
            border: `1px solid ${theme.colors.accentPrimary}30`
          }}>
            <div style={{
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.accentPrimary,
              fontWeight: theme.typography.weights.medium,
              marginBottom: theme.spacing.sm
            }}>
              💡 Quick Tips:
            </div>
            <ul style={{
              margin: 0,
              paddingLeft: theme.spacing.lg,
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.textSecondary,
              lineHeight: 1.4
            }}>
              <li>Double-click desktop icons to open apps</li>
              <li>Right-click for context menus</li>
              <li>Drag and drop to rearrange icons</li>
              <li>Use Ctrl+Click or Shift+Click for multi-select</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CSS Animation for rocket bob */}
      <style>{`
        @keyframes rocket-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default HeroWindow;