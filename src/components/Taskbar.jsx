import React, { useState, useEffect } from 'react';

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
              <img src="./images/logo.png" alt="Logo" />
              <span>Browser OS</span>
            </div>
            <div className="start-menu-apps">
              {filteredApps.map((app) => (
                <div key={app.name} className="start-menu-app" onClick={() => handleAppClick(app.name)}>
                  <img src={app.image} alt={app.name} />
                  <span>{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="taskbar">
        <div className="taskbar-left"></div>
        <div className="taskbar-center">
          <button className="start-button" onClick={toggleStartMenu}>
            <img src="./images/logo.png" alt="Start" />
          </button>
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="taskbar-right">
          <span className="tray-icon">📶</span>
          <span className="tray-icon">🔋</span>
          <span className="tray-icon">🔊</span>
          <div className="separator"></div>
          <div className="clock">
            <div className="time">{currentTime}</div>
            <div className="date">{currentDate}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;
