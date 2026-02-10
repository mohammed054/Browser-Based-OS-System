import React, { useState, useEffect } from 'react';
import './BootScreen.css';

const BootScreen = ({ onBootComplete }) => {
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const bootLogs = [
    '[ OK ] Window Manager',
    '[ OK ] Desktop Service', 
    '[ OK ] UI Kernel',
    '[ OK ] Authentication Module',
    '[ OK ] Cursor System',
    'System initialization complete...'
  ];

  useEffect(() => {
    const logInterval = setInterval(() => {
      if (currentStep < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentStep]]);
        setCurrentStep(prev => prev + 1);
      }
    }, 300);

    const bootTimeout = setTimeout(() => {
      clearInterval(logInterval);
      onBootComplete();
    }, 2000);

    return () => {
      clearInterval(logInterval);
      clearTimeout(bootTimeout);
    };
  }, [currentStep, onBootComplete]);

  return (
    <div className="boot-screen">
        <div className="boot-content">
        <div className="os-info">
          <h1 className="os-title">MohammedOS v4.0</h1>
          <div className="boot-status">
            <span>Initializing system</span>
            <div className="loading-circle"></div>
          </div>
        </div>
        
        <div className="boot-logs">
          {logs.map((log, index) => (
            <div key={index} className="boot-log">
              {log}
            </div>
          ))}
        </div>
      </div>
      
      <div className="noise-overlay"></div>
    </div>
  );
};

export default BootScreen;