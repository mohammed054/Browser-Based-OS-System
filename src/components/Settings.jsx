import { useEffect, useState } from 'react'
import { PROFILE } from '../config/profile'

const NAV_ITEMS = [
  { id: 'system', label: 'System' },
  { id: 'personalization', label: 'Personalization' },
  { id: 'account', label: 'Account' },
  { id: 'privacy', label: 'Privacy' }
]

const shellStyle = {
  width: '100%',
  height: '100%',
  minHeight: 0,
  display: 'grid',
  gridTemplateColumns: '260px minmax(0, 1fr)',
  background: 'linear-gradient(160deg, #0f172a 0%, #111827 100%)',
  color: '#e5e7eb'
}

const sidebarStyle = {
  borderRight: '1px solid rgba(148, 163, 184, 0.2)',
  padding: '18px 14px',
  background: 'rgba(2, 6, 23, 0.35)',
  overflowY: 'auto'
}

const contentStyle = {
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',
  padding: '18px'
}

const sectionCardStyle = {
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '10px',
  background: 'rgba(15, 23, 42, 0.6)',
  padding: '14px',
  marginBottom: '12px'
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 0',
  borderBottom: '1px solid rgba(148, 163, 184, 0.15)'
}

function NavButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        border: '1px solid rgba(148, 163, 184, 0.25)',
        borderRadius: '8px',
        padding: '9px 11px',
        background: active ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.4)',
        color: '#e5e7eb',
        textAlign: 'left',
        marginBottom: '8px',
        fontSize: '13px',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  )
}

