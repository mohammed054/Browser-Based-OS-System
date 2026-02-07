import React, { useState, useEffect } from 'react';
import { theme } from '../../theme';
import Button from './Button';
import Input from './Input';

/**
 * Redesigned Taskbar Component
 * Modern styling with improved Start menu and system tray
 */
const Taskbar = ({ openWindow }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const apps = [
    { name: 'Calculator', image: './images/calculator.apng' },
    { name: 'Terminal', image: './images/terminal.png' },
    { name: 'Chrome', image: './images/chrome.png' },
    { name: 'Settings', image: './images/settings.png' },
    { name: 'File Explorer', image: './images/file-explorer.png' },
    { name: 'Trash Bin', image: './images/bin.png' },
    { name: 'Notes', image: './images/note.png' }
  ];

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const dateString = now.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const handleAppClick = (appType) => {
    openWindow(appType);
    setIsStartMenuOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeMenu = () => {
    setIsStartMenuOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      {(isStartMenuOpen || searchTerm) && (
        <div className="start-menu-overlay" onClick={closeMenu}>
          <div className="start-menu" onClick={(e) => e.stopPropagation()}>
            <div className="start-menu-header">
              <img src="./images/logo.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
              <span style={{ 
                marginLeft: '12px', 
                fontSize: theme.typography.sizes.lg, 
                fontWeight: theme.typography.weights.bold,
                fontFamily: theme.typography.heading,
                color: theme.colors.textPrimary
              }}>
                Browser OS
              </span>
            </div>
            <div className="start-menu-search">
              <Input
                type="text"
                placeholder="Search apps and files..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  marginBottom: theme.spacing.md
                }}
              />
            </div>
            <div className="start-menu-apps">
              {filteredApps.map((app) => (
                <div 
                  key={app.name} 
                  className="start-menu-app" 
                  onClick={() => handleAppClick(app.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: theme.spacing.sm,
                    borderRadius: theme.dimensions.buttonBorderRadius,
                    cursor: 'pointer',
                    transition: theme.animations.hover,
                    marginBottom: theme.spacing.xs
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.hover;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <img 
                    src={app.image} 
                    alt={app.name} 
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      marginRight: theme.spacing.md 
                    }} 
                  />
                  <span style={{ 
                    fontSize: theme.typography.sizes.base, 
                    color: theme.colors.textPrimary 
                  }}>
                    {app.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="taskbar" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: theme.dimensions.taskbarHeight,
        backgroundColor: theme.colors.panel,
        borderTop: `1px solid ${theme.colors.accentPrimary}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${theme.spacing.lg}`,
        zIndex: theme.zIndex.window,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div className="taskbar-left" style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <Button
            variant="primary"
            onClick={toggleStartMenu}
            style={{
              padding: theme.spacing.sm,
              borderRadius: theme.dimensions.buttonBorderRadius,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img src="./images/logo.png" alt="Start" style={{ width: '24px', height: '24px' }} />
          </Button>
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '240px',
              height: '36px'
            }}
          />
        </div>
        <div className="taskbar-right" style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <div style={{ display: 'flex', gap: theme.spacing.sm }}>
            <span className="tray-icon" style={{ fontSize: theme.typography.sizes.lg }}>📶</span>
            <span className="tray-icon" style={{ fontSize: theme.typography.sizes.lg }}>🔋</span>
            <span className="tray-icon" style={{ fontSize: theme.typography.sizes.lg }}>🔊</span>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: theme.colors.accentPrimary, opacity: 0.3 }}></div>
          <div className="clock" style={{ textAlign: 'right' }}>
            <div className="time" style={{ 
              fontSize: theme.typography.sizes.lg, 
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.heading
            }}>
              {currentTime}
            </div>
            <div className="date" style={{ 
              fontSize: theme.typography.sizes.sm, 
              color: theme.colors.textSecondary 
            }}>
              {currentDate}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;