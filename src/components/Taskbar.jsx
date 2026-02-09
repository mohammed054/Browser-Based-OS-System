import React, { useState, useEffect } from 'react';
import StartMenu from './UI/StartMenu';
import SystemTray from './UI/SystemTray';

const Taskbar = ({ openWindow, windows, activeWindowId, addNotification }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('en');
  
  // Phase 5: Sound volume state
  const [soundVolume, setSoundVolume] = useState(0.3);

  // Get running apps from windows prop
  const runningApps = windows.map(window => ({
    id: window.id,
    name: window.title,
    icon: getAppIcon(window.title),
    isActive: window.id === activeWindowId && !window.minimized
  }));

  // Get app icon based on app name
  function getAppIcon(appName) {
    const iconMap = {
      'Calculator': './images/calculator.apng',
      'Terminal': './images/terminal.png',
      'Chrome': './images/chrome.png',
      'Settings': './images/settings.png',
      'File Explorer': './images/file-explorer.png',
      'Trash Bin': './images/bin.png',
      'Notes': './images/note.png',
      'Projects': './images/projects.png',
      'Skills': './images/skills.png',
      'Contact': './images/contact.png',
      'About': './images/about.png'
    };
    return iconMap[appName] || './images/logo.png';
  }

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const dateString = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
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
    if (!isStartMenuOpen) {
      setSearchTerm('');
    }
  };

  const handleAppClick = (appType) => {
    openWindow(appType);
    setIsStartMenuOpen(false);
    setSearchTerm('');
    
    // Add notification for app opened
    addNotification('app', `${appType} opened`, {
      title: 'Application',
      duration: 3000
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRunningAppClick = (appId) => {
    // Focus the window if it's already open
    const window = windows.find(w => w.id === appId);
    if (window) {
      if (window.minimized) {
        // Restore minimized window
        openWindow(window.title);
      } else {
        // Focus existing window
        // This would need to be implemented in App.jsx
        addNotification('system', `Focused ${window.title}`, {
          duration: 2000
        });
      }
    }
  };

  const handleClockClick = () => {
    // Open Clock app (would need to be created)
    addNotification('system', 'Clock app not yet implemented', {
      duration: 3000
    });
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    addNotification('system', `Language changed to ${newLanguage.toUpperCase()}`, {
      duration: 2000
    });
  };

  const closeStartMenu = () => {
    setIsStartMenuOpen(false);
    setSearchTerm('');
  };

  // Phase 5: Sound control functions
  const handleToggleSound = () => {
    // Toggle sound on/off
    if (typeof window !== 'undefined' && window.soundManager) {
      if (soundVolume > 0) {
        setSoundVolume(0);
        window.soundManager.disable();
      } else {
        setSoundVolume(0.5);
        window.soundManager.enable();
        window.soundManager.setVolume(0.5);
      }
    }
    // Play click sound
    window.soundManager.play('click');
  };

  const handleVolumeSliderClick = (e) => {
    e.stopPropagation(); // Prevent toggle when adjusting volume
    const newVolume = parseFloat(e.target.value);
    setSoundVolume(newVolume);
    if (typeof window !== 'undefined' && window.soundManager) {
      if (newVolume === 0) {
        window.soundManager.disable();
      } else {
        window.soundManager.enable();
        window.soundManager.setVolume(newVolume);
      }
    }
  };

  // Phase 5: Handle custom keyboard shortcuts
  useEffect(() => {
    const handleOpenStartMenu = () => {
      toggleStartMenu();
    };

    const handleCloseMenus = () => {
      if (isStartMenuOpen) {
        closeStartMenu();
      }
    };

    const handleToggleSoundShortcut = () => {
      handleToggleSound();
    };

    document.addEventListener('open-start-menu', handleOpenStartMenu);
    document.addEventListener('escape-pressed', handleCloseMenus);
    document.addEventListener('toggle-sound', handleToggleSoundShortcut);
    
    return () => {
      document.removeEventListener('open-start-menu', handleOpenStartMenu);
      document.removeEventListener('escape-pressed', handleCloseMenus);
      document.removeEventListener('toggle-sound', handleToggleSoundShortcut);
    };
  }, [isStartMenuOpen, soundVolume]);

  return (
    <>
      {isStartMenuOpen && (
        <div className="start-menu-overlay" onClick={closeStartMenu}>
          <StartMenu
            isOpen={isStartMenuOpen}
            onClose={closeStartMenu}
            openWindow={handleAppClick}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            addNotification={addNotification}
          />
        </div>
      )}
      
      <div className="taskbar">
        {/* Left Section - OS Logo */}
        <div className="taskbar-left">
          <button 
            className="os-logo-button" 
            onClick={() => {
              // Phase 5: Play click sound
              if (typeof window !== 'undefined' && window.soundManager) {
                window.soundManager.play('click');
              }
              toggleStartMenu();
            }}
          >
            <img src="./images/logo.png" alt="OS" />
          </button>
        </div>

        {/* Center Section - Running Apps */}
        <div className="taskbar-center">
          <div className="running-apps-container">
            {runningApps.map((app) => (
              <div
                key={app.id}
                className={`running-app ${app.isActive ? 'active' : ''}`}
                 onClick={() => {
                  // Phase 5: Play click sound
                  if (typeof window !== 'undefined' && window.soundManager) {
                    window.soundManager.play('click');
                  }
                  handleRunningAppClick(app.id);
                }}
                title={app.name}
              >
                <img src={app.icon} alt={app.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - System Tray */}
        <div className="taskbar-right">
          <SystemTray
            currentTime={currentTime}
            currentDate={currentDate}
            language={language}
            onLanguageToggle={handleLanguageToggle}
            onClockClick={handleClockClick}
            addNotification={addNotification}
          />
          
          {/* Phase 5: Volume Control */}
          <div 
            className="tray-icon sound-control"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: '10px',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              cursor: 'pointer'
            }}
            title={`Sound Effects Volume: ${Math.round(soundVolume * 100)}%`}
            onClick={() => {
              // Toggle sound on/off
              if (typeof window !== 'undefined' && window.soundManager) {
                if (soundVolume > 0) {
                  setSoundVolume(0);
                  window.soundManager.disable();
                } else {
                  setSoundVolume(0.5);
                  window.soundManager.enable();
                  window.soundManager.setVolume(0.5);
                }
                // Play click sound
                window.soundManager.play('click');
              }
            }}
          >
            <span style={{ 
              fontSize: '16px', 
              color: soundVolume > 0 ? 'var(--os-cyan, #38bdf8)' : 'rgba(255, 255, 255, 0.5)',
              marginRight: '5px',
              transition: 'all 0.2s'
            }}>
              🔊
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={soundVolume}
              onChange={handleVolumeSliderClick}
              onClick={(e) => e.stopPropagation()} // Prevent toggle when adjusting volume
              style={{
                width: '60px',
                height: '4px',
                background: 'transparent',
                outline: 'none',
                opacity: soundVolume > 0 ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;