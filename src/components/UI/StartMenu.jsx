import { useMemo } from 'react'
import { comprehensiveSearch } from '../SearchEngine'
import { getAssetPath } from '../../utils/assets'
import { PROFILE } from '../../config/profile'

const APP_ICONS = {
  Projects: getAssetPath('images/file-explorer.png'),
  Skills: getAssetPath('images/settings.png'),
  Contact: getAssetPath('images/note.png'),
  About: getAssetPath('images/logo.png'),
  Terminal: getAssetPath('images/terminal.png'),
  Settings: getAssetPath('images/settings.png'),
  Calculator: getAssetPath('images/calculator.apng'),
  Chrome: getAssetPath('images/chrome.png'),
  'File Explorer': getAssetPath('images/file-explorer.png'),
  'Trash Bin': getAssetPath('images/bin.png'),
  Notes: getAssetPath('images/note.png'),
  Resume: getAssetPath('images/note.png'),
  ErrorLog: getAssetPath('images/settings.png')
}

const PINNED_APPS = [
  { name: 'Projects', description: 'My portfolio projects' },
  { name: 'Skills', description: 'Technical skills and expertise' },
  { name: 'Contact', description: 'Get in touch with me' },
  { name: 'About', description: 'About me and my resume' },
  { name: 'Terminal', description: 'Command terminal' },
  { name: 'Settings', description: 'System settings' }
].map(app => ({ ...app, icon: APP_ICONS[app.name] }))

const ALL_APP_ENTRIES = [
  ...PINNED_APPS,
  { name: 'Calculator', description: 'Calculator app', icon: APP_ICONS.Calculator },
  { name: 'Chrome', description: 'Web browser', icon: APP_ICONS.Chrome },
  { name: 'File Explorer', description: 'File manager', icon: APP_ICONS['File Explorer'] },
  { name: 'Trash Bin', description: 'Deleted items', icon: APP_ICONS['Trash Bin'] },
  { name: 'Notes', description: 'Note-taking app', icon: APP_ICONS.Notes },
  { name: 'Resume', description: 'Resume viewer', icon: APP_ICONS.Resume },
  { name: 'ErrorLog', description: 'System diagnostics', icon: APP_ICONS.ErrorLog }
]

const ALL_APPS = Array.from(
  new Map(ALL_APP_ENTRIES.map(app => [app.name, app])).values()
)

const SORTED_APPS = [...ALL_APPS].sort((a, b) => a.name.localeCompare(b.name))

function getAppIcon(appName) {
  return ALL_APPS.find(app => app.name === appName)?.icon || getAssetPath('images/logo.png')
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
    <div className="start-menu" onClick={(event) => event.stopPropagation()}>
      <div className="profile-header">
        <div className="avatar">{PROFILE.initials}</div>
        <div className="user-info">
          <div className="name">{PROFILE.name}</div>
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
