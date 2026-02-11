const SystemTray = ({ currentTime, currentDate, language, onLanguageToggle, onClockClick, addNotification }) => {
  const batteryLevel = 100
  const isCharging = true
  const networkStatus = 'connected'
  const volumeLevel = 75
  const isMuted = false

  const handleNetworkClick = () => {
    addNotification('system', `Network: ${networkStatus}`, {
      title: 'Network Status',
      duration: 2500
    })
  }

  const handleSoundClick = () => {
    addNotification('system', `Volume: ${isMuted ? 'Muted' : `${volumeLevel}%`}`, {
      title: 'Audio',
      duration: 1800
    })
  }

  const handleBatteryClick = () => {
    addNotification('system', `Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`, {
      title: 'Power',
      duration: 2500
    })
  }

  return (
    <>
      <div
        className="tray-icon network"
        onClick={handleNetworkClick}
        title={`Network: ${networkStatus}`}
      >
        {networkStatus === 'connected' ? '📶' : '📡'}
      </div>

      <div
        className="tray-icon sound"
        onClick={handleSoundClick}
        title={`Volume: ${isMuted ? 'Muted' : `${volumeLevel}%`}`}
      >
        {isMuted ? '🔇' : volumeLevel > 50 ? '🔊' : volumeLevel > 0 ? '🔉' : '🔈'}
      </div>

      <div
        className="tray-icon battery"
        onClick={handleBatteryClick}
        title={`Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : ''}`}
      >
        {isCharging ? '🔋' : batteryLevel > 20 ? '🔋' : '🪫'}
      </div>

      <div className="separator" />

      <div
        className={`tray-icon language ${language}`}
        onClick={onLanguageToggle}
        title={`Language: ${language.toUpperCase()}`}
      >
        {language.toUpperCase()}
      </div>

      <div
        className="clock"
        onClick={onClockClick}
        title="Click to open Clock app"
      >
        <div className="time">{currentTime}</div>
        <div className="date">{currentDate}</div>
      </div>
    </>
  )
}

export default SystemTray
