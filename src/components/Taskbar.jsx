import React, { useState, useEffect } from 'react';
import StartMenu from './UI/StartMenu';
import SystemTray from './UI/SystemTray';

const Taskbar = ({ openWindow, windows, activeWindowId, addNotification }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('en');

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
          <button className="os-logo-button" onClick={toggleStartMenu}>
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
                onClick={() => handleRunningAppClick(app.id)}
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
        </div>
      </div>
    </>
  );
};

export default Taskbar;