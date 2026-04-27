import { useEffect, useState } from 'react'
import { CONTACT_CHANNELS } from '../data/portfolio'
import { PROFILE } from '../config/profile'
import { readStorage, writeStorage } from '../utils/storage'

const EMPTY_DRAFT = {
  name: '',
  email: '',
  subject: '',
  message: ''
}

const Contact = ({ systemAPI }) => {
  const [draft, setDraft] = useState(() => readStorage('contact-draft', EMPTY_DRAFT))

  useEffect(() => {
    writeStorage('contact-draft', draft)
  }, [draft])

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const subject = encodeURIComponent(draft.subject || `Hello ${PROFILE.firstName}`)
    const body = encodeURIComponent([
      `Name: ${draft.name}`,
      `Email: ${draft.email}`,
      '',
      draft.message
    ].join('\n'))

    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`
    systemAPI.addNotification('success', 'Draft opened in your mail app', {
      title: 'Contact',
      duration: 2000
    })
  }

  const copyValue = async (label, value) => {
    if (!navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(value)
    systemAPI.addNotification('success', `${label} copied`, {
      title: 'Contact',
      duration: 1600
    })
  }

  const isValid = draft.name.trim() && draft.email.trim() && draft.message.trim()

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-title-stack">
          <div className="app-eyebrow">Reach Out</div>
          <div className="app-title">Contact</div>
          <div className="app-subtitle">Use the quick routes or prepare a clean intro email without leaving the OS.</div>
        </div>
      </div>

      <div className="app-main" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 16 }}>
        <div className="stack">
          {CONTACT_CHANNELS.map((channel) => (
            <div key={channel.label} className="panel">
              <div className="panel-title">{channel.label}</div>
              <div className="panel-body" style={{ marginBottom: 12 }}>{channel.note}</div>
              <div className="chip-row">
                <span className="chip">{channel.value}</span>
                {channel.href && (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => {
                      if (channel.href.startsWith('mailto:')) {
                        window.location.href = channel.href
                      } else {
                        window.open(channel.href, '_blank', 'noopener,noreferrer')
                      }
                    }}
                  >
                    Open
                  </button>
                )}
                <button type="button" className="button secondary" onClick={() => copyValue(channel.label, channel.value)}>
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        <form className="panel stack" onSubmit={handleSubmit}>
          <div className="panel-title">Email draft</div>
          <div className="panel-body">This creates a real email draft in your default mail app. No fake form submission layer.</div>

          <input
            type="text"
            className="app-input"
            placeholder="Your name"
            value={draft.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
          <input
            type="email"
            className="app-input"
            placeholder="Your email"
            value={draft.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
          <input
            type="text"
            className="app-input"
            placeholder="Subject"
            value={draft.subject}
            onChange={(event) => updateField('subject', event.target.value)}
          />
          <textarea
            className="app-textarea"
            placeholder="Message"
            value={draft.message}
            onChange={(event) => updateField('message', event.target.value)}
            style={{ minHeight: 220 }}
          />

          <div className="button-row">
            <button type="submit" className="button" disabled={!isValid}>
              Open email draft
            </button>
            <button type="button" className="button ghost" onClick={() => setDraft(EMPTY_DRAFT)}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact
