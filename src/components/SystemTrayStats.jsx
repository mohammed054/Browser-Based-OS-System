import React, { useState, useEffect } from 'react';

/**
 * System Tray Stats Component
 * Shows minimal performance stats in the system tray
 */
const SystemTrayStats = ({ showStats = false }) => {
  const [cpuUsage, setCpuUsage] = useState(15);
  const [memoryUsage, setMemoryUsage] = useState(35);

  useEffect(() => {
    const updateStats = () => {
      const baseCpu = 15;
      const randomCpuVariation = Math.random() * 10 - 5;
      const activityBoost = Math.random() > 0.7 ? Math.random() * 15 : 0;
      
      setCpuUsage(Math.max(5, Math.min(80, baseCpu + randomCpuVariation + activityBoost)));

      const memoryIncrease = Math.random() * 2 - 1;
      setMemoryUsage(Math.min(85, Math.max(20, 35 + memoryIncrease)));
    };

    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!showStats) return null;

  const getPerformanceColor = (usage) => {
    if (usage < 50) return '#00ff00';
    if (usage < 75) return '#ffaa00';
    return '#ff3333';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '60px',
      right: '12px',
      background: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid var(--os-cyan, #38bdf8)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '10px',
      fontFamily: 'var(--font-mono, monospace)',
      color: 'white',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      gap: '15px',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>CPU:</span>
        <span style={{ color: getPerformanceColor(cpuUsage), fontWeight: 'bold' }}>
          {cpuUsage}%
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>MEM:</span>
        <span style={{ color: getPerformanceColor(memoryUsage), fontWeight: 'bold' }}>
          {memoryUsage}%
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>📊</span>
      </div>
    </div>
  );
};

export default SystemTrayStats;