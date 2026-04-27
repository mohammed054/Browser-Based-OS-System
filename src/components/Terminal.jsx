import { useEffect, useMemo, useRef, useState } from 'react'
import { CONTACT_CHANNELS, PROJECTS, SKILL_GROUPS, SYSTEM_METADATA, SYSTEM_METRICS } from '../data/portfolio'

const AVAILABLE_APPS = [
  'Projects',
  'Skills',
  'Contact',
  'About',
  'Terminal',
  'Settings',
  'Calculator',
  'Chrome',
  'File Explorer',
  'Trash Bin',
  'Notes',
  'Resume',
  'ErrorLog'
]

function createInitialLines() {
  return [
    { id: 'welcome-1', type: 'system', content: `${SYSTEM_METADATA.name} ${SYSTEM_METADATA.version} (${SYSTEM_METADATA.codename})` },
    { id: 'welcome-2', type: 'output', content: SYSTEM_METADATA.summary },
    { id: 'welcome-3', type: 'hint', content: 'Type "help" for commands. Try "open projects", "theme light", or "sysinfo".' }
  ]
}

function formatList(items) {
  return items.map((item) => `- ${item}`).join('\n')
}

function normalizeAppName(input) {
  return AVAILABLE_APPS.find((app) => app.toLowerCase() === input.toLowerCase())
}

