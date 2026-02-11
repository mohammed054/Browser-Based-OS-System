import React, { useState, useEffect } from 'react';
import './BootScreen.css';
import { PROFILE } from '../../config/profile';

const BOOT_LOGS = [
  '[ OK ] Window Manager',
  '[ OK ] Desktop Service',
  '[ OK ] UI Kernel',
  '[ OK ] Authentication Module',
  '[ OK ] Cursor System',
  'System initialization complete...'
];

const BootScreen = ({ onBootComplete }) => {
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const logInterval = setInterval(() => {
      if (currentStep < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentStep]]);
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
          <h1 className="os-title">{PROFILE.firstName}OS v4.0</h1>
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
