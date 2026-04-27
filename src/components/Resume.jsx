import { RESUME_DOSSIER } from '../data/portfolio'
import { PROFILE } from '../config/profile'

function downloadProfile() {
  const content = [
    PROFILE.name,
    PROFILE.title,
    PROFILE.location,
    PROFILE.email,
    PROFILE.github,
    PROFILE.linkedin,
    '',
    'Summary',
    RESUME_DOSSIER.summary,
    '',
    'Strengths',
    ...RESUME_DOSSIER.strengths.map((item) => `- ${item}`),
    '',
    'Proof',
    ...RESUME_DOSSIER.proof.map((item) => `- ${item}`),
    '',
    'Next step',
    RESUME_DOSSIER.nextStep
  ].join('\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${PROFILE.firstName.toLowerCase()}-profile-dossier.txt`
  anchor.click()
  URL.revokeObjectURL(url)
}

const Resume = ({ systemAPI }) => {
  const copySummary = async () => {
    if (!navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(RESUME_DOSSIER.summary)
    systemAPI.addNotification('success', 'Summary copied', {
      title: 'Resume',
      duration: 1600
    })
  }

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-title-stack">
          <div className="app-eyebrow">Profile Dossier</div>
          <div className="app-title">Resume</div>
          <div className="app-subtitle">{RESUME_DOSSIER.headline}</div>
        </div>

        <div className="button-row">
          <button type="button" className="button" onClick={downloadProfile}>
            Download text version
          </button>
          <button type="button" className="button secondary" onClick={copySummary}>
            Copy summary
          </button>
        </div>
      </div>

      <div className="app-main stack">
        <div className="panel">
          <div className="panel-title">Summary</div>
          <div className="panel-body">{RESUME_DOSSIER.summary}</div>
        </div>

        <div className="panel-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="panel">
            <div className="panel-title">Strengths</div>
            <div className="stack">
              {RESUME_DOSSIER.strengths.map((item) => (
                <div key={item} className="list-row" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="list-copy">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">Proof points</div>
            <div className="stack">
              {RESUME_DOSSIER.proof.map((item) => (
                <div key={item} className="list-row" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="list-copy">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Next step</div>
          <div className="panel-body">{RESUME_DOSSIER.nextStep}</div>
        </div>
      </div>
    </div>
  )
}

export default Resume
