import { useEffect, useMemo, useState } from 'react'
import { createDefaultExplorerTree } from '../data/portfolio'
import { readStorage, writeStorage } from '../utils/storage'

function cloneNode(node) {
  return {
    ...node,
    children: node.children ? node.children.map(cloneNode) : []
  }
}

function findNode(root, id, path = []) {
  if (root.id === id) {
    return {
      node: root,
      path: [...path, root]
    }
  }

  if (root.type !== 'folder') {
    return null
  }

  for (const child of root.children) {
    const result = findNode(child, id, [...path, root])
    if (result) {
      return result
    }
  }

  return null
}

function updateNode(root, id, updater) {
  if (root.id === id) {
    return updater(cloneNode(root))
  }

  if (root.type !== 'folder') {
    return root
  }

  return {
    ...root,
    children: root.children.map((child) => updateNode(child, id, updater))
  }
}

function removeNode(root, id) {
  if (root.type !== 'folder') {
    return { tree: root, removed: null }
  }

  let removed = null
  const nextChildren = []

  for (const child of root.children) {
    if (child.id === id) {
      removed = child
      continue
    }

    const result = removeNode(child, id)
    if (result.removed) {
      removed = result.removed
      nextChildren.push(result.tree)
    } else {
      nextChildren.push(child)
    }
  }

  return {
    tree: {
      ...root,
      children: nextChildren
    },
    removed
  }
}

