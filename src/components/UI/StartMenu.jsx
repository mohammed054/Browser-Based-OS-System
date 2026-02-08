import React, { useState, useEffect } from 'react';
import { comprehensiveSearch } from '../SearchEngine';

const StartMenu = ({ isOpen, onClose, openWindow, searchTerm, setSearchTerm, addNotification }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);

  // Portfolio apps for pinned grid
  const pinnedApps = [
    { name: 'Projects', icon: './images/projects.png', description: 'My portfolio projects' },
    { name: 'Skills', icon: './images/skills.png', description: 'Technical skills & expertise' },
    { name: 'Contact', icon: './images/contact.png', description: 'Get in touch with me' },
    { name: 'About', icon: './images/about.png', description: 'About me & my resume' },
    { name: 'Terminal', icon: './images/terminal.png', description: 'Command terminal' },
    { name: 'Settings', icon: './images/settings.png', description: 'System settings' }
  ];

  // All available apps
  const allApps = [
    ...pinnedApps,
    { name: 'Calculator', icon: './images/calculator.apng', description: 'Calculator app' },
    { name: 'Chrome', icon: './images/chrome.png', description: 'Web browser' },
    { name: 'File Explorer', icon: './images/file-explorer.png', description: 'File manager' },
    { name: 'Trash Bin', icon: './images/bin.png', description: 'Deleted items' },
    { name: 'Notes', icon: './images/note.png', description: 'Note-taking app' }
  ];

  // Sort apps alphabetically
  const sortedApps = [...allApps].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = comprehensiveSearch(searchTerm);
      setSearchResults(results);
      
      // Filter apps based on search
      const filtered = allApps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApps(filtered);
    } else {
      setSearchResults([]);
      setFilteredApps(sortedApps);
    }
  }, [searchTerm]);

  const handleAppClick = (appName) => {
    openWindow(appName);
    onClose();
  };

  const handleLock = () => {
    addNotification('system', 'System locked', {
      title: 'Security',
      duration: 3000
    });
    // This would trigger lock screen - to be implemented
    onClose();
  };

  const handleAbout = () => {
    addNotification('system', 'Browser OS v1.0 - Portfolio Edition', {
      title: 'About',
      duration: 5000
    });
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset session? This will close all windows and reset the desktop.')) {
      addNotification('system', 'Session reset - Reloading...', {
        title: 'System',
        duration: 3000
      });
      setTimeout(() => window.location.reload(), 1000);
    }
    onClose();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="start-menu">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar">MH</div>
        <div className="user-info">
          <div className="name">Mohammed Hassoun</div>
          <div className="title">Browser-Based OS Engineer</div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search apps, commands, keywords..."
          value={searchTerm}
          onChange={handleSearchChange}
          autoFocus
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="all-app-item"
              onClick={() => handleAppClick(result.app)}
            >
              <img src={getAppIcon(result.app)} alt={result.app} />
              <span>{result.app}</span>
              {result.message && (
                <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '8px' }}>
                  {result.message}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pinned Apps Grid */}
      {!searchTerm && (
        <div className="pinned-apps">
          <div className="pinned-apps-grid">
            {pinnedApps.map((app) => (
              <div
                key={app.name}
                className="pinned-app"
                onClick={() => handleAppClick(app.name)}
                title={app.description}
              >
                <img src={app.icon} alt={app.name} />
                <span>{app.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Apps Section */}
      <div className="all-apps">
        {filteredApps.map((app) => (
          <div
            key={app.name}
            className="all-app-item"
            onClick={() => handleAppClick(app.name)}
            title={app.description}
          >
            <img src={app.icon} alt={app.name} />
            <span>{app.name}</span>
          </div>
        ))}
      </div>

      {/* Power Section */}
      <div className="power-section">
        <button className="power-button" onClick={handleLock}>
          🔒 Lock
        </button>
        <button className="power-button" onClick={handleAbout}>
          ℹ️ About
        </button>
        <button className="power-button" onClick={handleReset}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

// Helper function to get app icon
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

export default StartMenu;