import { useMemo } from 'react'
import { comprehensiveSearch } from '../SearchEngine'

const PINNED_APPS = [
  { name: 'Projects', icon: '/images/file-explorer.png', description: 'My portfolio projects' },
  { name: 'Skills', icon: '/images/settings.png', description: 'Technical skills and expertise' },
  { name: 'Contact', icon: '/images/note.png', description: 'Get in touch with me' },
  { name: 'About', icon: '/images/logo.png', description: 'About me and my resume' },
  { name: 'Terminal', icon: '/images/terminal.png', description: 'Command terminal' },
  { name: 'Settings', icon: '/images/settings.png', description: 'System settings' }
]

const ALL_APPS = [
  ...PINNED_APPS,
  { name: 'Calculator', icon: '/images/calculator.apng', description: 'Calculator app' },
  { name: 'Chrome', icon: '/images/chrome.png', description: 'Web browser' },
  { name: 'File Explorer', icon: '/images/file-explorer.png', description: 'File manager' },
  { name: 'Trash Bin', icon: '/images/bin.png', description: 'Deleted items' },
  { name: 'Notes', icon: '/images/note.png', description: 'Note-taking app' },
  { name: 'Resume', icon: '/images/note.png', description: 'Resume viewer' },
  { name: 'ErrorLog', icon: '/images/settings.png', description: 'System diagnostics' }
]

const SORTED_APPS = [...ALL_APPS].sort((a, b) => a.name.localeCompare(b.name))

function getAppIcon(appName) {
  return ALL_APPS.find(app => app.name === appName)?.icon || '/images/logo.png'
}

const StartMenu = ({ isOpen, onClose, openWindow, searchTerm, setSearchTerm, addNotification }) => {

  const filteredApps = useMemo(() => {
    if (!searchTerm.trim()) {
      return SORTED_APPS
    }

    const query = searchTerm.toLowerCase()
    return SORTED_APPS.filter(app => (
      app.name.toLowerCase().includes(query) || app.description.toLowerCase().includes(query)
    ))
  }, [searchTerm])
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return []
    }

    return comprehensiveSearch(searchTerm)
  }, [searchTerm])

  const handleAppClick = (appName) => {
    openWindow(appName)
    onClose()
  }

  const handleLock = () => {
    addNotification('system', 'Use Ctrl+L to lock the system', {
      title: 'Security',
      duration: 2500
    })
    onClose()
  }

  const handleAbout = () => {
    addNotification('system', 'Browser OS - Stable build', {
      title: 'About',
      duration: 3000
    })
    onClose()
  }

  const handleReset = () => {
    if (window.confirm('Reset session? This will reload the desktop.')) {
      addNotification('system', 'Reloading session...', {
        title: 'System',
        duration: 2000
      })
      setTimeout(() => window.location.reload(), 900)
    }
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="start-menu">
      <div className="profile-header">
        <div className="avatar">MH</div>
        <div className="user-info">
          <div className="name">Mohammed Hassoun</div>
          <div className="title">Web OS Engineer</div>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search apps, commands, keywords..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          autoFocus
        />
      </div>

      {searchResults.length > 0 && (
        <div className="all-apps" style={{ maxHeight: '140px' }}>
          {searchResults.slice(0, 5).map((result, index) => (
            <div
              key={`${result.app}-${index}`}
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

      {!searchTerm && (
        <div className="pinned-apps">
          <div className="pinned-apps-grid">
            {PINNED_APPS.map((app) => (
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

      <div className="power-section">
        <button className="power-button" onClick={handleLock}>
          Lock
        </button>
        <button className="power-button" onClick={handleAbout}>
          About
        </button>
        <button className="power-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default StartMenu