function duplicateNode(node) {
  return {
    ...node,
    id: `${node.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    updatedAt: new Date().toISOString(),
    children: node.children ? node.children.map(duplicateNode) : []
  }
}

function createExplorerId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function ensureUniqueName(children, desiredName) {
  const existingNames = new Set(children.map((child) => child.name.toLowerCase()))
  if (!existingNames.has(desiredName.toLowerCase())) {
    return desiredName
  }

  const lastDotIndex = desiredName.lastIndexOf('.')
  const hasExtension = lastDotIndex > 0
  const baseName = hasExtension ? desiredName.slice(0, lastDotIndex) : desiredName
  const extension = hasExtension ? desiredName.slice(lastDotIndex) : ''

  let counter = 2
  let candidate = `${baseName} ${counter}${extension}`

  while (existingNames.has(candidate.toLowerCase())) {
    counter += 1
    candidate = `${baseName} ${counter}${extension}`
  }

  return candidate
}

function formatNodeMeta(node) {
  if (node.type === 'folder') {
    return `${node.children.length} item${node.children.length === 1 ? '' : 's'}`
  }

  if (node.content) {
    return `${node.content.length} characters`
  }

  return node.size || '--'
}

const FileExplorer = ({ systemAPI }) => {
  const [tree, setTree] = useState(() => readStorage('explorer-tree', createDefaultExplorerTree()))
  const [currentFolderId, setCurrentFolderId] = useState(() => readStorage('explorer-current-folder', 'workspace-root'))
  const [selectedId, setSelectedId] = useState(null)
  const [clipboardNode, setClipboardNode] = useState(null)

  useEffect(() => {
    writeStorage('explorer-tree', tree)
  }, [tree])

  useEffect(() => {
    writeStorage('explorer-current-folder', currentFolderId)
  }, [currentFolderId])

  const currentFolderResult = findNode(tree, currentFolderId) ?? findNode(tree, 'workspace-root')
  const currentFolder = currentFolderResult?.node ?? tree
  const currentPath = currentFolderResult?.path ?? [tree]
  const selectedNode = selectedId ? findNode(tree, selectedId)?.node ?? null : null

  const shortcuts = useMemo(() => {
    const portfolio = tree.children.find((child) => child.name === 'Portfolio')
    const notes = tree.children.find((child) => child.name === 'Notes')
    const system = tree.children.find((child) => child.name === 'System')

    return [
      { id: tree.id, label: 'Workspace' },
      portfolio ? { id: portfolio.id, label: 'Portfolio' } : null,
      notes ? { id: notes.id, label: 'Notes' } : null,
      system ? { id: system.id, label: 'System' } : null
    ].filter(Boolean)
  }, [tree])

  const createFolder = () => {
    const nextFolderName = ensureUniqueName(currentFolder.children, 'New Folder')
    const nextNode = {
      id: createExplorerId('folder'),
      name: nextFolderName,
      type: 'folder',
      updatedAt: new Date().toISOString(),
      children: []
    }

    setTree((prev) => updateNode(prev, currentFolder.id, (folder) => ({
      ...folder,
      children: [...folder.children, nextNode]
    })))
    setSelectedId(nextNode.id)
    systemAPI.addNotification('success', `${nextFolderName} created`, {
      title: 'Explorer',
      duration: 1600
    })
  }

  const createFile = () => {
    const nextName = ensureUniqueName(currentFolder.children, 'draft.md')
    const nextNode = {
      id: createExplorerId('file'),
      name: nextName,
      type: 'file',
      extension: 'md',
      content: '# New draft\n\nStart writing here.',
      updatedAt: new Date().toISOString()
    }

    setTree((prev) => updateNode(prev, currentFolder.id, (folder) => ({
      ...folder,
      children: [...folder.children, nextNode]
    })))
    setSelectedId(nextNode.id)
    systemAPI.addNotification('success', `${nextName} created`, {
      title: 'Explorer',
      duration: 1600
    })
  }

  const renameSelected = () => {
    if (!selectedNode) {
      return
    }

    const proposedName = window.prompt('Rename item', selectedNode.name)
    if (!proposedName || proposedName.trim() === selectedNode.name) {
      return
    }

    const uniqueName = ensureUniqueName(currentFolder.children.filter((child) => child.id !== selectedNode.id), proposedName.trim())
    setTree((prev) => updateNode(prev, selectedNode.id, (node) => ({
      ...node,
      name: uniqueName,
      updatedAt: new Date().toISOString()
    })))
  }

  const deleteSelected = () => {
    if (!selectedNode || selectedNode.id === tree.id) {
      return
    }

    setTree((prev) => removeNode(prev, selectedNode.id).tree)
    setSelectedId(null)
    systemAPI.addNotification('system', `${selectedNode.name} deleted`, {
      title: 'Explorer',
      duration: 1600
    })
  }

  const copySelected = () => {
    if (!selectedNode) {
      return
    }

    setClipboardNode(duplicateNode(selectedNode))
    systemAPI.addNotification('success', `${selectedNode.name} copied`, {
      title: 'Explorer',
      duration: 1600
    })
  }

  const pasteIntoCurrentFolder = () => {
    if (!clipboardNode || currentFolder.type !== 'folder') {
      return
    }

    const nextNode = duplicateNode(clipboardNode)
    nextNode.name = ensureUniqueName(currentFolder.children, nextNode.name)

    setTree((prev) => updateNode(prev, currentFolder.id, (folder) => ({
      ...folder,
      children: [...folder.children, nextNode]
    })))
    setSelectedId(nextNode.id)
  }

  const handleItemOpen = (node) => {
    if (node.type === 'folder') {
      setCurrentFolderId(node.id)
      setSelectedId(null)
      return
    }

    setSelectedId(node.id)
  }

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-title-stack">
          <div className="app-eyebrow">Workspace</div>
          <div className="app-title">File Explorer</div>
          <div className="app-subtitle">A persistent project workspace for portfolio docs, notes, and system files.</div>
        </div>

        <div className="button-row">
          <button type="button" className="button" onClick={createFolder}>
            New folder
          </button>
          <button type="button" className="button secondary" onClick={createFile}>
            New file
          </button>
          <button type="button" className="button secondary" onClick={copySelected} disabled={!selectedNode}>
            Copy
          </button>
          <button type="button" className="button secondary" onClick={pasteIntoCurrentFolder} disabled={!clipboardNode}>
            Paste
          </button>
          <button type="button" className="button secondary" onClick={renameSelected} disabled={!selectedNode}>
            Rename
          </button>
          <button type="button" className="button danger" onClick={deleteSelected} disabled={!selectedNode}>
            Delete
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px minmax(0, 1.2fr) minmax(280px, 0.8fr)',
          minHeight: 0,
          flex: 1
        }}
      >
        <aside className="app-sidebar" style={{ borderRight: '1px solid var(--os-border)' }}>
          <div className="panel" style={{ marginBottom: 14 }}>
            <div className="panel-title">Quick access</div>
            <div className="stack" style={{ gap: 8 }}>
              {shortcuts.map((shortcut) => (
                <button
                  key={shortcut.id}
                  type="button"
                  className={`segmented-button ${currentFolderId === shortcut.id ? 'active' : ''}`}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  onClick={() => {
                    setCurrentFolderId(shortcut.id)
                    setSelectedId(null)
                  }}
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">Current path</div>
            <div className="panel-body">{currentPath.map((segment) => segment.name).join(' / ')}</div>
          </div>
        </aside>

        <main className="app-main" style={{ borderRight: '1px solid var(--os-border)' }}>
          <div className="chip-row" style={{ marginBottom: 16 }}>
            {currentPath.map((segment) => (
              <button
                key={segment.id}
                type="button"
                className={`chip ${segment.id === currentFolder.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentFolderId(segment.id)
                  setSelectedId(null)
                }}
              >
                {segment.name}
              </button>
            ))}
          </div>

          <div className="list-table">
            {currentFolder.children.length === 0 ? (
              <div className="empty-state">
                <div className="app-title" style={{ fontSize: '18px' }}>This folder is empty</div>
                <div className="muted">Create a new folder or file to start expanding the workspace.</div>
              </div>
            ) : (
              currentFolder.children.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className={`list-row ${selectedNode?.id === node.id ? 'active' : ''}`}
                  style={{ textAlign: 'left' }}
                  onClick={() => setSelectedId(node.id)}
                  onDoubleClick={() => handleItemOpen(node)}
                >
                  <div>
                    <div className="list-title">{node.type === 'folder' ? 'Folder' : 'File'} - {node.name}</div>
                    <div className="list-copy">{formatNodeMeta(node)}</div>
                  </div>
                  <div className="section-label">
                    {new Date(node.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </button>
              ))
            )}
          </div>
        </main>

        <aside className="app-main">
          {!selectedNode ? (
            <div className="empty-state">
              <div className="app-title" style={{ fontSize: '18px' }}>Select an item</div>
              <div className="muted">Preview metadata and contents here.</div>
            </div>
          ) : (
            <div className="stack">
              <div className="panel">
                <div className="panel-title">{selectedNode.name}</div>
                <div className="chip-row" style={{ marginBottom: 10 }}>
                  <span className="chip">{selectedNode.type}</span>
                  <span className="chip">{formatNodeMeta(selectedNode)}</span>
                </div>
                <div className="panel-body">
                  Updated {new Date(selectedNode.updatedAt).toLocaleString()}
                </div>
              </div>

              <div className="panel" style={{ minHeight: 280 }}>
                <div className="panel-title">Preview</div>
                {selectedNode.type === 'folder' ? (
                  <div className="panel-body">
                    This folder contains {selectedNode.children.length} item{selectedNode.children.length === 1 ? '' : 's'}.
                  </div>
                ) : (
                  <div className="code-block">{selectedNode.content || 'Empty file'}</div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default FileExplorer
