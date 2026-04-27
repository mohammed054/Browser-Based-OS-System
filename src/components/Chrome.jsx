import { useMemo, useState } from 'react'
import { BROWSER_PAGES, CONTACT_CHANNELS, PROJECTS, SYSTEM_METADATA } from '../data/portfolio'

function findPage(path) {
  return BROWSER_PAGES.find((page) => page.path === path)
}

function searchPages(query) {
  const normalized = query.toLowerCase()

  return BROWSER_PAGES.flatMap((page) => {
    const haystack = [
      page.title,
      page.description,
      ...page.sections.map((section) => `${section.heading} ${section.body}`)
    ].join(' ').toLowerCase()

    if (!haystack.includes(normalized)) {
      return []
    }

    return [{
      path: page.path,
      title: page.title,
      description: page.description
    }]
  })
}

const Chrome = ({ systemAPI }) => {
  const [history, setHistory] = useState(['/start'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [addressValue, setAddressValue] = useState('/start')

  const currentPath = history[historyIndex]
  const currentPage = findPage(currentPath)

  const navigate = (target) => {
    const trimmed = target.trim()
    if (!trimmed) {
      return
    }

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      window.open(trimmed, '_blank', 'noopener,noreferrer')
      systemAPI.addNotification('system', 'Opened external link in a new tab', {
        title: 'Navigator',
        duration: 1800
      })
      return
    }

    if (trimmed.includes('@') && !trimmed.startsWith('/')) {
      window.location.href = `mailto:${trimmed}`
      return
    }

    const page = findPage(trimmed)
    const nextPath = page ? trimmed : `/search?q=${encodeURIComponent(trimmed)}`
    const nextHistory = history.slice(0, historyIndex + 1)
    nextHistory.push(nextPath)
    setHistory(nextHistory)
    setHistoryIndex(nextHistory.length - 1)
    setAddressValue(nextPath)
  }

  const searchResults = useMemo(() => {
    if (!currentPath.startsWith('/search?q=')) {
      return []
    }

    const query = decodeURIComponent(currentPath.split('=')[1] || '')
    return searchPages(query)
  }, [currentPath])

  const pageSections = useMemo(() => {
    if (currentPage) {
      return currentPage.sections
    }

    if (!currentPath.startsWith('/search?q=')) {
      return []
    }

    const query = decodeURIComponent(currentPath.split('=')[1] || '')
    if (!searchResults.length) {
      return [{
        heading: 'No local results',
        body: `No local route matched "${query}". Try /projects, /skills, /contact, /resume, or an external https:// URL.`
      }]
    }

    return searchResults.map((result) => ({
      heading: result.title,
      body: `${result.description} Route: ${result.path}`
    }))
  }, [currentPage, currentPath, searchResults])

  return (
    <div className="app-shell">
      <div className="app-header" style={{ gap: 12 }}>
        <div className="button-row">
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              if (historyIndex > 0) {
                const nextIndex = historyIndex - 1
                setHistoryIndex(nextIndex)
                setAddressValue(history[nextIndex])
              }
            }}
            disabled={historyIndex === 0}
          >
            Back
          </button>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              if (historyIndex < history.length - 1) {
                const nextIndex = historyIndex + 1
                setHistoryIndex(nextIndex)
                setAddressValue(history[nextIndex])
              }
            }}
            disabled={historyIndex >= history.length - 1}
          >
            Forward
          </button>
          <button
            type="button"
            className="button secondary"
            onClick={() => setAddressValue(currentPath)}
          >
            Refresh
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            navigate(addressValue)
          }}
          style={{ flex: 1 }}
        >
          <input
            type="text"
            className="address-input"
            value={addressValue}
            onChange={(event) => setAddressValue(event.target.value)}
            placeholder="Enter /projects, /skills, /contact, or an external https:// link"
          />
        </form>
      </div>

      <div className="app-main stack">
        <div className="chip-row">
          <button type="button" className="chip" onClick={() => navigate('/start')}>/start</button>
          <button type="button" className="chip" onClick={() => navigate('/projects')}>/projects</button>
          <button type="button" className="chip" onClick={() => navigate('/skills')}>/skills</button>
          <button type="button" className="chip" onClick={() => navigate('/contact')}>/contact</button>
          <button type="button" className="chip" onClick={() => navigate('/resume')}>/resume</button>
        </div>

        <div className="panel">
          <div className="app-title-stack" style={{ marginBottom: 14 }}>
            <div className="app-eyebrow">Navigator</div>
            <div className="app-title" style={{ fontSize: '20px' }}>
              {currentPage?.title || 'Search results'}
            </div>
            <div className="app-subtitle">
              {currentPage?.description || `Local results for ${decodeURIComponent(currentPath.split('=')[1] || '')}`}
            </div>
          </div>

          <div className="stack">
            {pageSections.map((section) => (
              <div key={section.heading} className="list-row" style={{ gridTemplateColumns: '1fr' }}>
                <div className="list-title">{section.heading}</div>
                <div className="list-copy">{section.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-grid">
          <div className="panel">
            <div className="panel-title">Quick launch</div>
            <div className="button-row">
              <button type="button" className="button" onClick={() => systemAPI.openWindow('Projects')}>
                Open projects
              </button>
              <button type="button" className="button secondary" onClick={() => systemAPI.openWindow('Contact')}>
                Open contact
              </button>
              <button type="button" className="button secondary" onClick={() => systemAPI.openWindow('Resume')}>
                Open resume
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">External routes</div>
            <div className="stack" style={{ gap: 8 }}>
              {CONTACT_CHANNELS.filter((channel) => channel.href).map((channel) => (
                <button
                  key={channel.label}
                  type="button"
                  className="list-row"
                  style={{ textAlign: 'left' }}
                  onClick={() => navigate(channel.href)}
                >
                  <div>
                    <div className="list-title">{channel.label}</div>
                    <div className="list-copy">{channel.value}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">Flagship route</div>
            <div className="panel-body" style={{ marginBottom: 10 }}>
              {SYSTEM_METADATA.name} is anchored by {PROJECTS[0].title}.
            </div>
            <button type="button" className="button secondary" onClick={() => navigate('/projects')}>
              Inspect project pages
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chrome
