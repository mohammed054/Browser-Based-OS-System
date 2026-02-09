import React, { useState, useEffect, useRef } from 'react';

const ErrorLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [filterLevel, setFilterLevel] = useState('all');
  
  // Phase 5: Dynamic system stats based on user interactions
  const [systemUptime, setSystemUptime] = useState(0);
  const [userActions, setUserActions] = useState(0);
  const startTimeRef = useRef(Date.now());

  const generateFakeLog = () => {
    const logTypes = [
      { level: 'INFO', message: 'System initialization complete', module: 'KERNEL' },
      { level: 'WARN', message: 'Overthinking detected in decision module', module: 'BRAIN' },
      { level: 'ERROR', message: 'Perfectionism loop detected - auto-breaking', module: 'PSYCHE' },
      { level: 'INFO', message: 'Coffee level optimal', module: 'BIOMETRICS' },
      { level: 'WARN', message: 'Too many tabs open in mental browser', module: 'COGNITION' },
      { level: 'INFO', message: 'Creativity engines running at full capacity', module: 'IMAGINATION' },
      { level: 'ERROR', message: 'Feature creep detected in project scope', module: 'SCOPE_GUARD' },
      { level: 'INFO', message: 'GitHub commits synced successfully', module: 'VERSION_CONTROL' },
      { level: 'WARN', message: 'Stack Overflow addiction threshold reached', module: 'DEVELOPER_HABITS' },
      { level: 'INFO', message: 'UI/UX balance maintained', module: 'DESIGN_SYSTEM' },
      { level: 'ERROR', message: 'Could not resist refactoring legacy code', module: 'PROGRAMMER_INSTINCT' },
      { level: 'INFO', message: 'React hooks functioning normally', module: 'FRONTEND_CORE' },
      { level: 'WARN', message: 'Imposter syndrome monitor requires attention', module: 'CONFIDENCE_SYSTEM' },
      { level: 'INFO', message: 'Code review session completed peacefully', module: 'TEAM_COLLABORATION' },
      { level: 'ERROR', message: 'Syntax error in coffee brewing algorithm', module: 'MORNING_ROUTINE' },
      { level: 'INFO', message: 'Portfolio components loading...', module: 'PORTFOLIO_OS' },
      { level: 'WARN', message: 'Animation timing slightly off by 16ms', module: 'PRECISION_ENGINE' },
      { level: 'INFO', message: 'CSS-in-JS converter functioning', module: 'STYLE_SYSTEM' },
      { level: 'ERROR', message: 'Cannot resist adding one more feature', module: 'FEATURE_ADDICTION' },
      { level: 'INFO', message: 'State management stable', module: 'REDUX_STORE' },
      { level: 'WARN', message: 'Over-engineering alert: simple solution available', module: 'COMPLEXITY_MONITOR' },
      { level: 'INFO', message: 'Terminal emulator ready for commands', module: 'TERMINAL_SYS' },
      { level: 'ERROR', message: 'Failed to resist using latest JavaScript feature', module: 'TECH_LUST' },
      { level: 'INFO', message: 'Window manager coordinates calculated', module: 'UI_LAYOUT' },
      { level: 'WARN', message: 'Debug console flooding with console.log statements', module: 'DEVELOPER_HABITS' },
      { level: 'INFO', message: 'Browser compatibility verified', module: 'CROSS_PLATFORM' },
      { level: 'ERROR', message: 'Cannot resist optimizing already fast code', module: 'PERFECTIONISM' },
      { level: 'INFO', message: 'Component lifecycle hooks active', module: 'REACT_CORE' },
      { level: 'WARN', message: 'Documentation slightly out of date', module: 'DOCS_MAINTENANCE' },
      { level: 'INFO', message: 'Responsive design breakpoints set', module: 'CSS_GRID' },
      { level: 'ERROR', message: 'Infinite loop in "just one more tweak" function', module: 'CODING_SESSION' },
      { level: 'INFO', message: 'Lazy loading strategy implemented', module: 'PERFORMANCE' },
      { level: 'WARN', message: 'Color contrast ratio slightly below WCAG AA', module: 'ACCESSIBILITY' },
      { level: 'INFO', message: 'Animation frames per second: 60', module: 'RENDER_ENGINE' },
      { level: 'ERROR', message: 'Bug actually was a feature all along', module: 'CLASSIC_MISTAKE' }
    ];

    return logTypes[Math.floor(Math.random() * logTypes.length)];
  };

  const initializeLogs = () => {
    const initialLogs = [];
    const startTime = Date.now() - 60000; // Start from 1 minute ago

    for (let i = 0; i < 15; i++) {
      const log = generateFakeLog();
      const timestamp = startTime + (i * 4000);
      initialLogs.push({
        ...log,
        timestamp,
        id: `log-${timestamp}-${Math.random()}`
      });
    }
    
    return initialLogs.sort((a, b) => b.timestamp - a.timestamp);
  };

  useEffect(() => {
    setLogs(initializeLogs());
    
    // Update system uptime
    const updateUptime = () => {
      const uptime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSystemUptime(uptime);
    };

    if (isLive) {
      const interval = setInterval(() => {
        const newLog = {
          ...generateFakeLog(),
          timestamp: Date.now(),
          id: `log-${Date.now()}-${Math.random()}`
        };
        
        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep max 50 logs
        updateUptime();
      }, 3000);

      return () => clearInterval(interval);
    }
    
    // Track user interactions
    const trackUserAction = () => {
      setUserActions(prev => prev + 1);
    };

    // Listen for user actions globally
    document.addEventListener('click', trackUserAction);
    document.addEventListener('keydown', trackUserAction);
    
    return () => {
      document.removeEventListener('click', trackUserAction);
      document.removeEventListener('keydown', trackUserAction);
    };
  }, [isLive]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR': return '#ef4444';
      case 'WARN': return '#f59e0b';
      case 'INFO': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredLogs = filterLevel === 'all' 
    ? logs 
    : logs.filter(log => log.level === filterLevel);

  const logStats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'ERROR').length,
    warnings: logs.filter(l => l.level === 'WARN').length,
    info: logs.filter(l => l.level === 'INFO').length
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ 
      width: '520px',
      height: '420px',
      background: '#0a0a0a',
      color: '#00ff00',
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        background: '#1a1a1a',
        borderBottom: '1px solid #00ff00',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#00ff00' }}>
            🔍 ERRORLOG.SYS v1.0
          </div>
          <div style={{ fontSize: '8px', color: '#00cc00' }}>
            System Debug & Personality Monitor
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            style={{
              background: '#0a0a0a',
              color: '#00ff00',
              border: '1px solid #00ff00',
              borderRadius: '2px',
              fontSize: '8px',
              padding: '2px 4px'
            }}
          >
            <option value="all">ALL</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
          </select>
          
          {/* Live Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            style={{
              background: isLive ? '#00ff00' : '#666',
              color: '#000',
              border: 'none',
              borderRadius: '2px',
              fontSize: '8px',
              padding: '2px 6px',
              cursor: 'pointer'
            }}
          >
            {isLive ? '● LIVE' : '○ PAUSED'}
          </button>
          
          {/* Clear */}
          <button
            onClick={clearLogs}
            style={{
              background: '#ff0000',
              color: '#fff',
              border: 'none',
              borderRadius: '2px',
              fontSize: '8px',
              padding: '2px 6px',
              cursor: 'pointer'
            }}
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        padding: '4px 12px',
        background: '#111',
        borderBottom: '1px solid #333',
        display: 'flex',
        gap: '20px',
        fontSize: '8px'
      }}>
        <span style={{ color: '#00ff00' }}>
          TOTAL: {logStats.total}
        </span>
        <span style={{ color: '#ef4444' }}>
          ERROR: {logStats.errors}
        </span>
        <span style={{ color: '#f59e0b' }}>
          WARN: {logStats.warnings}
        </span>
        <span style={{ color: '#3b82f6' }}>
          INFO: {logStats.info}
        </span>
      </div>

      {/* Log Entries */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        padding: '8px 12px'
      }}>
        {filteredLogs.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            padding: '40px 0',
            fontSize: '11px'
          }}>
            No logs to display...
            <br />
            System is running too smoothly! 😄
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              style={{
                marginBottom: '4px',
                padding: '4px 6px',
                background: log.level === 'ERROR' ? 'rgba(239, 68, 68, 0.1)' :
                           log.level === 'WARN' ? 'rgba(245, 158, 11, 0.1)' :
                           'rgba(59, 130, 246, 0.1)',
                border: `1px solid ${getLevelColor(log.level)}20`,
                borderRadius: '2px',
                fontSize: '9px',
                fontFamily: '"Courier New", monospace',
                color: '#ccc'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  color: getLevelColor(log.level),
                  fontWeight: 'bold',
                  minWidth: '50px'
                }}>
                  [{log.level}]
                </span>
                <span style={{ color: '#888', minWidth: '80px' }}>
                  {formatTimestamp(log.timestamp)}
                </span>
                <span style={{ 
                  color: '#00ff00', 
                  minWidth: '120px',
                  fontWeight: 'bold'
                }}>
                  {log.module}
                </span>
                <span style={{ color: '#ccc', flex: 1 }}>
                  {log.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '4px 12px',
        background: '#1a1a1a',
        borderTop: '1px solid #00ff00',
        fontSize: '8px',
        color: '#00cc00',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>
          💡 Tip: Some "errors" might just be developer humor!
        </span>
        <span>
          Memory: {Math.min(85, 35 + Math.floor(systemUptime / 120))}% • CPU: {Math.min(80, 15 + Math.floor(userActions / 10))}% • Uptime: {Math.floor(systemUptime / 60)}m • Actions: {userActions}
        </span>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 3px;
        }
        
        select:focus, button:focus {
          outline: 1px solid #00ff00;
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
};

export default ErrorLog;