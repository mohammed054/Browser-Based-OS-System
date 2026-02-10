import React, { useState, useRef, useCallback, useEffect } from 'react';
import { theme } from '../../theme';
import DesktopIcon from './DesktopIcon';
import WindowFrame from '../WindowFrame';
import SecretWindow from '../SecretWindow';

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
  activeWindowId,
  addNotification 
}) => {
  const [selectedIcons, setSelectedIcons] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(null); // {x, y} position or null
  const desktopRef = useRef(null);
  
  // Phase 5 Easter Eggs State
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [secretWindowVisible, setSecretWindowVisible] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoGlitch, setLogoGlitch] = useState(false);

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
    
    // Only clear selection if not using modifier keys
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      setSelectedIcons(new Set());
    }
    
    const rect = desktopRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setSelectionStart({ x: startX, y: startY });
    setIsSelecting(true);
    setSelectionRect({ x: startX, y: startY, width: 0, height: 0 });
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

  const handleIconSelectionChange = useCallback((newSelection) => {
    setSelectedIcons(newSelection);
  }, []);

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

  // Phase 5 Easter Egg: 5x Double-click for secret window
  const handleDesktopDoubleClick = useCallback((e) => {
    // Check if clicking on empty desktop area
    if (e.target === desktopRef.current || e.target.classList.contains('desktop')) {
      const currentTime = Date.now();
      const timeSinceLastClick = currentTime - lastClickTime;
      
      // Reset count if too much time has passed
      if (timeSinceLastClick > 1000) {
        setDoubleClickCount(1);
      } else {
        setDoubleClickCount(prev => prev + 1);
      }
      
      setLastClickTime(currentTime);
      
      // Check for 5 consecutive double-clicks
      if (doubleClickCount >= 4) {
        setSecretWindowVisible(true);
        setDoubleClickCount(0);
        
        // Play success sound
        if (typeof window !== 'undefined' && window.soundManager) {
          window.soundManager.play('success');
        }
        
        // Show notification
        if (addNotification) {
          addNotification('success', '🎉 Secret window unlocked! You found desktop Easter egg!', {
            title: 'Easter Egg',
            duration: 5000
          });
        }
      }
    }
  }, [doubleClickCount, lastClickTime]);

  // Phase 5 Easter Egg: Logo drag glitch
  const handleLogoMouseDown = useCallback((e) => {
    setIsDraggingLogo(true);
    e.preventDefault();
  }, []);

  const handleLogoMouseMove = useCallback((e) => {
    if (isDraggingLogo) {
      setLogoGlitch(true);
      
      // Add glitch effect to body
      document.body.style.animation = 'logo-glitch 0.2s ease-in-out';
      
      setTimeout(() => {
        document.body.style.animation = '';
        setLogoGlitch(false);
        setIsDraggingLogo(false);
      }, 200);
      
      // Show notification
      if (addNotification) {
        addNotification('success', '⚡ Logo glitch detected! System experiencing visual disturbance...', {
          title: 'Easter Egg',
          duration: 3000
        });
      }
    }
  }, [isDraggingLogo]);

  const handleLogoMouseUp = useCallback(() => {
    setIsDraggingLogo(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.context-menu')) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('mouseup', handleLogoMouseUp);
    document.addEventListener('mousemove', handleLogoMouseMove);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('mouseup', handleLogoMouseUp);
      document.removeEventListener('mousemove', handleLogoMouseMove);
    };
  }, [closeContextMenu, handleLogoMouseUp, handleLogoMouseMove]);

  return (
    <>
      {/* Phase 5 Secret Window */}
      <SecretWindow 
        isVisible={secretWindowVisible}
        onClose={() => setSecretWindowVisible(false)}
      />
      
      <div
        className="desktop"
        ref={desktopRef}
        onMouseDown={handleDesktopMouseDown}
        onMouseMove={handleDesktopMouseMove}
        onMouseUp={handleDesktopMouseUp}
        onContextMenu={handleDesktopContextMenu}
        onClick={handleDesktopClick}
        onDoubleClick={handleDesktopDoubleClick}
        style={{
          position: 'relative',
          width: '100vw',
          height: 'calc(100vh - 48px)', // Account for taskbar
          backgroundColor: theme.colors.background,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(17, 24, 39, 0.03) 0%, transparent 70%)
          `,
          backgroundSize: '200% 200%',
          backgroundPosition: '0% 0%',
          animation: 'gradient-shift 15s ease infinite',
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
            onSelectionChange={handleIconSelectionChange}
            allIcons={icons}
            selectedIcons={selectedIcons}
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
            border: `2px solid ${theme.colors.accentPrimary}`,
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            pointerEvents: 'none',
            zIndex: theme.zIndex.overlay,
            boxShadow: `0 0 20px ${theme.colors.accentPrimary}40 inset, 0 0 15px ${theme.colors.accentPrimary}30`,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            transition: 'all 100ms ease-out',
            animation: 'selection-rectangle-pulse 1.5s ease-in-out infinite'
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
            backgroundColor: theme.colors.panel + 'CC', // Semi-transparent
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${theme.colors.accentPrimary}60`,
            borderRadius: theme.dimensions.windowBorderRadius,
            padding: theme.spacing.sm,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px ${theme.colors.accentPrimary}20`,
            zIndex: theme.zIndex.contextMenu,
            minWidth: '220px',
            animation: 'context-menu-open 150ms ease-out',
            transformOrigin: 'top left'
          }}
        >
<div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('new-folder')}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontSize: theme.typography.sizes.sm,
              fontFamily: theme.typography.system,
              color: theme.colors.textPrimary,
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.accentPrimary}20`;
              e.currentTarget.style.border = `1px solid ${theme.colors.accentPrimary}40`;
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: theme.typography.sizes.base }}>📁</span>
            New Folder
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('new-text')}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontSize: theme.typography.sizes.sm,
              fontFamily: theme.typography.system,
              color: theme.colors.textPrimary,
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.accentPrimary}20`;
              e.currentTarget.style.border = `1px solid ${theme.colors.accentPrimary}40`;
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: theme.typography.sizes.base }}>📄</span>
            New Text Document
          </div>
          <div 
            className="context-menu-separator" 
            style={{ 
              height: '1px', 
              background: `linear-gradient(90deg, transparent, ${theme.colors.accentPrimary}40, transparent)`, 
              margin: `${theme.spacing.sm} ${theme.spacing.md}`,
              opacity: 0.6 
            }}
          ></div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('view')}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontSize: theme.typography.sizes.sm,
              fontFamily: theme.typography.system,
              color: theme.colors.textPrimary,
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.accentPrimary}20`;
              e.currentTarget.style.border = `1px solid ${theme.colors.accentPrimary}40`;
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: theme.typography.sizes.base }}>👁️</span>
            View
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('sort-by')}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontSize: theme.typography.sizes.sm,
              fontFamily: theme.typography.system,
              color: theme.colors.textPrimary,
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.accentPrimary}20`;
              e.currentTarget.style.border = `1px solid ${theme.colors.accentPrimary}40`;
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: theme.typography.sizes.base }}>🔤</span>
            Sort by
          </div>
          <div 
            className="context-menu-separator" 
            style={{ 
              height: '1px', 
              background: `linear-gradient(90deg, transparent, ${theme.colors.accentPrimary}40, transparent)`, 
              margin: `${theme.spacing.sm} ${theme.spacing.md}`,
              opacity: 0.6 
            }}
          ></div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('refresh')}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontSize: theme.typography.sizes.sm,
              fontFamily: theme.typography.system,
              color: theme.colors.textPrimary,
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.accentPrimary}20`;
              e.currentTarget.style.border = `1px solid ${theme.colors.accentPrimary}40`;
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: theme.typography.sizes.base }}>🔄</span>
            Refresh
          </div>
          <div 
            className="context-menu-separator" 
            style={{ 
              height: '1px', 
              background: `linear-gradient(90deg, transparent, ${theme.colors.accentPrimary}40, transparent)`, 
              margin: `${theme.spacing.sm} ${theme.spacing.md}`,
              opacity: 0.6 
            }}
          ></div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('paste')}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontSize: theme.typography.sizes.sm,
              fontFamily: theme.typography.system,
              color: theme.colors.textPrimary,
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.accentPrimary}20`;
              e.currentTarget.style.border = `1px solid ${theme.colors.accentPrimary}40`;
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: theme.typography.sizes.base }}>📋</span>
            Paste
          </div>
          <div 
            className="context-menu-separator" 
            style={{ 
              height: '1px', 
              background: `linear-gradient(90deg, transparent, ${theme.colors.accentPrimary}40, transparent)`, 
              margin: `${theme.spacing.sm} ${theme.spacing.md}`,
              opacity: 0.6 
            }}
          ></div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('personalize')}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontSize: theme.typography.sizes.sm,
              fontFamily: theme.typography.system,
              color: theme.colors.textPrimary,
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.accentPrimary}20`;
              e.currentTarget.style.border = `1px solid ${theme.colors.accentPrimary}40`;
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: theme.typography.sizes.base }}>🎨</span>
            Personalize
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleContextMenuItem('display-settings')}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              cursor: 'pointer',
              borderRadius: theme.dimensions.buttonBorderRadius,
              transition: theme.animations.hover,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              fontSize: theme.typography.sizes.sm,
              fontFamily: theme.typography.system,
              color: theme.colors.textPrimary,
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.accentPrimary}20`;
              e.currentTarget.style.border = `1px solid ${theme.colors.accentPrimary}40`;
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: theme.typography.sizes.base }}>🖥️</span>
            Display settings
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
      
      {/* CSS Animations */}
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        
        @keyframes rocket-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
          }
          50% { 
            box-shadow: 0 0 25px rgba(56, 189, 248, 0.8);
          }
        }
        
        @keyframes context-menu-open {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes selection-rectangle-pulse {
          0%, 100% {
            border-color: ${theme.colors.accentPrimary};
            box-shadow: 0 0 20px ${theme.colors.accentPrimary}40 inset, 0 0 15px ${theme.colors.accentPrimary}30;
          }
          50% {
            border-color: ${theme.colors.accentSecondary};
            box-shadow: 0 0 25px ${theme.colors.accentSecondary}50 inset, 0 0 20px ${theme.colors.accentSecondary}40;
          }
        }
      `}</style>
      </div>
    </>
  );
};

export default Desktop;