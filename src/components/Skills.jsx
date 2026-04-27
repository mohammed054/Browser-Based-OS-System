import { SKILL_GROUPS } from '../data/portfolio'

const Skills = ({ systemAPI }) => {
  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-title-stack">
          <div className="app-eyebrow">Capability Map</div>
          <div className="app-title">Skills</div>
          <div className="app-subtitle">The mix here is intentional: frontend systems, product craft, and platform thinking.</div>
        </div>

        <div className="button-row">
          <button type="button" className="button" onClick={() => systemAPI.openWindow('Projects')}>
            Pair with projects
          </button>
          <button type="button" className="button secondary" onClick={() => systemAPI.openWindow('Resume')}>
            View dossier
          </button>
        </div>
      </div>

      <div className="app-main stack">
        {SKILL_GROUPS.map((group) => (
          <div key={group.id} className="panel">
            <div className="panel-title">{group.title}</div>
            <div className="panel-body" style={{ marginBottom: 14 }}>{group.description}</div>

            <div className="stack" style={{ gap: 10 }}>
              {group.skills.map((skill) => (
                <div key={skill.name} className="list-row" style={{ gridTemplateColumns: 'minmax(0, 1fr) 88px' }}>
                  <div>
                    <div className="list-title">{skill.name}</div>
                    <div
                      style={{
                        marginTop: 8,
                        height: 10,
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.06)',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${skill.level}%`,
                          height: '100%',
                          borderRadius: 999,
                          background: 'linear-gradient(90deg, var(--os-accent-strong), var(--os-highlight))'
                        }}
                      />
                    </div>
                  </div>
                  <div className="metric-value" style={{ fontSize: '18px', alignSelf: 'center' }}>{skill.level}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills
