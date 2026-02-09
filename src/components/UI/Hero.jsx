import React from 'react';
import { theme } from '../../theme';
// import Button from './Button';
// import Rocket from './Rocket';

/**
 * Hero Component
 * Modern hero section with animated rocket and call-to-action
 */
const Hero = ({ onStart }) => {
  console.log('Hero component rendering, onStart:', typeof onStart)
  
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(168, 85, 247, 0.05))
      `
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 1px,
            rgba(56, 189, 248, 0.05) 1px,
            rgba(56, 189, 248, 0.05) 2px
          )
        `,
        animation: 'gridMove 20s linear infinite'
      }}></div>

      {/* Floating Rockets - Temporarily disabled for testing */}
      {/* <Rocket size={48} style={{ top: '10%', left: '20%' }} />
      <Rocket size={32} style={{ top: '70%', right: '15%' }} />
      <Rocket size={64} style={{ bottom: '20%', left: '80%' }} /> */}

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: theme.zIndex.window,
        textAlign: 'center',
        maxWidth: '800px',
        padding: theme.spacing['6xl']
      }}>
        <div style={{
          marginBottom: theme.spacing['5xl'],
          animation: 'floatIn 1s ease-out'
        }}>
          <h1 style={{
            fontSize: theme.typography.sizes['4xl'],
            fontWeight: theme.typography.weights.bold,
            fontFamily: theme.typography.heading,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.md,
            textShadow: '0 4px 20px rgba(56, 189, 248, 0.3)'
          }}>
            Browser-Based OS System
          </h1>
          <p style={{
            fontSize: theme.typography.sizes.lg,
            color: theme.colors.textSecondary,
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Experience a fully functional operating system running directly in your browser. 
            Complete with desktop interface, window management, and interactive applications.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: theme.spacing.md,
          justifyContent: 'center',
          animation: 'fadeInUp 1s ease-out 0.2s both'
        }}>
          {/* Temporarily simplified buttons for testing */}
          <button
            onClick={onStart}
            style={{
              fontSize: theme.typography.sizes.lg,
              padding: `${theme.spacing.lg} ${theme.spacing['4xl']}`,
              borderRadius: theme.dimensions.buttonBorderRadius,
              backgroundColor: theme.colors.accentPrimary,
              color: theme.colors.textInverted,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Launch OS
          </button>
          <button
            onClick={() => window.open('https://github.com/mohammed054/Browser-Based-OS-System', '_blank')}
            style={{
              fontSize: theme.typography.sizes.lg,
              padding: `${theme.spacing.lg} ${theme.spacing['4xl']}`,
              borderRadius: theme.dimensions.buttonBorderRadius,
              backgroundColor: theme.colors.panel,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.accentPrimary}`,
              cursor: 'pointer'
            }}
          >
            View Source
          </button>
        </div>

        <div style={{
          marginTop: theme.spacing['5xl'],
          display: 'flex',
          gap: theme.spacing.lg,
          justifyContent: 'center',
          opacity: 0.7
        }}>
          <span style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm }}>
            React 19 • Vite • CSS-in-JS
          </span>
          <span style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm }}>
            •
          </span>
          <span style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm }}>
            Cross-platform • Responsive
          </span>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes floatIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes gridMove {
            0% {
              transform: translateY(0) translateX(0);
            }
            100% {
              transform: translateY(20px) translateX(20px);
            }
          }

          .rocketLaunch {
            animation: rocketLaunch 3s ease-in-out infinite;
          }

          .rocketGlow {
            animation: rocketGlow 1s ease-in-out infinite alternate;
          }

          .flameFlicker {
            animation: flameFlicker 0.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Hero;