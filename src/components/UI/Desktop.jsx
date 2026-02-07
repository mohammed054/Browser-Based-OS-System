import React, { useState, useRef, useCallback } from 'react';
import { theme } from '../../theme';
import DesktopIcon from './DesktopIcon';
import WindowFrame from './WindowFrame';

/**
 * Redesigned Desktop Component
 * Modern styling with improved selection and context menu
 */
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
  activeWindowId 
}) => {
  const [selectedIcons, setSelectedIcons] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(null); // {x, y} position or null
  const desktopRef = useRef(null);

  const handleIconClick = (icon) => {
    openWindow(icon.label);
  };

  const handleIconContextMenu = (e, icon) => {
    e.preventDefault();
    // Simple delete confirmation for now
    if (window.confirm(`Delete ${icon.label}?`)) {
      onDeleteIcon && onDeleteIcon(icon.id);
    }
  };

  const handleIconPositionUpdate = (iconId, x, y, wasDragged) => {
    // Only update position if it was actually dragged
    if (wasDragged) {
      onUpdateIconPosition(iconId, x, y);
    }
  };

  const handleDesktopMouseDown = useCallback((e) => {
    // Only handle left mouse button and not on icons
    if (e.button !== 0) return;

    // Allow selection on desktop itself or desktop-icons container (empty space)
    const isValidTarget = e.target === e.currentTarget ||
                         e.target.classList.contains('desktop-icons') ||
                         e.target.classList.contains('desktop');
    if (!isValidTarget) {
      return;
    }
    e.preventDefault();
    const rect = desktopRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setSelectionStart({ x: startX, y: startY });
    setIsSelecting(true);
    setSelectionRect({ x: startX, y: startY, width: 0, height: 0 });
    setSelectedIcons(new Set()); // Clear selection when starting new selection
  }, []);

  const handleDesktopMouseMove = useCallback((e) => {
    if (!isSelecting) return;

    e.preventDefault();
    const rect = desktopRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const x = Math.min(selectionStart.x, currentX);
    const y = Math.min(selectionStart.y, currentY);
    const width = Math.abs(currentX - selectionStart.x);
    const height = Math.abs(currentY - selectionStart.y);

    setSelectionRect({ x, y, width, height });

    // Check which icons are within the selection rectangle
    const selected = new Set();
    icons.forEach(icon => {
      const iconLeft = icon.x;
      const iconRight = icon.x + parseInt(theme.dimensions.iconSize);
      const iconTop = icon.y;
      const iconBottom = icon.y + parseInt(theme.dimensions.iconSize);

      // Check if icon overlaps with selection rectangle
      const overlaps = !(iconRight < x || iconLeft > x + width ||
                        iconBottom < y || iconTop > y + height);
      if (overlaps) {
        selected.add(icon.id);
      }
    });
    setSelectedIcons(selected);
  }, [isSelecting, selectionStart, icons]);

  const handleDesktopMouseUp = useCallback((e) => {
    if (isSelecting) {
      e.preventDefault();
    }
    setIsSelecting(false);
  }, [isSelecting]);

  const isIconSelected = (iconId) => selectedIcons.has(iconId);

  const handleDesktopContextMenu = useCallback((e) => {
    e.preventDefault();
    const rect = desktopRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setContextMenu({ x, y });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleContextMenuItem = useCallback((action) => {
    switch (action) {
      case 'new-folder':
        // Create a new folder icon on desktop
        const folderName = `New Folder ${Math.floor(Math.random() * 1000)}`;
        console.log('Creating new folder:', folderName);
        // TODO: Actually create the folder icon
        break;

      case 'new-text':
        // Open Notes app for new text document
        openWindow('Notes');
        break;

      case 'view':
        // Toggle view options (placeholder)
        console.log('View options - would show view settings');
        break;

      case 'sort-by':
        // Change icon sorting (placeholder)
        console.log('Sort by - would show sorting options');
        break;

      case 'refresh':
        // Refresh the desktop (reload page for now)
        window.location.reload();
        break;

      case 'paste':
        // Show paste dialog (placeholder)
        alert('Paste functionality - clipboard access would be needed');
        break;

      case 'personalize':
        // Open personalization settings
        openWindow('Settings');
        break;

      case 'display-settings':
        // Show display settings (placeholder)
        console.log('Display settings - would show monitor/display options');
        break;

      default:
        console.log('Unknown context menu action:', action);
    }
    closeContextMenu();
  }, [closeContextMenu, openWindow]);

  // Close context menu when clicking elsewhere
  const handleDesktopClick = useCallback((e) => {
    if (contextMenu) {
      closeContextMenu();
    }
  }, [contextMenu, closeContextMenu]);

  return (
    <div
      className="desktop"
      ref={desktopRef}
      onMouseDown={handleDesktopMouseDown}
      onMouseMove={handleDesktopMouseMove}
      onMouseUp={handleDesktopMouseUp}
      onContextMenu={handleDesktopContextMenu}
      onClick={handleDesktopClick}
      style={{
        position: 'relative',
        width: '100vw',
        height: 'calc(100vh - 48px)', // Account for taskbar
        backgroundColor: theme.colors.background,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
        `,
        overflow: 'hidden'
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
            onDoubleClick={() => handleIconClick(icon)}
            onContextMenu={(e) => handleIconContextMenu(e, icon)}
            onUpdatePosition={handleIconPositionUpdate}
          />
        ))}
      </div>
      {isSelecting && (
        <div
          className="selection-rectangle"
          style={{
            position: 'absolute',
            left: selectionRect.x,
            top: selectionRect.y,
            width: selectionRect.width,
            height: selectionRect.height,
            border: `2px dashed ${theme.colors.accentPrimary}`,
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
            border: `1px solid ${theme.colors.accentPrimary}`,
            borderRadius: theme.dimensions.buttonBorderRadius,
            padding: theme.spacing.sm,
            boxShadow: theme.shadows.window,
            zIndex: theme.zIndex.contextMenu,
            minWidth: '200px'
          }}
        >
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('new-folder')}
            style={{
              padding: theme.spacing.sm,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            📁 New Folder
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('new-text')}
            style={{
              padding: theme.spacing.sm,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            📄 New Text Document
          </div>
          <div className="context-menu-separator" style={{ height: '1px', backgroundColor: theme.colors.accentPrimary, margin: theme.spacing.sm, opacity: 0.3 }}></div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('view')}
            style={{
              padding: theme.spacing.sm,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            👁️ View
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('sort-by')}
            style={{
              padding: theme.spacing.sm,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🔤 Sort by
          </div>
          <div className="context-menu-separator" style={{ height: '1px', backgroundColor: theme.colors.accentPrimary, margin: theme.spacing.sm, opacity: 0.3 }}></div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('refresh')}
            style={{
              padding: theme.spacing.sm,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🔄 Refresh
          </div>
          <div className="context-menu-separator" style={{ height: '1px', backgroundColor: theme.colors.accentPrimary, margin: theme.spacing.sm, opacity: 0.3 }}></div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('paste')}
            style={{
              padding: theme.spacing.sm,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            📋 Paste
          </div>
          <div className="context-menu-separator" style={{ height: '1px', backgroundColor: theme.colors.accentPrimary, margin: theme.spacing.sm, opacity: 0.3 }}></div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('personalize')}
            style={{
              padding: theme.spacing.sm,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🎨 Personalize
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('display-settings')}
            style={{
              padding: theme.spacing.sm,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🖥️ Display settings
          </div>
        </div>
      )}
      {windows.map(window => (
        <WindowFrame
          key={window.id}
          title={window.title}
          x={window.x}
          y={window.y}
          width={window.width}
          height={window.height}
          maximized={window.maximized}
          minimized={window.minimized}
          id={window.id}
          onClose={() => closeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          onPositionChange={updateWindowPosition}
          onSizeChange={updateWindowSize}
          onToggleMaximize={() => toggleMaximizeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          isActive={activeWindowId === window.id}
          isCalculator={window.isCalculator}
        >
          {window.children}
        </WindowFrame>
      ))}
    </div>
  );
};

export default Desktop;