const Terminal = ({ systemAPI }) => {
  const [lines, setLines] = useState(() => createInitialLines())
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [lines])

  const promptLabel = useMemo(() => `guest@${SYSTEM_METADATA.name.toLowerCase()}:~$`, [])

  const appendLine = (type, content) => {
    setLines((prev) => [
      ...prev,
      {
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        content
      }
    ])
  }

  const handleCommand = (rawCommand) => {
    const trimmed = rawCommand.trim()
    if (!trimmed) {
      return
    }

    appendLine('input', `${promptLabel} ${trimmed}`)
    setHistory((prev) => [trimmed, ...prev.filter((entry) => entry !== trimmed)].slice(0, 30))
    setHistoryIndex(-1)

    const lower = trimmed.toLowerCase()
    const [command, ...rest] = trimmed.split(/\s+/)
    const argText = rest.join(' ').trim()

    if (lower === 'clear') {
      setLines(createInitialLines())
      return
    }

    if (lower === 'help') {
      appendLine('output', [
        'help            show commands',
        'apps            list installed apps',
        'open <app>      open an application',
        'theme <mode>    switch dark/light',
        'accent <name>   switch accent palette',
        'wallpaper <id>  switch desktop scene',
        'projects        list project summaries',
        'skills          show skill modules',
        'contact         show contact routes',
        'sysinfo         inspect the current shell',
        'cat <target>    read system notes',
        'clear           clear the terminal'
      ].join('\n'))
      return
    }

    if (lower === 'apps') {
      appendLine('output', formatList(AVAILABLE_APPS))
      return
    }

    if (command.toLowerCase() === 'open') {
      const resolved = normalizeAppName(argText)
      if (!resolved) {
        appendLine('error', `Unknown app: ${argText || '(missing name)'}`)
        return
      }
      systemAPI.openWindow(resolved)
      appendLine('success', `Opening ${resolved}`)
      return
    }

    if (command.toLowerCase() === 'theme') {
      const mode = argText.toLowerCase()
      if (!['dark', 'light'].includes(mode)) {
        appendLine('error', 'Usage: theme <dark|light>')
        return
      }
      systemAPI.updateAppearance({ mode })
      appendLine('success', `Theme switched to ${mode}`)
      return
    }

    if (command.toLowerCase() === 'accent') {
      const accent = argText.toLowerCase()
      if (!['ocean', 'ember', 'forest'].includes(accent)) {
        appendLine('error', 'Usage: accent <ocean|ember|forest>')
        return
      }
      systemAPI.updateAppearance({ accent })
      appendLine('success', `Accent switched to ${accent}`)
      return
    }

    if (command.toLowerCase() === 'wallpaper') {
      const wallpaper = argText.toLowerCase()
      if (!['architect', 'studio', 'midnight'].includes(wallpaper)) {
        appendLine('error', 'Usage: wallpaper <architect|studio|midnight>')
        return
      }
      systemAPI.updateAppearance({ wallpaper })
      appendLine('success', `Wallpaper switched to ${wallpaper}`)
      return
    }

    if (lower === 'projects') {
      appendLine('output', PROJECTS.map((project) => `${project.title} (${project.status})\n${project.summary}`).join('\n\n'))
      return
    }

    if (lower === 'skills') {
      appendLine('output', SKILL_GROUPS.map((group) => `${group.title}\n${formatList(group.skills.map((skill) => `${skill.name} ${skill.level}%`))}`).join('\n\n'))
      return
    }

    if (lower === 'contact') {
      appendLine('output', CONTACT_CHANNELS.map((channel) => `${channel.label}: ${channel.value}`).join('\n'))
      return
    }

    if (lower === 'sysinfo') {
      appendLine(
        'output',
        SYSTEM_METRICS.map((metric) => `${metric.label}: ${metric.value} - ${metric.note}`).join('\n')
      )
      return
    }

    if (command.toLowerCase() === 'cat') {
      const target = argText.toLowerCase()
      if (target === 'readme') {
        appendLine('output', SYSTEM_METADATA.summary)
        return
      }
      if (target === 'resume') {
        appendLine('output', 'Open the Resume app for the profile dossier and export actions.')
        return
      }
      if (target === 'shortcuts') {
        appendLine('output', [
          'Ctrl+Space  open launcher',
          'Ctrl+`      open terminal',
          'Ctrl+W      close active window',
          'Alt+Tab     cycle windows',
          'Ctrl+L      lock system'
        ].join('\n'))
        return
      }
      appendLine('error', `Nothing readable named "${argText}"`)
      return
    }

    if (lower === 'about') {
      appendLine('output', `${SYSTEM_METADATA.name} ${SYSTEM_METADATA.version}\n${SYSTEM_METADATA.tagline}`)
      return
    }

    if (lower === 'date') {
      appendLine('output', new Date().toString())
      return
    }

    if (lower === 'sudo rm -rf /') {
      appendLine('output', 'Nice try. This system survived a grade-school prototype phase; it can survive that too.')
      return
    }

    appendLine('error', `Command not found: ${trimmed}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleCommand(input)
    setInput('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!history.length) {
        return
      }
      const nextIndex = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex <= 0) {
        setHistoryIndex(-1)
        setInput('')
        return
      }
      const nextIndex = historyIndex - 1
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
    }
  }

  return (
    <div className="app-shell" onClick={() => inputRef.current?.focus()}>
      <div className="app-header">
        <div className="app-title-stack">
          <div className="app-eyebrow">Command Surface</div>
          <div className="app-title">Terminal</div>
          <div className="app-subtitle">Inspect the shell, launch apps, and tweak the system without leaving the keyboard.</div>
        </div>
        <div className="chip-row">
          <span className="chip">{systemAPI.appearance.mode}</span>
          <span className="chip">{systemAPI.appearance.accent}</span>
          <span className="chip">{systemAPI.appearance.wallpaper}</span>
        </div>
      </div>

      <div className="app-main" style={{ display: 'grid', gridTemplateRows: '1fr auto', minHeight: 0 }}>
        <div
          ref={scrollRef}
          className="panel"
          style={{
            minHeight: 0,
            overflow: 'auto',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(3, 8, 18, 0.92)'
          }}
        >
          <div className="stack" style={{ gap: 8 }}>
            {lines.map((line) => (
              <div
                key={line.id}
                className="code-block"
                style={{
                  color:
                    line.type === 'error'
                      ? 'var(--os-danger)'
                      : line.type === 'success'
                        ? 'var(--os-success)'
                        : line.type === 'hint'
                          ? 'var(--os-highlight)'
                          : line.type === 'input'
                            ? 'var(--os-accent)'
                            : 'var(--os-text-soft)'
                }}
              >
                {line.content}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 14 }}>
          <div
            className="panel"
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(3, 8, 18, 0.92)'
            }}
          >
            <div className="chip" style={{ fontFamily: 'var(--font-mono)' }}>{promptLabel}</div>
            <input
              ref={inputRef}
              type="text"
              className="app-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a command"
              autoFocus
              spellCheck={false}
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255,255,255,0.03)'
              }}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Terminal
