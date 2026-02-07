import React, { useState, useRef, useEffect } from 'react';
import { theme } from '../../theme';

/**
 * Redesigned Desktop Icon Component
 * Modern styling with hover effects and smooth animations
 */
const DesktopIcon = ({ 
  id, 
  src, 
  label, 
  type, 
  x, 
  y, 
  isSelected, 
  onDoubleClick, 
  onContextMenu, 
  onUpdatePosition 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x, y });
  const iconRef = useRef(null);

  useEffect(() => {
    setCurrentPosition({ x, y });
  }, [x, y]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - x,
      y: e.clientY - y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setCurrentPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Only update if position actually changed
      if (currentPosition.x !== x || currentPosition.y !== y) {
        onUpdatePosition(id, currentPosition.x, currentPosition.y, true);
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, currentPosition]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu(e);
  };

  const iconStyle = {
    position: 'absolute',
    left: currentPosition.x,
    top: currentPosition.y,
    width: theme.dimensions.iconSize,
    height: theme.dimensions.iconSize,
    cursor: 'pointer',
    transition: theme.animations.hover,
    transform: isDragging ? 'scale(1.1)' : (isSelected ? 'scale(1.05)' : 'scale(1)'),
    filter: isSelected ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))' : 'none',
    zIndex: isDragging ? theme.zIndex.windowDragging : theme.zIndex.desktop
  };

  const labelStyle = {
    position: 'absolute',
    top: `${parseInt(theme.dimensions.iconSize) + 4}px`,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'max-content',
    maxWidth: '120px',
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.system,
    color: isSelected ? theme.colors.accentPrimary : theme.colors.textPrimary,
    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
    padding: '2px 6px',
    borderRadius: '4px',
    userSelect: 'none',
    pointerEvents: 'none'
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      style={iconStyle}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      <img 
        src={src} 
        alt={label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: isSelected ? 'brightness(1.2)' : 'none'
        }}
      />
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

export default DesktopIcon;