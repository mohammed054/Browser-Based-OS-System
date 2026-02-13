import { useState, useRef, useEffect, useCallback } from 'react'
import { createWindowStyle, theme } from '../../theme'

const MIN_WINDOW_WIDTH = 260
const MIN_WINDOW_HEIGHT = 180

function getDesktopRect(frameRef) {
  const desktop = frameRef.current?.closest('.desktop')
  if (desktop) {
    return desktop.getBoundingClientRect()
  }

  return {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: Math.max(320, window.innerHeight - 48)
  }
}

function clampPosition(position, size, desktopRect) {
  // Validate all inputs to prevent NaN values
  const safePositionX = Number.isFinite(position.x) ? position.x : 0
  const safePositionY = Number.isFinite(position.y) ? position.y : 0
  const safeWidth = Number.isFinite(size.width) && size.width > 0 ? size.width : 260
  const safeHeight = Number.isFinite(size.height) && size.height > 0 ? size.height : 180
  const safeDesktopWidth = Number.isFinite(desktopRect.width) && desktopRect.width > 0 ? desktopRect.width : 1280
  const safeDesktopHeight = Number.isFinite(desktopRect.height) && desktopRect.height > 0 ? desktopRect.height : 720

  return {
    x: Math.max(0, Math.min(safePositionX, Math.max(0, safeDesktopWidth - safeWidth))),
    y: Math.max(0, Math.min(safePositionY, Math.max(0, safeDesktopHeight - safeHeight)))
  }
}

