import React, { useState, useEffect } from 'react';

const SystemTray = ({ currentTime, currentDate, language, onLanguageToggle, onClockClick, addNotification }) => {
  const [batteryLevel] = useState(100); // Fake battery - always 100%
  const [isCharging] = useState(true);
  const [networkStatus] = useState('connected');
  const [volumeLevel] = useState(75);
  const [isMuted] = useState(false);

  const handleNetworkClick = () => {
    addNotification('system', `Network: ${networkStatus}`, {
      title: 'Network Status',
      duration: 3000
    });
  };

  const handleSoundClick = () => {
    addNotification('system', `Volume: ${isMuted ? 'Muted' : volumeLevel + '%'}`, {
      title: 'Audio',
      duration: 2000
    });
  };

  const handleBatteryClick = () => {
    addNotification('system', `Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`, {
      title: 'Power',
      duration: 3000
    });
  };

  return (
    <>
      {/* Network Icon */}
      <div
        className="tray-icon network"
        onClick={handleNetworkClick}
        title={`Network: ${networkStatus}`}
      >
        {networkStatus === 'connected' ? '📶' : '📡'}
      </div>

      {/* Sound Icon */}
      <div
        className="tray-icon sound"
        onClick={handleSoundClick}
        title={`Volume: ${isMuted ? 'Muted' : volumeLevel + '%'}`}
      >
        {isMuted ? '🔇' : volumeLevel > 50 ? '🔊' : volumeLevel > 0 ? '🔉' : '🔈'}
      </div>

      {/* Battery Icon */}
      <div
        className="tray-icon battery"
        onClick={handleBatteryClick}
        title={`Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`}
      >
        {isCharging ? '🔋' : batteryLevel > 20 ? '🔋' : '🪫'}
      </div>

      {/* Separator */}
      <div className="separator"></div>

      {/* Language Toggle */}
      <div
        className={`tray-icon language ${language}`}
        onClick={onLanguageToggle}
        title={`Language: ${language.toUpperCase()}`}
      >
        {language.toUpperCase()}
      </div>

      {/* Clock */}
      <div
        className="clock"
        onClick={onClockClick}
        title="Click to open Clock app"
      >
        <div className="time">{currentTime}</div>
        <div className="date">{currentDate}</div>
      </div>
    </>
  );
};

export default SystemTray;