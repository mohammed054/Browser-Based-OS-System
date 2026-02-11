import { useState, useRef, useCallback, useMemo } from 'react'
import { theme } from '../../theme'
import DesktopIcon from './DesktopIcon'
import WindowFrame from './WindowFrame'

const MENU_ITEMS = [
  { id: 'new-text', label: 'New Text Document' },
  { id: 'refresh', label: 'Refresh' },
  { id: 'personalize', label: 'Personalize' },
  { id: 'display-settings', label: 'Display Settings' }
]

const Desktop = ({
  openWindow,
  icons,
  onDeleteIcon,
  onUpdateIconPosition,
  windows,
  closeWindow,
  focusWindow,
  updateWindowPosition,
  updateWindowSize,
  toggleMaximizeWindow,
  minimizeWindow,
  activeWindowId,
  addNotification,
  isFullscreen
}) => {
  const [selectedIcons, setSelectedIcons] = useState(() => new Set())
  const [selectionRect, setSelectionRect] = useState(null)
  const [selectionStart, setSelectionStart] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const desktopRef = useRef(null)

  const isIconSelected = useCallback((iconId) => selectedIcons.has(iconId), [selectedIcons])

  const handleIconOpen = useCallback((icon) => {
    openWindow(icon.label)
  }, [openWindow])

  const handleIconContextMenu = useCallback((event, icon) => {
    event.preventDefault()
    if (window.confirm(`Delete ${icon.label}?`)) {
      onDeleteIcon?.(icon.id)
    }
  }, [onDeleteIcon])

  const handleDesktopMouseDown = useCallback((event) => {
    if (event.button !== 0) {
      return
    }

    const isDesktopClick = event.target === event.currentTarget || event.target.classList.contains('desktop-icons')
    if (!isDesktopClick) {
      return
    }

    if (contextMenu) {
      setContextMenu(null)
    }

    const rect = desktopRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const start = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }

    if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      setSelectedIcons(new Set())
    }

    setSelectionStart(start)
    setSelectionRect({ x: start.x, y: start.y, width: 0, height: 0 })
  }, [contextMenu])

  const handleDesktopMouseMove = useCallback((event) => {
    if (!selectionStart || !desktopRef.current) {
      return
    }

    const rect = desktopRef.current.getBoundingClientRect()
    const currentX = event.clientX - rect.left
    const currentY = event.clientY - rect.top

    const x = Math.min(selectionStart.x, currentX)
    const y = Math.min(selectionStart.y, currentY)
    const width = Math.abs(currentX - selectionStart.x)
    const height = Math.abs(currentY - selectionStart.y)

    setSelectionRect({ x, y, width, height })

    const selected = new Set()
    icons.forEach(icon => {
      const iconLeft = icon.x
      const iconRight = icon.x + parseInt(theme.dimensions.iconSize, 10)
      const iconTop = icon.y
      const iconBottom = icon.y + parseInt(theme.dimensions.iconSize, 10)

      const overlaps = !(iconRight < x || iconLeft > x + width || iconBottom < y || iconTop > y + height)
      if (overlaps) {
        selected.add(icon.id)
      }
    })

    setSelectedIcons(selected)
  }, [selectionStart, icons])

  const handleDesktopMouseUp = useCallback(() => {
    setSelectionStart(null)
    setSelectionRect(null)
  }, [])

  const handleDesktopContextMenu = useCallback((event) => {
    event.preventDefault()

    const rect = desktopRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const menuWidth = 240
    const menuHeight = 220
    const padding = 8

    const maxX = Math.max(padding, rect.width - menuWidth - padding)
    const maxY = Math.max(padding, rect.height - menuHeight - padding)

    const x = Math.min(Math.max(padding, event.clientX - rect.left), maxX)
    const y = Math.min(Math.max(padding, event.clientY - rect.top), maxY)

    setContextMenu({ x, y })
  }, [])

  const handleContextAction = useCallback((action) => {
    switch (action) {
      case 'new-text':
        openWindow('Notes')
        break
      case 'refresh':
        window.location.reload()
        break
      case 'personalize':
        openWindow('Settings')
        break
      case 'display-settings':
        addNotification?.('system', 'Display settings are not implemented yet', {
          title: 'Settings',
          duration: 2500
        })
        break
      default:
        break
    }

    setContextMenu(null)
  }, [openWindow, addNotification])

  const windowElements = useMemo(() => windows.map(windowState => (
    <WindowFrame
      key={windowState.id}
      id={windowState.id}
      title={windowState.title}
      x={windowState.x}
      y={windowState.y}
      width={windowState.width}
      height={windowState.height}
      maximized={windowState.maximized}
      minimized={windowState.minimized}
      isActive={activeWindowId === windowState.id}
      isCalculator={windowState.isCalculator}
      onClose={() => closeWindow(windowState.id)}
      onFocus={() => focusWindow(windowState.id)}
      onPositionChange={updateWindowPosition}
      onSizeChange={updateWindowSize}
      onToggleMaximize={() => toggleMaximizeWindow(windowState.id)}
      onMinimize={() => minimizeWindow(windowState.id)}
    >
      {windowState.children}
    </WindowFrame>
  )), [windows, activeWindowId, closeWindow, focusWindow, updateWindowPosition, updateWindowSize, toggleMaximizeWindow, minimizeWindow])

  return (
    <div
      className="desktop"
      ref={desktopRef}
      onMouseDown={handleDesktopMouseDown}
      onMouseMove={handleDesktopMouseMove}
      onMouseUp={handleDesktopMouseUp}
      onContextMenu={handleDesktopContextMenu}
      onClick={() => contextMenu && setContextMenu(null)}
      style={{
        position: 'relative',
        width: '100vw',
        height: 'calc(100vh - 48px)',
        backgroundColor: theme.colors.background,
        background: 'url("/images/wallpaper.png") center/cover no-repeat',
        overflow: 'hidden',
        zIndex: isFullscreen ? -1 : 0
      }}
    >
      <div className="desktop-icons" style={{ position: 'relative', width: '100%', height: '100%' }}>
        {icons.map(icon => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            src={icon.src}
            label={icon.label}
            type={icon.type}
            x={icon.x}
            y={icon.y}
            isSelected={isIconSelected(icon.id)}
            onDoubleClick={() => handleIconOpen(icon)}
            onContextMenu={(event) => handleIconContextMenu(event, icon)}
            onUpdatePosition={onUpdateIconPosition}
            onSelectionChange={setSelectedIcons}
            allIcons={icons}
            selectedIcons={selectedIcons}
          />
        ))}
      </div>

      {selectionRect && (
        <div
          className="selection-rectangle"
          style={{
            position: 'absolute',
            left: selectionRect.x,
            top: selectionRect.y,
            width: selectionRect.width,
            height: selectionRect.height,
            border: `1px solid ${theme.colors.accentPrimary}`,
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            pointerEvents: 'none',
            zIndex: theme.zIndex.overlay
          }}
        />
      )}

      {contextMenu && (
        <div
          className="context-menu"
          style={{
            position: 'absolute',
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: theme.colors.panel,
            border: `1px solid ${theme.colors.accentPrimary}55`,
            borderRadius: theme.dimensions.windowBorderRadius,
            padding: theme.spacing.xs,
            boxShadow: '0 16px 35px rgba(0, 0, 0, 0.45)',
            zIndex: theme.zIndex.contextMenu,
            minWidth: '220px'
          }}
        >
          {MENU_ITEMS.map(item => (
            <div
              key={item.id}
              className="context-menu-item"
              onClick={() => handleContextAction(item.id)}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                cursor: 'pointer',
                borderRadius: theme.dimensions.buttonBorderRadius,
                color: theme.colors.textPrimary
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}

      {windowElements}
    </div>
  )
}

export default Desktop
