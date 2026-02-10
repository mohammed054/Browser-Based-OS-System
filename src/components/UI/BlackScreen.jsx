import React, { useEffect } from 'react';
import './BlackScreen.css';

const BlackScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return <div className="black-screen" />;
};

export default BlackScreen;