const WindowFrame = ({
  title,
  children,
  x,
  y,
  width,
  height,
  maximized,
  minimized,
  id,
  onClose,
  onFocus,
  onPositionChange,
  onSizeChange,
  onToggleMaximize,
  onMinimize,
  isActive,
  isCalculator = false,
  adaptiveScale = false
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const frameRef = useRef(null)
  const dragRef = useRef(null)
  const resizeRef = useRef(null)

  useEffect(() => {
    let mountRaf = requestAnimationFrame(() => setIsMounted(true))
    return () => cancelAnimationFrame(mountRaf)
  }, [])

  const stopDragging = useCallback(() => {
    dragRef.current = null
    setIsDragging(false)
  }, [])

  const stopResizing = useCallback(() => {
    resizeRef.current = null
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (!isDragging && !isResizing) {
      return undefined
    }

    const handleMouseMove = (event) => {
      if (dragRef.current) {
        const desktopRect = getDesktopRect(frameRef)
        const nextPosition = {
          x: event.clientX - dragRef.current.offsetX,
          y: event.clientY - dragRef.current.offsetY
        }

        const clamped = clampPosition(nextPosition, { width, height }, desktopRect)
        onPositionChange(id, clamped.x, clamped.y)
        return
      }

      if (!resizeRef.current) {
        return
      }

      const desktopRect = getDesktopRect(frameRef)
      const resizeState = resizeRef.current

      const deltaX = event.clientX - resizeState.startClientX
      const deltaY = event.clientY - resizeState.startClientY

      let nextX = resizeState.startX
      let nextY = resizeState.startY
      let nextWidth = resizeState.startWidth
      let nextHeight = resizeState.startHeight

      if (resizeState.direction.includes('e')) {
        nextWidth = resizeState.startWidth + deltaX
      }

      if (resizeState.direction.includes('s')) {
        nextHeight = resizeState.startHeight + deltaY
      }

      if (resizeState.direction.includes('w')) {
        nextWidth = resizeState.startWidth - deltaX
        nextX = resizeState.startX + deltaX
      }

      if (resizeState.direction.includes('n')) {
        nextHeight = resizeState.startHeight - deltaY
        nextY = resizeState.startY + deltaY
      }

      nextWidth = Math.max(MIN_WINDOW_WIDTH, nextWidth)
      nextHeight = Math.max(MIN_WINDOW_HEIGHT, nextHeight)

      if (nextX < 0) {
        nextWidth += nextX
        nextX = 0
      }

      if (nextY < 0) {
        nextHeight += nextY
        nextY = 0
      }

      nextWidth = Math.min(nextWidth, desktopRect.width - nextX)
      nextHeight = Math.min(nextHeight, desktopRect.height - nextY)

      onPositionChange(id, nextX, nextY)
      onSizeChange(id, nextWidth, nextHeight)
    }

    const handleMouseUp = () => {
      stopDragging()
      stopResizing()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [height, id, isDragging, isResizing, onPositionChange, onSizeChange, stopDragging, stopResizing, width])

  const handleTitlebarMouseDown = useCallback((event) => {
    if (event.button !== 0 || event.target.closest('.window-buttons')) {
      return
    }

    event.preventDefault()
    onFocus()

    if (maximized) {
      return
    }

    // Validate coordinates to prevent NaN
    const safeX = Number.isFinite(x) ? x : 0
    const safeY = Number.isFinite(y) ? y : 0

    dragRef.current = {
      offsetX: event.clientX - safeX,
      offsetY: event.clientY - safeY
    }

    setIsDragging(true)
  }, [maximized, onFocus, x, y])

  const handleResizeMouseDown = useCallback((direction) => (event) => {
    if (event.button !== 0 || maximized) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    onFocus()

    resizeRef.current = {
      direction,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: x,
      startY: y,
      startWidth: width,
      startHeight: height
    }

    setIsResizing(true)
  }, [height, maximized, onFocus, width, x, y])

  const handleMaximizeClick = useCallback((event) => {
    event.stopPropagation()
    if (!isCalculator) {
      onToggleMaximize()
    }
  }, [isCalculator, onToggleMaximize])

  const handleMinimizeClick = useCallback((event) => {
    event.stopPropagation()
    onMinimize()
  }, [onMinimize])

  if (minimized) {
    return null
  }

  // Validate window dimensions to prevent NaN in CSS
  const safeX = Number.isFinite(x) ? x : 0
  const safeY = Number.isFinite(y) ? y : 0
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 260
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 180

  const containerStyle = {
    position: 'absolute',
    left: safeX,
    top: safeY,
    zIndex: isDragging || isResizing ? theme.zIndex.windowDragging : (isActive ? theme.zIndex.window + 10 : theme.zIndex.window)
  }

  const frameStyle = {
    width: safeWidth,
    height: safeHeight,
    display: 'flex',
    flexDirection: 'column',
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'translateY(0)' : 'translateY(8px)',
    transition: 'opacity 180ms ease-out, transform 180ms ease-out',
    borderRadius: maximized ? 0 : theme.dimensions.windowBorderRadius,
    ...createWindowStyle(isActive)
  }

  const resizeHandleStyles = {
    top: { position: 'absolute', top: -4, left: 8, right: 8, height: 8, cursor: 'ns-resize', zIndex: theme.zIndex.windowDragging + 1 },
    bottom: { position: 'absolute', bottom: -4, left: 8, right: 8, height: 8, cursor: 'ns-resize', zIndex: theme.zIndex.windowDragging + 1 },
    left: { position: 'absolute', top: 8, bottom: 8, left: -4, width: 8, cursor: 'ew-resize', zIndex: theme.zIndex.windowDragging + 1 },
    right: { position: 'absolute', top: 8, bottom: 8, right: -4, width: 8, cursor: 'ew-resize', zIndex: theme.zIndex.windowDragging + 1 },
    topLeft: { position: 'absolute', top: -4, left: -4, width: 12, height: 12, cursor: 'nwse-resize', zIndex: theme.zIndex.windowDragging + 1 },
    topRight: { position: 'absolute', top: -4, right: -4, width: 12, height: 12, cursor: 'nesw-resize', zIndex: theme.zIndex.windowDragging + 1 },
    bottomLeft: { position: 'absolute', bottom: -4, left: -4, width: 12, height: 12, cursor: 'nesw-resize', zIndex: theme.zIndex.windowDragging + 1 },
    bottomRight: { position: 'absolute', bottom: -4, right: -4, width: 12, height: 12, cursor: 'nwse-resize', zIndex: theme.zIndex.windowDragging + 1 }
  }

  const contentScale = adaptiveScale && maximized ? 1.45 : 1

  return (
    <div className="window-container" style={containerStyle} onMouseDown={onFocus}>
      {!maximized && (
        <>
          <div className="resize-handle top" style={resizeHandleStyles.top} onMouseDown={handleResizeMouseDown('n')} />
          <div className="resize-handle bottom" style={resizeHandleStyles.bottom} onMouseDown={handleResizeMouseDown('s')} />
          <div className="resize-handle left" style={resizeHandleStyles.left} onMouseDown={handleResizeMouseDown('w')} />
          <div className="resize-handle right" style={resizeHandleStyles.right} onMouseDown={handleResizeMouseDown('e')} />
          <div className="resize-handle top-left" style={resizeHandleStyles.topLeft} onMouseDown={handleResizeMouseDown('nw')} />
          <div className="resize-handle top-right" style={resizeHandleStyles.topRight} onMouseDown={handleResizeMouseDown('ne')} />
          <div className="resize-handle bottom-left" style={resizeHandleStyles.bottomLeft} onMouseDown={handleResizeMouseDown('sw')} />
          <div className="resize-handle bottom-right" style={resizeHandleStyles.bottomRight} onMouseDown={handleResizeMouseDown('se')} />
        </>
      )}

      <div ref={frameRef} className={`window-frame ${isActive ? 'active' : 'inactive'} ${maximized ? 'maximized' : ''}`} style={frameStyle}>
        <div
          className="window-titlebar"
          onMouseDown={handleTitlebarMouseDown}
          onDoubleClick={() => !isCalculator && onToggleMaximize()}
          style={{
            height: theme.dimensions.windowHeaderHeight,
            backgroundColor: theme.colors.panel,
            borderBottom: `1px solid ${theme.colors.accentPrimary}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${theme.spacing.md}`,
            userSelect: 'none'
          }}
        >
          <div
            className="window-title"
            style={{
              fontFamily: theme.typography.heading,
              fontSize: theme.typography.sizes.base,
              fontWeight: theme.typography.weights.medium,
              color: theme.colors.textPrimary
            }}
          >
            {title}
          </div>

          <div className="window-buttons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="window-button minimize"
              onClick={handleMinimizeClick}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: '#FACC15',
                color: '#0B0F14',
                padding: 0,
                lineHeight: 1,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              -
            </button>

            <button
              type="button"
              className={`window-button maximize ${isCalculator ? 'disabled' : ''}`}
              onClick={handleMaximizeClick}
              disabled={isCalculator}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: isCalculator ? '#374151' : '#22C55E',
                color: '#0B0F14',
                padding: 0,
                lineHeight: 1,
                fontSize: '12px',
                opacity: isCalculator ? 0.5 : 1,
                cursor: isCalculator ? 'not-allowed' : 'pointer'
              }}
            >
              +
            </button>

            <button
              type="button"
              className="window-button close"
              onClick={(event) => {
                event.stopPropagation()
                onClose()
              }}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: '#EF4444',
                color: '#0B0F14',
                padding: 0,
                lineHeight: 1,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              x
            </button>
          </div>
        </div>

        <div
          className="window-body"
          style={{
            flex: 1,
            minHeight: 0,
            backgroundColor: theme.colors.windowBg,
            color: theme.colors.textPrimary,
            overflow: 'auto'
          }}
        >
          <div
            style={{
              minHeight: '100%',
              transform: contentScale === 1 ? 'none' : `scale(${contentScale})`,
              transformOrigin: 'top left',
              width: contentScale === 1 ? '100%' : `${100 / contentScale}%`,
              height: contentScale === 1 ? '100%' : `${100 / contentScale}%`
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WindowFrame
