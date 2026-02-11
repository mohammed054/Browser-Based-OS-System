import { useState, useEffect, useMemo, useCallback } from 'react'
import StartMenu from './UI/StartMenu'
import SystemTray from './UI/SystemTray'

const APP_ICON_MAP = {
  Calculator: '/images/calculator.apng',
  Terminal: '/images/terminal.png',
  Chrome: '/images/chrome.png',
  Settings: '/images/settings.png',
  'File Explorer': '/images/file-explorer.png',
  'Trash Bin': '/images/bin.png',
  Notes: '/images/note.png',
  Projects: '/images/file-explorer.png',
  Skills: '/images/settings.png',
  Contact: '/images/note.png',
  About: '/images/logo.png',
  Resume: '/images/note.png',
  ErrorLog: '/images/settings.png'
}

const Taskbar = ({ openWindow, windows, activeWindowId, onWindowAction, addNotification }) => {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [language, setLanguage] = useState('en')
  const [soundVolume, setSoundVolume] = useState(0.3)

  const runningApps = useMemo(() => windows.map(windowState => ({
    id: windowState.id,
    name: windowState.title,
    icon: APP_ICON_MAP[windowState.appType || windowState.title] || '/images/logo.png',
    isActive: windowState.id === activeWindowId && !windowState.minimized
  })), [windows, activeWindowId])

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }))
      setCurrentDate(now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const closeStartMenu = useCallback(() => {
    setIsStartMenuOpen(false)
    setSearchTerm('')
  }, [])

  const toggleStartMenu = useCallback(() => {
    setIsStartMenuOpen(prev => {
      const next = !prev
      if (!next) {
        setSearchTerm('')
      }
      return next
    })
  }, [])

  const handleStartMenuAppClick = useCallback((appType) => {
    openWindow(appType)
    closeStartMenu()

    addNotification('app', `${appType} opened`, {
      title: 'Application',
      duration: 2500
    })
  }, [addNotification, closeStartMenu, openWindow])

  const handleRunningAppClick = useCallback((appId) => {
    if (typeof onWindowAction === 'function') {
      onWindowAction(appId)
      return
    }

    const targetWindow = windows.find(windowState => windowState.id === appId)
    if (targetWindow) {
      openWindow(targetWindow.title)
    }
  }, [onWindowAction, windows, openWindow])

  const handleClockClick = useCallback(() => {
    addNotification('system', 'Clock app not yet implemented', { duration: 2500 })
  }, [addNotification])

  const handleLanguageToggle = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'ar' : 'en'
      addNotification('system', `Language changed to ${next.toUpperCase()}`, {
        duration: 2000
      })
      return next
    })
  }, [addNotification])

  const handleToggleSound = useCallback(() => {
    if (!window.soundManager) {
      return
    }

    if (soundVolume > 0) {
      setSoundVolume(0)
      window.soundManager.disable()
    } else {
      setSoundVolume(0.5)
      window.soundManager.enable()
      window.soundManager.setVolume(0.5)
      window.soundManager.play('click')
    }
  }, [soundVolume])

  const handleVolumeSliderChange = useCallback((event) => {
    const nextVolume = parseFloat(event.target.value)
    setSoundVolume(nextVolume)

    if (!window.soundManager) {
      return
    }

    if (nextVolume <= 0) {
      window.soundManager.disable()
      return
    }

    window.soundManager.enable()
    window.soundManager.setVolume(nextVolume)
  }, [])

  useEffect(() => {
    const handleOpenStartMenu = () => {
      setIsStartMenuOpen(true)
    }

    const handleCloseMenus = () => {
      closeStartMenu()
    }

    const handleToggleSoundShortcut = () => {
      handleToggleSound()
    }

    document.addEventListener('open-start-menu', handleOpenStartMenu)
    document.addEventListener('escape-pressed', handleCloseMenus)
    document.addEventListener('toggle-sound', handleToggleSoundShortcut)

    return () => {
      document.removeEventListener('open-start-menu', handleOpenStartMenu)
      document.removeEventListener('escape-pressed', handleCloseMenus)
      document.removeEventListener('toggle-sound', handleToggleSoundShortcut)
    }
  }, [closeStartMenu, handleToggleSound])

  return (
    <>
      {isStartMenuOpen && (
        <div className="start-menu-overlay" onClick={closeStartMenu}>
          <StartMenu
            isOpen={isStartMenuOpen}
            onClose={closeStartMenu}
            openWindow={handleStartMenuAppClick}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            addNotification={addNotification}
          />
        </div>
      )}

      <div className="taskbar">
        <div className="taskbar-left">
          <button
            className="os-logo-button"
            onClick={() => {
              if (window.soundManager) {
                window.soundManager.play('click')
              }
              toggleStartMenu()
            }}
            aria-label="Open start menu"
          >
            <img src="/images/logo.png" alt="OS" />
          </button>
        </div>

        <div className="taskbar-center">
          <div className="running-apps-container">
            {runningApps.map((app) => (
              <button
                key={app.id}
                type="button"
                className={`running-app ${app.isActive ? 'active' : ''}`}
                onClick={() => {
                  if (window.soundManager) {
                    window.soundManager.play('click')
                  }
                  handleRunningAppClick(app.id)
                }}
                title={app.name}
              >
                <img src={app.icon} alt={app.name} />
              </button>
            ))}
          </div>
        </div>

        <div className="taskbar-right">
          <SystemTray
            currentTime={currentTime}
            currentDate={currentDate}
            language={language}
            onLanguageToggle={handleLanguageToggle}
            onClockClick={handleClockClick}
            addNotification={addNotification}
          />

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
              background: 'rgba(255, 255, 255, 0.1)'
            }}
            title={`Sound Effects Volume: ${Math.round(soundVolume * 100)}%`}
            onClick={handleToggleSound}
          >
            <span
              style={{
                fontSize: '16px',
                color: soundVolume > 0 ? 'var(--os-cyan, #38bdf8)' : 'rgba(255, 255, 255, 0.5)',
                marginRight: '5px',
                transition: 'all 0.2s'
              }}
            >
              🔊
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={soundVolume}
              onChange={handleVolumeSliderChange}
              onClick={(event) => event.stopPropagation()}
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
  )
}

export default Taskbar
