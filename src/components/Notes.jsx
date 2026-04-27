import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_NOTES } from '../data/portfolio'
import { readStorage, writeStorage } from '../utils/storage'

function formatUpdatedAt(value) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function createNote(title = 'Untitled note') {
  const timestamp = new Date().toISOString()
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    content: '',
    pinned: false,
    updatedAt: timestamp
  }
}

const Notes = ({ systemAPI }) => {
  const [notes, setNotes] = useState(() => readStorage('notes-docs', DEFAULT_NOTES))
  const [activeNoteId, setActiveNoteId] = useState(() => readStorage('notes-active-id', DEFAULT_NOTES[0]?.id ?? null))
  const [query, setQuery] = useState('')

  useEffect(() => {
    writeStorage('notes-docs', notes)
  }, [notes])

  useEffect(() => {
    writeStorage('notes-active-id', activeNoteId)
  }, [activeNoteId])

  const filteredNotes = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const sorted = [...notes].sort((left, right) => {
      if (left.pinned !== right.pinned) {
        return left.pinned ? -1 : 1
      }
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    })

    if (!normalized) {
      return sorted
    }

    return sorted.filter((note) => (
      note.title.toLowerCase().includes(normalized) || note.content.toLowerCase().includes(normalized)
    ))
  }, [notes, query])

  const resolvedActiveNoteId = notes.some((note) => note.id === activeNoteId)
    ? activeNoteId
    : notes[0]?.id ?? null

  const activeNote = notes.find((note) => note.id === resolvedActiveNoteId) ?? filteredNotes[0] ?? null

  const updateNote = (id, patch) => {
    setNotes((prev) => prev.map((note) => (
      note.id === id
        ? {
            ...note,
            ...patch,
            updatedAt: new Date().toISOString()
          }
        : note
    )))
  }

  const handleCreateNote = () => {
    const newNote = createNote(`Note ${notes.length + 1}`)
    setNotes((prev) => [newNote, ...prev])
    setActiveNoteId(newNote.id)
    systemAPI.addNotification('success', 'New note created', {
      title: 'Notes',
      duration: 1600
    })
  }

  const handleDuplicateNote = () => {
    if (!activeNote) {
      return
    }

    const duplicate = {
      ...createNote(`${activeNote.title} copy`),
      content: activeNote.content
    }

    setNotes((prev) => [duplicate, ...prev])
    setActiveNoteId(duplicate.id)
    systemAPI.addNotification('success', 'Note duplicated', {
      title: 'Notes',
      duration: 1600
    })
  }

  const handleDeleteNote = () => {
    if (!activeNote) {
      return
    }

    setNotes((prev) => prev.filter((note) => note.id !== activeNote.id))
    const next = notes.find((note) => note.id !== activeNote.id)
    setActiveNoteId(next?.id ?? null)
    systemAPI.addNotification('system', `"${activeNote.title}" removed`, {
      title: 'Notes',
      duration: 1600
    })
  }

  const handleCopyNote = async () => {
    if (!activeNote || !navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(`# ${activeNote.title}\n\n${activeNote.content}`)
    systemAPI.addNotification('success', 'Note copied to clipboard', {
      title: 'Notes',
      duration: 1800
    })
  }

  const activeWordCount = activeNote?.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0
  const activeCharCount = activeNote?.content.length ?? 0

  return (
    <div className="app-shell app-shell--split">
      <aside className="app-sidebar">
        <div className="app-title-stack" style={{ marginBottom: 18 }}>
          <div className="app-eyebrow">Workspace</div>
          <div className="app-title">Notes</div>
          <div className="app-subtitle">Autosaved writing space for ideas, commands, and project planning.</div>
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <input
            type="search"
            className="search-input"
            placeholder="Search notes"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="button-row">
            <button type="button" className="button" onClick={handleCreateNote}>
              New note
            </button>
            <button type="button" className="button secondary" onClick={handleDuplicateNote} disabled={!activeNote}>
              Duplicate
            </button>
          </div>

          <div className="list-table">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                className={`list-row ${resolvedActiveNoteId === note.id ? 'active' : ''}`}
                onClick={() => setActiveNoteId(note.id)}
                style={{ textAlign: 'left', background: resolvedActiveNoteId === note.id ? 'var(--os-accent-soft)' : undefined }}
              >
                <div>
                  <div className="list-title">
                    {note.pinned ? 'Pinned - ' : ''}
                    {note.title || 'Untitled'}
                  </div>
                  <div className="list-copy">
                    {(note.content || 'Empty note').slice(0, 72)}
                  </div>
                </div>
                <div className="section-label">{formatUpdatedAt(note.updatedAt)}</div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="app-main">
        {!activeNote ? (
          <div className="empty-state">
            <div className="app-title" style={{ fontSize: '18px' }}>No note selected</div>
            <div className="muted">Create a note to start capturing ideas.</div>
            <button type="button" className="button" onClick={handleCreateNote}>
              Create first note
            </button>
          </div>
        ) : (
          <div className="stack">
            <div className="app-toolbar" style={{ justifyContent: 'space-between' }}>
              <div className="chip-row">
                <span className="chip">{formatUpdatedAt(activeNote.updatedAt)}</span>
                <span className="chip">{activeWordCount} words</span>
                <span className="chip">{activeCharCount} chars</span>
              </div>

              <div className="button-row">
                <button
                  type="button"
                  className={`button ${activeNote.pinned ? '' : 'secondary'}`}
                  onClick={() => updateNote(activeNote.id, { pinned: !activeNote.pinned })}
                >
                  {activeNote.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button type="button" className="button secondary" onClick={handleCopyNote}>
                  Copy
                </button>
                <button type="button" className="button danger" onClick={handleDeleteNote}>
                  Delete
                </button>
              </div>
            </div>

            <div className="panel">
              <input
                type="text"
                className="app-input"
                value={activeNote.title}
                onChange={(event) => updateNote(activeNote.id, { title: event.target.value })}
                placeholder="Note title"
                style={{ marginBottom: 12 }}
              />
              <textarea
                className="app-textarea"
                value={activeNote.content}
                onChange={(event) => updateNote(activeNote.id, { content: event.target.value })}
                placeholder="Write anything here. Notes save automatically."
                style={{ minHeight: '360px' }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Notes
