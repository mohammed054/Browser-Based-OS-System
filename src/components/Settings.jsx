import { useEffect, useMemo, useState } from 'react'
import { SYSTEM_METADATA, SYSTEM_METRICS } from '../data/portfolio'
import { readStorage, writeStorage } from '../utils/storage'

const TABS = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'session', label: 'Session' }
]

const ACCENT_OPTIONS = [
  { id: 'ocean', label: 'Ocean', color: '#67e8f9' },
  { id: 'ember', label: 'Ember', color: '#fb923c' },
  { id: 'forest', label: 'Forest', color: '#4ade80' }
]

const WALLPAPER_OPTIONS = [
  { id: 'architect', label: 'Architect' },
  { id: 'studio', label: 'Studio' },
  { id: 'midnight', label: 'Midnight' }
]

const DEFAULT_PREFERENCES = {
  notifications: true,
  motion: true,
  focusMode: false
}

function NavButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      className={`segmented-button ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{
        width: '100%',
        justifyContent: 'flex-start',
        textAlign: 'left',
        minHeight: '40px'
      }}
    >
      {label}
    </button>
  )
}

function PreferenceRow({ label, detail, enabled, onToggle }) {
  return (
    <div className="list-row" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
      <div>
        <div className="list-title">{label}</div>
        <div className="list-copy">{detail}</div>
      </div>
      <button type="button" className={`button ${enabled ? '' : 'secondary'}`} onClick={onToggle}>
        {enabled ? 'Enabled' : 'Disabled'}
      </button>
    </div>
  )
}

const Settings = ({ appearance, updateAppearance, systemAPI }) => {
  const [activeTab, setActiveTab] = useState('appearance')
  const [preferences, setPreferences] = useState(() => readStorage('settings-preferences', DEFAULT_PREFERENCES))
  const [displayInfo, setDisplayInfo] = useState({
    width: 0,
    height: 0,
    pixelRatio: 1,
    language: 'en-US'
  })

  useEffect(() => {
    writeStorage('settings-preferences', preferences)
  }, [preferences])

  useEffect(() => {
    const updateDisplayInfo = () => {
      setDisplayInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        language: navigator.language || 'en-US'
      })
    }

    updateDisplayInfo()
    window.addEventListener('resize', updateDisplayInfo)
    return () => window.removeEventListener('resize', updateDisplayInfo)
  }, [])

  const sessionStats = useMemo(() => ([
    { label: 'Viewport', value: `${displayInfo.width} x ${displayInfo.height}`, note: 'Current browser canvas' },
    { label: 'Pixel ratio', value: `${displayInfo.pixelRatio.toFixed(2)}x`, note: 'Rendering density' },
    { label: 'Language', value: displayInfo.language, note: 'Browser locale' },
    { label: 'Theme', value: appearance.mode, note: `${appearance.accent} accent, ${appearance.wallpaper} scene` }
  ]), [displayInfo, appearance])

  const togglePreference = (key) => {
    setPreferences((prev) => {
      const nextValue = !prev[key]
      const next = { ...prev, [key]: nextValue }
      systemAPI.addNotification('system', `${key} ${nextValue ? 'enabled' : 'disabled'}`, {
        title: 'Preference updated',
        duration: 1800
      })
      return next
    })
  }

  const setThemeMode = (mode) => {
    updateAppearance({ mode })
    systemAPI.addNotification('system', `Theme switched to ${mode}`, {
      title: 'Appearance',
      duration: 1800
    })
  }

  const setAccent = (accent) => {
    updateAppearance({ accent })
    systemAPI.addNotification('system', `Accent changed to ${accent}`, {
      title: 'Appearance',
      duration: 1800
    })
  }

  const setWallpaper = (wallpaper) => {
    updateAppearance({ wallpaper })
    systemAPI.addNotification('system', `Wallpaper changed to ${wallpaper}`, {
      title: 'Appearance',
      duration: 1800
    })
  }

  return (
    <div className="app-shell app-shell--split">
      <aside className="app-sidebar">
        <div className="app-title-stack" style={{ marginBottom: 18 }}>
          <div className="app-eyebrow">Control Panel</div>
          <div className="app-title">Settings</div>
          <div className="app-subtitle">Tune the shell, check the session, and move around faster.</div>
        </div>

        <div className="stack" style={{ gap: 8, marginBottom: 18 }}>
          {TABS.map((tab) => (
            <NavButton
              key={tab.id}
              active={activeTab === tab.id}
              label={tab.label}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        <div className="panel">
          <div className="panel-title">System</div>
          <div className="panel-body">
            {SYSTEM_METADATA.name} {SYSTEM_METADATA.version}
            <br />
            {SYSTEM_METADATA.tagline}
          </div>
        </div>
      </aside>

      <main className="app-main">
        {activeTab === 'appearance' && (
          <div className="stack">
            <div className="metric-grid">
              {sessionStats.map((stat) => (
                <div key={stat.label} className="metric-card">
                  <div className="metric-label">{stat.label}</div>
                  <div className="metric-value" style={{ fontSize: '20px', margin: '6px 0 8px' }}>{stat.value}</div>
                  <div className="panel-body">{stat.note}</div>
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title">Theme mode</div>
              <div className="panel-body" style={{ marginBottom: 12 }}>
                Light and dark both use the same layout system. Only the atmosphere changes.
              </div>
              <div className="segmented">
                {['dark', 'light'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`segmented-button ${appearance.mode === mode ? 'active' : ''}`}
                    onClick={() => setThemeMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Accent palette</div>
              <div className="chip-row">
                {ACCENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`button ${appearance.accent === option.id ? '' : 'secondary'}`}
                    onClick={() => setAccent(option.id)}
                    style={{ minWidth: 112, justifyContent: 'space-between' }}
                  >
                    <span>{option.label}</span>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 999,
                        background: option.color,
                        boxShadow: `0 0 0 1px rgba(255,255,255,0.16), 0 0 18px ${option.color}`
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Scene preset</div>
              <div className="chip-row">
                {WALLPAPER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`button ${appearance.wallpaper === option.id ? '' : 'secondary'}`}
                    onClick={() => setWallpaper(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="stack">
            <div className="panel">
              <div className="panel-title">Preferences</div>
              <div className="list-table">
                <PreferenceRow
                  label="Notifications"
                  detail="Keeps launch, copy, and state updates visible across the shell."
                  enabled={preferences.notifications}
                  onToggle={() => togglePreference('notifications')}
                />
                <PreferenceRow
                  label="Motion bias"
                  detail="Preserves transitions and feedback cues in the OS surface."
                  enabled={preferences.motion}
                  onToggle={() => togglePreference('motion')}
                />
                <PreferenceRow
                  label="Focus mode"
                  detail="A simple mental toggle for tighter app workflows. Safe to keep experimental."
                  enabled={preferences.focusMode}
                  onToggle={() => togglePreference('focusMode')}
                />
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Quick actions</div>
              <div className="button-row">
                <button type="button" className="button" onClick={() => systemAPI.openWindow('Terminal')}>
                  Open terminal
                </button>
                <button type="button" className="button secondary" onClick={() => systemAPI.openWindow('Notes')}>
                  Open notes
                </button>
                <button type="button" className="button secondary" onClick={() => systemAPI.lockSystem()}>
                  Lock system
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'session' && (
          <div className="stack">
            <div className="metric-grid">
              {SYSTEM_METRICS.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <div className="metric-label">{metric.label}</div>
                  <div className="metric-value" style={{ fontSize: '22px', margin: '6px 0 8px' }}>{metric.value}</div>
                  <div className="panel-body">{metric.note}</div>
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-title">Session note</div>
              <div className="panel-body">
                This rebuild leans into truthful portfolio content. It favors demonstrated capability over invented companies,
                made-up degrees, or fake production numbers.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Settings
