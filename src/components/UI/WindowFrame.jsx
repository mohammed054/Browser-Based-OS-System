import React, { useState, useRef, useEffect } from 'react';
import { createWindowStyle, theme } from '../../theme';

/**
 * Redesigned Window Frame Component
 * Modern styling with smooth animations and improved interactions
 */
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
  isCalculator = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeDirection, setResizeDirection] = useState('');
  const [lastClickTime, setLastClickTime] = useState(0);
  const [animationState, setAnimationState] = useState('');
  const [wasMinimized, setWasMinimized] = useState(minimized);
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-buttons')) return; // Don't drag if clicking buttons

    // Handle double-click detection (disabled for calculator)
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 300 && !isCalculator) { // Double-click within 300ms
      onToggleMaximize();
      setLastClickTime(0);
      return; // Don't start dragging on double-click
    } else {
      setLastClickTime(currentTime);
    }

    // If maximized, restore on drag start (Windows behavior)
    if (maximized) {
      onToggleMaximize();
      // After restore, continue with drag using the restored position
      setTimeout(() => {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - x,
          y: e.clientY - y
        });
      }, 0);
      return;
    }

    setIsDragging(true);
    setDragStart({
      x: e.clientX - x,
      y: e.clientY - y
    });
    onFocus(); // Bring to front
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;

      // Boundaries relative to desktop container
      newX = Math.max(0, newX); // Left edge
      newY = Math.max(0, newY); // Top edge (no padding for maximized compatibility)

      // Get the desktop container bounds
      const desktopElement = windowRef.current?.parentElement?.parentElement;
      if (desktopElement) {
        const desktopRect = desktopElement.getBoundingClientRect();
        // Convert width/height to numbers for boundary calculations
        const numericWidth = typeof width === 'string' ? (width === '100%' ? desktopRect.width : parseInt(width)) : width;
        const numericHeight = typeof height === 'string' ? (height === '100%' ? desktopRect.height : parseInt(height)) : height;
        const maxX = desktopRect.width - numericWidth;
        const maxY = desktopRect.height - numericHeight;
        newX = Math.min(newX, maxX);
        newY = Math.min(newY, maxY);
      }

      onPositionChange(id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onPositionChange]);

  useEffect(() => {
    const handleResizeMouseMove = (e) => {
      if (!isResizing) return;

      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.startX;
      let newY = resizeStart.startY;

      const MIN_WIDTH = 200;
      const MIN_HEIGHT = 150;

      switch (resizeDirection) {
        case 'e':
          newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
          break;
        case 'w':
          const potentialWidth = Math.max(MIN_WIDTH, resizeStart.width - deltaX);
          const potentialX = resizeStart.startX + (resizeStart.width - potentialWidth);
          if (potentialX >= 0) {
            newWidth = potentialWidth;
            newX = potentialX;
          }
          break;
        case 's':
          newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);
          // Prevent resizing beyond desktop container
          {
            const desktopElement = windowRef.current?.parentElement?.parentElement;
            if (desktopElement) {
              const desktopRect = desktopElement.getBoundingClientRect();
              const maxHeight = desktopRect.height - newY;
              newHeight = Math.min(newHeight, maxHeight);
            }
          }
          break;
        case 'n':
          const potentialHeight = Math.max(MIN_HEIGHT, resizeStart.height - deltaY);
          const potentialY = resizeStart.startY + (resizeStart.height - potentialHeight);
          if (potentialY >= 0) { // Allow resizing to top edge
            newHeight = potentialHeight;
            newY = potentialY;
          }
          break;
        case 'se':
          newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
          newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);
          // Prevent resizing beyond desktop container
          {
            const desktopElement = windowRef.current?.parentElement?.parentElement;
            if (desktopElement) {
              const desktopRect = desktopElement.getBoundingClientRect();
              const maxHeight = desktopRect.height - newY;
              const maxWidth = desktopRect.width - newX;
              newHeight = Math.min(newHeight, maxHeight);
              newWidth = Math.min(newWidth, maxWidth);
            }
          }
          break;
        case 'sw':
          {
            const potentialWidth = Math.max(MIN_WIDTH, resizeStart.width - deltaX);
            const potentialX = resizeStart.startX + (resizeStart.width - potentialWidth);
            if (potentialX >= 0) {
              newWidth = potentialWidth;
              newX = potentialX;
            }
            newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);
            // Prevent resizing beyond desktop container
            const desktopElement = windowRef.current?.parentElement?.parentElement;
            if (desktopElement) {
              const desktopRect = desktopElement.getBoundingClientRect();
              const maxHeight = desktopRect.height - newY;
              newHeight = Math.min(newHeight, maxHeight);
            }
          }
          break;
        case 'ne':
          newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
          {
            const potentialHeight = Math.max(MIN_HEIGHT, resizeStart.height - deltaY);
            const potentialY = resizeStart.startY + (resizeStart.height - potentialHeight);
            if (potentialY >= 0) { // Allow resizing to top edge
              newHeight = potentialHeight;
              newY = potentialY;
            }
            // Prevent resizing beyond desktop container width
            const desktopElement = windowRef.current?.parentElement?.parentElement;
            if (desktopElement) {
              const desktopRect = desktopElement.getBoundingClientRect();
              const maxWidth = desktopRect.width - newX;
              newWidth = Math.min(newWidth, maxWidth);
            }
          }
          break;
        case 'nw':
          {
            const potentialWidth = Math.max(MIN_WIDTH, resizeStart.width - deltaX);
            const potentialX = resizeStart.startX + (resizeStart.width - potentialWidth);
            if (potentialX >= 0) {
              newWidth = potentialWidth;
              newX = potentialX;
            }
            const potentialHeight = Math.max(MIN_HEIGHT, resizeStart.height - deltaY);
            const potentialY = resizeStart.startY + (resizeStart.height - potentialHeight);
            if (potentialY >= 0) { // Allow resizing to top edge
              newHeight = potentialHeight;
              newY = potentialY;
            }
          }
          break;
      }

      onSizeChange(id, newWidth, newHeight);
      if (newX !== resizeStart.startX || newY !== resizeStart.startY) {
        onPositionChange(id, newX, newY);
      }
    };

    const handleResizeMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, resizeDirection, resizeStart, onSizeChange, onPositionChange, id]);

  const handleResizeMouseDown = (direction) => (e) => {
    if (maximized) return; // Don't allow resizing when maximized
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: width,
      height: height,
      startX: x,
      startY: y
    });
    onFocus();
  };

  const handleMaximizeClick = (e) => {
    e.stopPropagation();
    if (!isCalculator) {
      onToggleMaximize();
    }
  };

  const handleMinimizeClick = (e) => {
    e.stopPropagation();
    setAnimationState('minimizing');
    // Delay the actual minimize to allow animation to play
    setTimeout(() => {
      onMinimize();
      setAnimationState('');
    }, 180);
  };

  // Handle minimize state changes for restore animation
  useEffect(() => {
    if (wasMinimized && !minimized) {
      // Window is being restored from minimized
      setAnimationState('restoring');
      setTimeout(() => setAnimationState(''), 180);
    }
    setWasMinimized(minimized);
  }, [minimized, wasMinimized]);

  // Handle initial render (window opening)
  useEffect(() => {
    setAnimationState('opening');
    setTimeout(() => setAnimationState(''), 180);
  }, []);

  // Handle maximize state changes for smooth transitions
  useEffect(() => {
    if (maximized) {
      setAnimationState('maximizing');
      setTimeout(() => setAnimationState(''), 180);
    } else if (!maximized && animationState === 'maximizing') {
      setAnimationState('restoring-maximize');
      setTimeout(() => setAnimationState(''), 180);
    }
  }, [maximized, animationState]);

  const containerStyle = { 
    left: x, 
    top: y, 
    zIndex: isDragging || isResizing ? theme.zIndex.windowDragging : (isActive ? theme.zIndex.window : theme.zIndex.window - 10)
  };
  
  const frameStyle = { 
    width: width, 
    height: height, 
    display: minimized ? 'none' : 'flex',
    ...createWindowStyle(isActive)
  };

  return (
    <div className="window-container" style={containerStyle}>
      {/* Resize handles - only show when not maximized */}
      {!maximized && (
        <>
          <div className="resize-handle top" onMouseDown={handleResizeMouseDown('n')} />
          <div className="resize-handle bottom" onMouseDown={handleResizeMouseDown('s')} />
          <div className="resize-handle left" onMouseDown={handleResizeMouseDown('w')} />
          <div className="resize-handle right" onMouseDown={handleResizeMouseDown('e')} />
          <div className="resize-handle top-left" onMouseDown={handleResizeMouseDown('nw')} />
          <div className="resize-handle top-right" onMouseDown={handleResizeMouseDown('ne')} />
          <div className="resize-handle bottom-left" onMouseDown={handleResizeMouseDown('sw')} />
          <div className="resize-handle bottom-right" onMouseDown={handleResizeMouseDown('se')} />
        </>
      )}

      <div
        ref={windowRef}
        className={`window-frame ${isActive ? 'active' : 'inactive'} ${isResizing ? 'resizing' : ''} ${maximized ? 'maximized' : ''} ${animationState}`}
        style={frameStyle}
        onClick={onFocus}
      >
        <div className="window-titlebar" onMouseDown={handleMouseDown}>
          <div className="window-title">{title}</div>
          <div className="window-buttons">
            <button className="window-button minimize" onClick={handleMinimizeClick}>—</button>
            <button
              className={`window-button maximize ${isCalculator ? 'disabled' : ''}`}
              onClick={handleMaximizeClick}
              style={isCalculator ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
            >□</button>
            <button className="window-button close" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
          </div>
        </div>
        <div className="window-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WindowFrame;