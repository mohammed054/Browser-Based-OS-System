import { useState } from 'react'
import { PROJECTS } from '../data/portfolio'

const Projects = ({ systemAPI }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0]?.id ?? null)

  const selectedProject = PROJECTS.find((project) => project.id === selectedProjectId) ?? PROJECTS[0]

  const copySummary = async () => {
    if (!selectedProject || !navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(`${selectedProject.title}\n\n${selectedProject.summary}\n\n${selectedProject.outcome}`)
    systemAPI.addNotification('success', 'Project summary copied', {
      title: 'Projects',
      duration: 1800
    })
  }

  return (
    <div className="app-shell app-shell--split">
      <aside className="app-sidebar">
        <div className="app-title-stack" style={{ marginBottom: 18 }}>
          <div className="app-eyebrow">Case Studies</div>
          <div className="app-title">Projects</div>
          <div className="app-subtitle">A closer look at the flagship build and the systems inside it.</div>
        </div>

        <div className="list-table">
          {PROJECTS.map((project) => (
            <button
              key={project.id}
              type="button"
              className={`list-row ${selectedProject?.id === project.id ? 'active' : ''}`}
              style={{ textAlign: 'left' }}
              onClick={() => setSelectedProjectId(project.id)}
            >
              <div>
                <div className="list-title">{project.title}</div>
                <div className="list-copy">{project.summary}</div>
              </div>
              <div className="section-label">{project.status}</div>
            </button>
          ))}
        </div>
      </aside>

      <main className="app-main">
        {selectedProject && (
          <div className="stack">
            <div className="panel">
              <div className="app-title-stack" style={{ marginBottom: 14 }}>
                <div className="app-eyebrow">{selectedProject.year}</div>
                <div className="app-title">{selectedProject.title}</div>
                <div className="app-subtitle">{selectedProject.summary}</div>
              </div>

              <div className="chip-row" style={{ marginBottom: 14 }}>
                <span className="status-badge">{selectedProject.status}</span>
                {selectedProject.stack.map((item) => (
                  <span key={item} className="chip">{item}</span>
                ))}
              </div>

              <div className="panel-body">{selectedProject.outcome}</div>
            </div>

            <div className="metric-grid">
              <div className="panel">
                <div className="panel-title">Focus areas</div>
                <div className="stack" style={{ gap: 8 }}>
                  {selectedProject.focus.map((item) => (
                    <div key={item} className="list-row" style={{ gridTemplateColumns: '1fr' }}>
                      <div className="list-title">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">Signals</div>
                <div className="stack" style={{ gap: 8 }}>
                  {selectedProject.metrics.map((metric) => (
                    <div key={metric} className="list-row" style={{ gridTemplateColumns: '1fr' }}>
                      <div className="list-copy">{metric}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="button-row">
              <button type="button" className="button" onClick={copySummary}>
                Copy summary
              </button>
              <button type="button" className="button secondary" onClick={() => systemAPI.openWindow('Terminal')}>
                Discuss in terminal
              </button>
              <button type="button" className="button secondary" onClick={() => systemAPI.openWindow('Contact')}>
                Contact route
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Projects
