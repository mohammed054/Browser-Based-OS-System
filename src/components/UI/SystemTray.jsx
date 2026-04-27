const SystemTray = ({ currentTime, currentDate, language, onLanguageToggle, onClockClick, addNotification }) => {
  const batteryLevel = 100
  const networkStatus = 'online'
  const volumeState = 'active'

  return (
    <>
      <div
        className="tray-icon network"
        onClick={() => addNotification('system', 'Network connection stable', {
          title: 'Network',
          duration: 1800
        })}
        title={`Network: ${networkStatus}`}
      >
        NET
      </div>

      <div
        className="tray-icon sound"
        onClick={() => addNotification('system', 'Sound effects are routed through the taskbar volume control', {
          title: 'Audio',
          duration: 2000
        })}
        title={`Audio: ${volumeState}`}
      >
        AUD
      </div>

      <div
        className="tray-icon battery"
        onClick={() => addNotification('system', `Power level ${batteryLevel}%`, {
          title: 'Power',
          duration: 1800
        })}
        title={`Battery: ${batteryLevel}%`}
      >
        {batteryLevel}%
      </div>

      <div className="separator" />

      <div
        className={`tray-icon language ${language}`}
        onClick={onLanguageToggle}
        title={`Language: ${language.toUpperCase()}`}
      >
        {language.toUpperCase()}
      </div>

      <div className="clock" onClick={onClockClick} title="Session time">
        <div className="time">{currentTime}</div>
        <div className="date">{currentDate}</div>
      </div>
    </>
  )
}

export default SystemTray
