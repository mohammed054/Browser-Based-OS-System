import { ABOUT_SECTIONS, CAPABILITY_GROUPS, SYSTEM_METRICS } from '../data/portfolio'
import { PROFILE } from '../config/profile'

const About = ({ systemAPI }) => {
  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-title-stack">
          <div className="app-eyebrow">Profile</div>
          <div className="app-title">{PROFILE.name}</div>
          <div className="app-subtitle">{PROFILE.title}</div>
        </div>

        <div className="button-row">
          <button type="button" className="button" onClick={() => systemAPI.openWindow('Projects')}>
            View projects
          </button>
          <button type="button" className="button secondary" onClick={() => systemAPI.openWindow('Contact')}>
            Contact
          </button>
          <button type="button" className="button secondary" onClick={() => systemAPI.openWindow('Terminal')}>
            Open terminal
          </button>
        </div>
      </div>

      <div className="app-main stack">
        <div className="metric-grid">
          {SYSTEM_METRICS.map((metric) => (
            <div key={metric.label} className="metric-card">
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value" style={{ fontSize: '22px', margin: '8px 0 6px' }}>{metric.value}</div>
              <div className="panel-body">{metric.note}</div>
            </div>
          ))}
        </div>

        <div className="panel-grid" style={{ gridTemplateColumns: '1.15fr 0.85fr' }}>
          <div className="panel">
            <div className="panel-title">Narrative</div>
            <div className="stack">
              {ABOUT_SECTIONS.map((section) => (
                <div key={section.title} className="list-row" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="list-title">{section.title}</div>
                  <div className="list-copy">{section.body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">Capability groups</div>
            <div className="stack">
              {CAPABILITY_GROUPS.map((group) => (
                <div key={group.title} className="list-row" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="list-title">{group.title}</div>
                  <div className="list-copy">{group.summary}</div>
                  <div className="chip-row" style={{ marginTop: 8 }}>
                    {group.items.map((item) => (
                      <span key={item} className="chip">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
