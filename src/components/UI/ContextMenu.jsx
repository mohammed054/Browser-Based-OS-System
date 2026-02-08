import React, { useEffect, useRef, useCallback } from 'react';

const ContextMenu = ({ 
  isVisible, 
  position, 
  items, 
  onClose, 
  className = '',
  style = {}
}) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible, onClose]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    const { key } = event;
    
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      const menuItems = menuRef.current.querySelectorAll('.context-menu-item');
      const currentIndex = Array.from(menuItems).findIndex(item => item === document.activeElement);
      
      let nextIndex;
      if (key === 'ArrowDown') {
        nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
      }
      
      menuItems[nextIndex]?.focus();
    } else if (key === 'Enter') {
      event.preventDefault();
      document.activeElement?.click();
    }
  }, []);

  const handleItemClick = (item, event) => {
    event.stopPropagation();
    if (item.action) {
      item.action();
    }
    if (item.closeOnClick !== false) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={`context-menu ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        ...style
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return <div key={index} className="context-menu-separator" />;
        }

        return (
          <div
            key={index}
            className={`context-menu-item ${item.disabled ? 'disabled' : ''} ${item.danger ? 'danger' : ''}`}
            onClick={(e) => !item.disabled && handleItemClick(item, e)}
            disabled={item.disabled}
            title={item.tooltip}
            style={{
              opacity: item.disabled ? 0.5 : 1,
              cursor: item.disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {item.icon && (
              <span className="context-menu-icon" style={{ marginRight: '8px' }}>
                {item.icon}
              </span>
            )}
            <span className="context-menu-label">{item.label}</span>
            {item.shortcut && (
              <span className="context-menu-shortcut" style={{ marginLeft: 'auto', opacity: 0.6 }}>
                {item.shortcut}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Preset context menu configurations
export const ContextMenuPresets = {
  // Desktop context menu
  desktop: [
    { icon: '📁', label: 'New Folder', action: () => console.log('New folder') },
    { icon: '📄', label: 'New Text Document', action: () => console.log('New text document') },
    { separator: true },
    { icon: '👁️', label: 'View', action: () => console.log('View options') },
    { icon: '🔤', label: 'Sort by', action: () => console.log('Sort options') },
    { separator: true },
    { icon: '🔄', label: 'Refresh', action: () => window.location.reload() },
    { separator: true },
    { icon: '📋', label: 'Paste', action: () => console.log('Paste') },
    { separator: true },
    { icon: '🎨', label: 'Personalize', action: () => console.log('Personalize') },
    { icon: '🖥️', label: 'Display settings', action: () => console.log('Display settings') }
  ],

  // Taskbar app context menu
  taskbarApp: (appName) => [
    { icon: '🔍', label: 'Focus', action: () => console.log(`Focus ${appName}`) },
    { icon: '📐', label: 'Move', action: () => console.log(`Move ${appName}`) },
    { icon: '📏', label: 'Resize', action: () => console.log(`Resize ${appName}`) },
    { separator: true },
    { icon: '📌', label: 'Pin to taskbar', action: () => console.log(`Pin ${appName}`) },
    { separator: true },
    { icon: '❌', label: 'Close', action: () => console.log(`Close ${appName}`), danger: true }
  ],

  // Start menu app context menu
  startMenuApp: (appName) => [
    { icon: '📌', label: 'Pin to start', action: () => console.log(`Pin ${appName}`) },
    { icon: '📁', label: 'Open file location', action: () => console.log(`Open ${appName} location`) },
    { separator: true },
    { icon: '❌', label: 'Uninstall', action: () => console.log(`Uninstall ${appName}`), danger: true }
  ],

  // System tray context menu
  systemTray: [
    { icon: '🔔', label: 'Notification Settings', action: () => console.log('Notification settings') },
    { icon: '🌐', label: 'Network Settings', action: () => console.log('Network settings') },
    { icon: '🔊', label: 'Sound Settings', action: () => console.log('Sound settings') },
    { icon: '🔋', label: 'Power Settings', action: () => console.log('Power settings') },
    { separator: true },
    { icon: '⚙️', label: 'Taskbar Settings', action: () => console.log('Taskbar settings') }
  ],

  // Window context menu
  window: [
    { icon: '🔍', label: 'Find', action: () => console.log('Find'), shortcut: 'Ctrl+F' },
    { separator: true },
    { icon: '↩️', label: 'Undo', action: () => console.log('Undo'), shortcut: 'Ctrl+Z' },
    { icon: '↪️', label: 'Redo', action: () => console.log('Redo'), shortcut: 'Ctrl+Y' },
    { separator: true },
    { icon: '✂️', label: 'Cut', action: () => console.log('Cut'), shortcut: 'Ctrl+X' },
    { icon: '📋', label: 'Copy', action: () => console.log('Copy'), shortcut: 'Ctrl+C' },
    { icon: '📄', label: 'Paste', action: () => console.log('Paste'), shortcut: 'Ctrl+V' },
    { separator: true },
    { icon: '🔄', label: 'Reload', action: () => console.log('Reload'), shortcut: 'F5' }
  ]
};

export default ContextMenu;