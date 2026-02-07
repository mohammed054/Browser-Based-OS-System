import React, { useState, useEffect } from 'react';
import { theme } from '../../theme';

/**
 * Rocket Component
 * Animated rocket for the hero section with CSS-in-JS styling
 */
const Rocket = ({ size = 64, style = {} }) => {
  const [isFlying, setIsFlying] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Random initial position
    const randomX = Math.random() * (window.innerWidth - size);
    const randomY = Math.random() * (window.innerHeight - size);
    setPosition({ x: randomX, y: randomY });

    // Start flying animation
    const timer = setTimeout(() => setIsFlying(true), 1000);
    return () => clearTimeout(timer);
  }, [size]);

  const rocketStyle = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: size,
    height: size,
    transition: 'all 2s ease-in-out',
    transform: isFlying ? 'translate(100px, -100px) rotate(45deg)' : 'rotate(0deg)',
    animation: isFlying ? 'rocketLaunch 3s ease-in-out infinite' : 'none',
    zIndex: theme.zIndex.window,
    ...style
  };

  const bodyStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: '50% 50% 0 0',
    position: 'relative',
    boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
    animation: isFlying ? 'rocketGlow 1s ease-in-out infinite alternate' : 'none'
  };

  const flameStyle = {
    position: 'absolute',
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '20px solid #EF4444',
    animation: isFlying ? 'flameFlicker 0.5s ease-in-out infinite' : 'none'
  };

  const windowStyle = {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '20px',
    backgroundColor: '#93C5FD',
    borderRadius: '50%',
    boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)'
  };

  return (
    <div style={rocketStyle}>
      <div style={bodyStyle}>
        <div style={windowStyle}></div>
        <div style={flameStyle}></div>
      </div>
      <style>
        {`
          @keyframes rocketLaunch {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(50px, -50px) rotate(22.5deg); }
            100% { transform: translate(100px, -100px) rotate(45deg); }
          }
          
          @keyframes rocketGlow {
            from { box-shadow: 0 0 20px rgba(56, 189, 248, 0.5); }
            to { box-shadow: 0 0 40px rgba(56, 189, 248, 0.8); }
          }
          
          @keyframes flameFlicker {
            from { transform: translateX(-50%) scaleY(1); }
            to { transform: translateX(-50%) scaleY(1.5); }
          }
        `}
      </style>
    </div>
  );
};

export default Rocket;