function InfoRow({ label, value, hideBorder = false }) {
  return (
    <div style={{ ...rowStyle, borderBottom: hideBorder ? 'none' : rowStyle.borderBottom }}>
      <span style={{ color: 'rgba(226, 232, 240, 0.85)', fontSize: '13px' }}>{label}</span>
      <span style={{ color: '#f8fafc', fontSize: '13px', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function ToggleRow({ label, checked, onChange, hideBorder = false }) {
  return (
    <div style={{ ...rowStyle, borderBottom: hideBorder ? 'none' : rowStyle.borderBottom }}>
      <span style={{ color: 'rgba(226, 232, 240, 0.85)', fontSize: '13px' }}>{label}</span>
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        style={{
          minWidth: '64px',
          border: '1px solid rgba(148, 163, 184, 0.35)',
          borderRadius: '999px',
          padding: '4px 10px',
          background: checked ? 'rgba(34, 197, 94, 0.25)' : 'rgba(51, 65, 85, 0.7)',
          color: checked ? '#22c55e' : '#94a3b8',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600
        }}
      >
        {checked ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

function ActionButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1px solid ${active ? 'rgba(56, 189, 248, 0.55)' : 'rgba(148, 163, 184, 0.35)'}`,
        borderRadius: '8px',
        background: active ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.5)',
        color: '#e5e7eb',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '13px'
      }}
    >
      {label}
    </button>
  )
}

const Settings = ({ theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('system')
  const [displayInfo, setDisplayInfo] = useState({ width: 0, height: 0, colorDepth: 0 })
  const [uptime, setUptime] = useState('1 min (session)')
  const [preferences, setPreferences] = useState({
    notifications: true,
    animations: true,
    locationAccess: false,
    cameraAccess: false
  })

  useEffect(() => {
    const updateDisplayInfo = () => {
      setDisplayInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        colorDepth: window.screen?.colorDepth || 24
      })
    }

    updateDisplayInfo()
    window.addEventListener('resize', updateDisplayInfo)
    return () => window.removeEventListener('resize', updateDisplayInfo)
  }, [])

  useEffect(() => {
    const sessionStart = Date.now()

    const updateUptime = () => {
      const elapsedMinutes = Math.max(1, Math.round((Date.now() - sessionStart) / 60000))
      setUptime(`${elapsedMinutes} min (session)`)
    }

    updateUptime()
    const interval = setInterval(updateUptime, 30000)
    return () => clearInterval(interval)
  }, [])

  const setPreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isDark = theme === 'dark'
  const isCompact = displayInfo.width > 0 && displayInfo.width < 860

  const responsiveShellStyle = {
    ...shellStyle,
    gridTemplateColumns: isCompact ? '1fr' : shellStyle.gridTemplateColumns
  }

  const responsiveSidebarStyle = {
    ...sidebarStyle,
    borderRight: isCompact ? 'none' : sidebarStyle.borderRight,
    borderBottom: isCompact ? '1px solid rgba(148, 163, 184, 0.2)' : 'none'
  }

  return (
    <div style={responsiveShellStyle}>
      <aside style={responsiveSidebarStyle}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Settings</div>
          <div style={{ fontSize: '12px', color: 'rgba(148, 163, 184, 0.9)' }}>System configuration</div>
        </div>

        {NAV_ITEMS.map(item => (
          <NavButton
            key={item.id}
            active={activeTab === item.id}
            label={item.label}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </aside>

      <main style={contentStyle}>
        {activeTab === 'system' && (
          <>
            <h2 style={{ margin: '0 0 14px 0', fontSize: '22px' }}>System</h2>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Device</h3>
              <InfoRow label="User" value={PROFILE.name} />
              <InfoRow label="Region" value={PROFILE.location} />
              <InfoRow label="Session uptime" value={uptime} hideBorder />
            </section>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Display</h3>
              <InfoRow label="Viewport" value={`${displayInfo.width} x ${displayInfo.height}`} />
              <InfoRow label="Color depth" value={`${displayInfo.colorDepth}-bit`} hideBorder />
            </section>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Behavior</h3>
              <ToggleRow
                label="Desktop notifications"
                checked={preferences.notifications}
                onChange={() => setPreference('notifications')}
              />
              <ToggleRow
                label="UI animations"
                checked={preferences.animations}
                onChange={() => setPreference('animations')}
                hideBorder
              />
            </section>
          </>
        )}

        {activeTab === 'personalization' && (
          <>
            <h2 style={{ margin: '0 0 14px 0', fontSize: '22px' }}>Personalization</h2>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Theme</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <ActionButton active={isDark} label="Dark" onClick={() => !isDark && toggleTheme()} />
                <ActionButton active={!isDark} label="Light" onClick={() => isDark && toggleTheme()} />
              </div>
              <InfoRow label="Current theme" value={isDark ? 'Dark' : 'Light'} hideBorder />
            </section>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Wallpaper</h3>
              <div style={{ fontSize: '13px', color: 'rgba(226, 232, 240, 0.85)' }}>
                Wallpaper path is now resolved using runtime base URL for GitHub Pages compatibility.
              </div>
            </section>
          </>
        )}

        {activeTab === 'account' && (
          <>
            <h2 style={{ margin: '0 0 14px 0', fontSize: '22px' }}>Account</h2>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Profile</h3>
              <InfoRow label="Name" value={PROFILE.name} />
              <InfoRow label="Email" value={PROFILE.email} />
              <InfoRow label="Phone" value={PROFILE.phone} hideBorder />
            </section>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Links</h3>
              <InfoRow label="LinkedIn" value={PROFILE.linkedin} />
              <InfoRow label="GitHub" value={PROFILE.github} hideBorder />
            </section>
          </>
        )}

        {activeTab === 'privacy' && (
          <>
            <h2 style={{ margin: '0 0 14px 0', fontSize: '22px' }}>Privacy</h2>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Permissions</h3>
              <ToggleRow
                label="Location access"
                checked={preferences.locationAccess}
                onChange={() => setPreference('locationAccess')}
              />
              <ToggleRow
                label="Camera access"
                checked={preferences.cameraAccess}
                onChange={() => setPreference('cameraAccess')}
                hideBorder
              />
            </section>

            <section style={sectionCardStyle}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Data</h3>
              <div style={{ fontSize: '13px', color: 'rgba(226, 232, 240, 0.85)' }}>
                This portfolio stores no personal data server-side. All state is session-local in the browser.
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Settings
