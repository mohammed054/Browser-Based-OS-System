import React, { useState, useRef, useEffect, useCallback } from 'react';
import { theme } from '../../theme';

/**
 * Redesigned Desktop Icon Component
 * Modern styling with hover effects and smooth animations
 */
const DesktopIcon = ({ 
  id, 
  src, 
  label, 
  x, 
  y, 
  isSelected, 
  onDoubleClick, 
  onContextMenu, 
  onUpdatePosition,
  onSelectionChange,
  allIcons,
  selectedIcons
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x, y });
  const iconRef = useRef(null);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDoubleClick();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setCurrentPosition({ x: newX, y: newY });
  }, [dragStart, isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Only update if position actually changed
      if (currentPosition.x !== x || currentPosition.y !== y) {
        onUpdatePosition(id, currentPosition.x, currentPosition.y, true);
      }
    }
  }, [currentPosition, id, isDragging, onUpdatePosition, x, y]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isDragging]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    e.stopPropagation();

    // Handle multi-selection
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd + click: Toggle individual selection
      if (onSelectionChange) {
        const newSelection = new Set(selectedIcons);
        if (newSelection.has(id)) {
          newSelection.delete(id);
        } else {
          newSelection.add(id);
        }
        onSelectionChange(newSelection);
      }
    } else if (e.shiftKey) {
      // Shift + click: Select range from last selected to current
      if (onSelectionChange && selectedIcons.size > 0) {
        const lastSelectedId = Array.from(selectedIcons).pop();
        const lastIcon = allIcons.find(icon => icon.id === lastSelectedId);
        const currentIcon = allIcons.find(icon => icon.id === id);
        
        if (lastIcon && currentIcon) {
          const lastIconIndex = allIcons.findIndex(icon => icon.id === lastSelectedId);
          const currentIconIndex = allIcons.findIndex(icon => icon.id === id);
          
          const startIndex = Math.min(lastIconIndex, currentIconIndex);
          const endIndex = Math.max(lastIconIndex, currentIconIndex);
          
          const newSelection = new Set(selectedIcons);
          for (let i = startIndex; i <= endIndex; i++) {
            newSelection.add(allIcons[i].id);
          }
          onSelectionChange(newSelection);
        }
      }
    } else {
      // Normal click: Start dragging
      setIsDragging(true);
      setDragStart({
        x: e.clientX - x,
        y: e.clientY - y
      });
      setCurrentPosition({ x, y });
      
      // Clear selection if clicking on unselected icon
      if (onSelectionChange && !isSelected) {
        onSelectionChange(new Set([id]));
      }
    }
  };

  const iconStyle = {
    position: 'absolute',
    left: isDragging ? currentPosition.x : x,
    top: isDragging ? currentPosition.y : y,
    width: theme.dimensions.iconSize,
    height: theme.dimensions.iconSize,
    cursor: 'pointer',
    transition: theme.animations.hover,
    transform: isDragging ? 'scale(1.1)' : (isSelected ? 'scale(1.05)' : 'scale(1)'),
    filter: isSelected 
      ? `drop-shadow(0 0 12px ${theme.colors.accentPrimary}) brightness(1.2)` 
      : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    zIndex: isDragging ? theme.zIndex.windowDragging : theme.zIndex.desktop,
    borderRadius: '8px',
    padding: '4px',
    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
    border: isSelected ? `2px solid ${theme.colors.accentPrimary}` : '2px solid transparent'
  };

  const labelStyle = {
    position: 'absolute',
    top: `${parseInt(theme.dimensions.iconSize) + 8}px`,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'max-content',
    maxWidth: '120px',
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.system,
    color: isSelected ? theme.colors.accentPrimary : theme.colors.textPrimary,
    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(11, 15, 20, 0.7)',
    padding: '4px 8px',
    borderRadius: '6px',
    userSelect: 'none',
    pointerEvents: 'none',
    textShadow: isSelected ? `0 0 8px ${theme.colors.accentPrimary}` : '0 1px 2px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    border: isSelected ? `1px solid ${theme.colors.accentPrimary}50` : '1px solid transparent',
    fontWeight: isSelected ? theme.typography.weights.medium : theme.typography.weights.normal
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      style={iconStyle}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={(e) => {
        if (!isDragging && !isSelected) {
          e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4)) brightness(1.1)';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.05)';
          e.currentTarget.style.border = `2px solid ${theme.colors.accentPrimary}30`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging && !isSelected) {
          e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.border = '2px solid transparent';
        }
      }}
    >
      <img 
        src={src} 
        alt={label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: isSelected ? 'brightness(1.2)' : 'none',
          transition: 'filter 150ms ease-in-out'
        }}
      />
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

export default DesktopIcon;
