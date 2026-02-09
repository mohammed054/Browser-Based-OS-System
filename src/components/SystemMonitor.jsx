import React, { useState, useEffect, useCallback } from 'react';

/**
 * System Performance Monitor
 * Provides realistic fake system stats that respond to user actions
 * 
 * Features:
  * Dynamic CPU usage based on user interactions
 * Memory usage simulation
 * Process monitoring
 * Uptime tracking
 * System event logging
 */
const SystemMonitor = () => {
  const [cpuUsage, setCpuUsage] = useState(15);
  const [memoryUsage, setMemoryUsage] = useState(35);
  const [uptime, setUptime] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [temperature, setTemperature] = useState(42);
  const [networkSpeed, setNetworkSpeed] = useState(0);
  
  // Start uptime from when component mounts
  const startTime = Date.now();

  // Generate realistic process list
  const generateProcesses = useCallback(() => {
    const baseProcesses = [
      { name: 'System', cpu: 2, memory: 8, pid: 1 },
      { name: 'PortfolioOS.exe', cpu: 8, memory: 25, pid: 123 },
      { name: 'React Renderer', cpu: 12, memory: 18, pid: 456 },
      { name: 'Window Manager', cpu: 3, memory: 6, pid: 789 },
      { name: 'Input Handler', cpu: 1, memory: 3, pid: 1011 },
      { name: 'Animation Engine', cpu: 5, memory: 7, pid: 1213 }
    ];

    // Add random temporary processes
    const tempProcesses = [
      { name: 'Mouse Tracker.exe', cpu: Math.floor(Math.random() * 3), memory: Math.floor(Math.random() * 3), pid: 9999 },
      { name: 'Keyboard Hook.dll', cpu: Math.floor(Math.random() * 2), memory: 1, pid: 8888 }
    ];

    return [...baseProcesses, ...tempProcesses.filter(() => Math.random() > 0.5)];
  }, []);

  // Update CPU usage based on user activity
  useEffect(() => {
    const updateStats = () => {
      // Simulate realistic CPU usage with natural variations
      const baseUsage = 15;
      const randomVariation = Math.random() * 10 - 5;
      const activityBoost = Math.random() > 0.7 ? Math.random() * 15 : 0;
      
      setCpuUsage(Math.max(5, Math.min(80, baseUsage + randomVariation + activityBoost)));

      // Memory usage slowly increases over time (simulating memory leaks)
      const memoryIncrease = uptime / 100; // Very slow increase
      setMemoryUsage(Math.min(85, 35 + memoryIncrease + (Math.random() * 5 - 2.5)));

      // Update uptime (seconds)
      setUptime(Math.floor((Date.now() - startTime) / 1000));

      // Update temperature based on CPU usage
      setTemperature(40 + cpuUsage * 0.3 + (Math.random() * 2 - 1));

      // Update processes list occasionally
      if (Math.random() > 0.8) {
        setProcesses(generateProcesses());
      }

      // Network speed simulation
      setNetworkSpeed(Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0);
    };

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [cpuUsage, uptime, generateProcesses]);

  // Format uptime
  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Get CPU color based on usage
  const getCpuColor = (usage) => {
    if (usage < 30) return '#00ff00';
    if (usage < 60) return '#ffaa00';
    return '#ff3333';
  };

  // Get memory color based on usage
  const getMemoryColor = (usage) => {
    if (usage < 50) return '#00ff00';
    if (usage < 75) return '#ffaa00';
    return '#ff3333';
  };

  // Get temperature color
  const getTempColor = (temp) => {
    if (temp < 50) return '#00ff00';
    if (temp < 70) return '#ffaa00';
    return '#ff3333';
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0a0a',
      color: '#00ff00',
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid #00ff00',
        paddingBottom: '8px',
        marginBottom: '5px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}>
          📊 SYSTEM MONITOR v2.0
        </div>
        <div style={{ fontSize: '8px', color: '#00cc00' }}>
          Real-time Performance Analysis
        </div>
      </div>

      {/* Performance Stats */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* CPU */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <div style={{ fontSize: '10px', marginBottom: '5px', color: '#00ff00' }}>
            🖥️ CPU
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: getCpuColor(cpuUsage) }}>
            {cpuUsage}%
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#333',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '3px'
          }}>
            <div style={{
              width: `${cpuUsage}%`,
              height: '100%',
              background: getCpuColor(cpuUsage),
              transition: 'all 0.3s ease',
              boxShadow: `0 0 5px ${getCpuColor(cpuUsage)}50`
            }} />
          </div>
        </div>

        {/* Memory */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <div style={{ fontSize: '10px', marginBottom: '5px', color: '#00ff00' }}>
            💾 MEMORY
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: getMemoryColor(memoryUsage) }}>
            {memoryUsage}%
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#333',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '3px'
          }}>
            <div style={{
              width: `${memoryUsage}%`,
              height: '100%',
              background: getMemoryColor(memoryUsage),
              transition: 'all 0.3s ease',
              boxShadow: `0 0 5px ${getMemoryColor(memoryUsage)}50`
            }} />
          </div>
        </div>

        {/* Temperature */}
        <div style={{ flex: '1', minWidth: '100px' }}>
          <div style={{ fontSize: '10px', marginBottom: '5px', color: '#00ff00' }}>
            🌡️ TEMP
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: getTempColor(temperature) }}>
            {temperature.toFixed(1)}°C
          </div>
        </div>

        {/* Network */}
        <div style={{ flex: '1', minWidth: '100px' }}>
          <div style={{ fontSize: '10px', marginBottom: '5px', color: '#00ff00' }}>
            🌐 NETWORK
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#00ff00' }}>
            {networkSpeed} KB/s
          </div>
        </div>
      </div>

      {/* System Info */}
      <div style={{ display: 'flex', gap: '30px', fontSize: '10px' }}>
        <div>
          <span style={{ color: '#00ff00' }}>⏱️ Uptime:</span> {formatUptime(uptime)}
        </div>
        <div>
          <span style={{ color: '#00ff00' }}>🔌 Processes:</span> {processes.length}
        </div>
        <div>
          <span style={{ color: '#00ff00' }}>🎯 Status:</span> 
          <span style={{ color: cpuUsage > 70 ? '#ff3333' : '#00ff00' }}>
            {cpuUsage > 70 ? ' HIGH LOAD' : ' NORMAL'}
          </span>
        </div>
      </div>

      {/* Process List */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: '10px', marginBottom: '5px', color: '#00ff00' }}>
          📋 ACTIVE PROCESSES
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2px',
          fontSize: '9px',
          overflow: 'auto',
          maxHeight: '150px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr', 
            borderBottom: '1px solid #00ff00',
            paddingBottom: '2px',
            fontWeight: 'bold',
            color: '#00ff00'
          }}>
            <div>PROCESS</div>
            <div>CPU %</div>
            <div>MEM %</div>
            <div>PID</div>
          </div>
          
          {processes.map((process, index) => (
            <div 
              key={process.pid}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '1px 0',
                opacity: 0.9,
                borderBottom: '1px solid #333'
              }}
            >
              <div>{process.name}</div>
              <div style={{ color: process.cpu > 10 ? '#ffaa00' : '#00ff00' }}>
                {process.cpu}
              </div>
              <div style={{ color: process.memory > 20 ? '#ffaa00' : '#00ff00' }}>
                {process.memory}
              </div>
              <div>{process.pid}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Events */}
      <div style={{ 
        borderTop: '1px solid #00ff00',
        paddingTop: '8px',
        fontSize: '8px',
        color: '#00cc00'
      }}>
        <div style={{ marginBottom: '3px', fontWeight: 'bold' }}>📝 SYSTEM LOG:</div>
        <div>• PortfolioOS initialized successfully</div>
        <div>• Custom cursor system active</div>
        <div>• Keyboard shortcuts loaded: 6</div>
        <div>• Easter egg monitoring: ENABLED</div>
      </div>

      {/* Custom scrollbar */}
      <style>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default SystemMonitor;