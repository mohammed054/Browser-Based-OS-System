import { useState, useEffect } from 'react';

const Chrome = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');
  const [history, setHistory] = useState(['https://www.google.com']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = (newUrl) => {
    // Clean up the URL
    let cleanUrl = newUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    // Remove future history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(cleanUrl);

    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setUrl(cleanUrl);
    setInputUrl(cleanUrl);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const newUrl = history[newIndex];
      setUrl(newUrl);
      setInputUrl(newUrl);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const newUrl = history[newIndex];
      setUrl(newUrl);
      setInputUrl(newUrl);
    }
  };

  const handleGo = () => {
    navigate(inputUrl);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGo();
    }
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  return (
    <div className="chrome-app">
      <div className="chrome-toolbar">
        <div className="chrome-nav-buttons">
          <button
            className={`nav-button ${!canGoBack ? 'disabled' : ''}`}
            onClick={goBack}
            disabled={!canGoBack}
            title="Back"
          >
            ←
          </button>
          <button
            className={`nav-button ${!canGoForward ? 'disabled' : ''}`}
            onClick={goForward}
            disabled={!canGoForward}
            title="Forward"
          >
            →
          </button>
        </div>
        <div className="chrome-address-bar">
          <input
            type="text"
            className="address-input"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search or enter address"
          />
          <button className="go-button" onClick={handleGo} title="Go">
            Go
          </button>
        </div>
      </div>
      <div className="chrome-content">
        <div className="page-content">
          <h2>You are visiting:</h2>
          <div className="current-url">{url}</div>
          <div className="page-placeholder">
            <h3>Page Content</h3>
            <p>This is a simulated browser page for: <strong>{url}</strong></p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chrome;
