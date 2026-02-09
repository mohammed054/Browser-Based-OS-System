import React, { useState, useEffect, useRef } from 'react';
import './OSCursor.css';

/**
 * OS Cursor Component
 * Professional OS-style cursor with sharp arrow and context-aware states
 * 
 * Features:
 * - Sharp angled arrow cursor (no circular elements)
 * - Context-aware cursor states (pointer, text, drag, resize)
 * - Instant transitions and purposeful animations
 * - Professional OS behavior, not website-like
 */
const OSCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState('default');
  const [isError, setIsError] = useState(false);
  const [resizeType, setResizeType] = useState('ns');
  const cursorRef = useRef(null);
  const animationFrameRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  // Enhanced cursor state detection
  const detectCursorState = (element) => {
    if (!element) return 'default';
    
    const computedStyle = window.getComputedStyle(element);
    const cursor = computedStyle.cursor;
    const tagName = element.tagName;
    const className = element.className;
    
    // Window drag detection
    if (className.includes('titlebar') || 
        className.includes('draggable') ||
        cursor.includes('move') ||
        className.includes('window-frame')) {
      return 'drag';
    }
    
    // Button/Link detection
    if (tagName === 'BUTTON' || 
        tagName === 'A' || 
        className.includes('clickable') ||
        className.includes('button') ||
        className.includes('os-logo-button') ||
        className.includes('tray-icon') ||
        className.includes('running-app') ||
        className.includes('context-menu-item') ||
        className.includes('start-menu-app') ||
        className.includes('notification-close') ||
        cursor === 'pointer') {
      return 'pointer';
    }
    
    // Text input detection
    if ((tagName === 'INPUT' && element.type === 'text') ||
        tagName === 'INPUT' && element.type === 'password' ||
        tagName === 'TEXTAREA' ||
        className.includes('input') ||
        className.includes('text') ||
        className.includes('terminal-input') ||
        cursor === 'text') {
      return 'text';
    }
    
    // Resize detection
    if (cursor.includes('resize') || className.includes('resize') || className.includes('resize-handle')) {
      let type = 'ns'; // default
      if (cursor.includes('ew') || className.includes('horizontal')) type = 'ew';
      else if (cursor.includes('nesw') || className.includes('diagonal-up')) type = 'nesw';
      else if (cursor.includes('nwse') || className.includes('diagonal-down')) type = 'nwse';
      setResizeType(type);
      return 'resize';
    }
    
    return 'default';
  };

  // Handle mouse movement with optimized performance
  const handleMouseMove = (e) => {
    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Use requestAnimationFrame for smooth following
    animationFrameRef.current = requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Detect cursor context
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const newState = detectCursorState(element);
      setCursorState(newState);
    });
  };

  const handleMouseEnter = () => {
    // Clear any error state on re-enter
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    setIsError(false);
  };

  const handleMouseLeave = () => {
    // Hide cursor when mouse leaves viewport
    // Don't set to null, just opacity change
  };

  const handleMouseDown = () => {
    // Optional: subtle press effect
  };

  const handleMouseUp = () => {
    // Optional: release effect
  };

  // Trigger error state (for form validation errors)
  const triggerError = () => {
    setIsError(true);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setIsError(false);
    }, 200); // Brief 200ms red flicker
  };

  // Setup event listeners
  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Make error trigger available globally
    window.triggerCursorError = triggerError;

    return () => {
      // Restore default cursor
      document.body.style.cursor = '';
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Don't render on touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.body.style.cursor = '';
    }
  }, []);

  // Always render cursor (no visibility null check)
  const getCursorSVG = () => {
    switch (cursorState) {
      case 'pointer':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            shape-rendering="crispEdges"
            className="cursor-svg"
          >
            {/* Shadow / outline */}
            <path
              d="M4 2 L4 18 L7.5 14.5 L10 22 L12.5 21 L10 13.5 L14 13 Z"
              fill="#0B0F14"
              transform="translate(1,1)"
              className="cursor-shadow"
              filter="drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))"
            />
            
            {/* Main cursor */}
            <path
              d="M4 2 L4 18 L7.5 14.5 L10 22 L12.5 21 L10 13.5 L14 13 Z"
              fill="#E5E7EB"
              filter="drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))"
            />
          </svg>
        );
      
      case 'text':
        return (
          <div className="text-cursor">
            <div className="text-beam" />
          </div>
        );
      
      case 'drag':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            shape-rendering="crispEdges"
            className="cursor-svg"
          >
            {/* Shadow / outline */}
            <path
              d="M2 12 L22 12 M12 2 L12 22"
              stroke="#0B0F14"
              strokeWidth="2"
              transform="translate(1,1)"
              className="cursor-shadow"
              filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))"
            />
            
            {/* Cross cursor */}
            <path
              d="M2 12 L22 12 M12 2 L12 22"
              stroke="#E5E7EB"
              strokeWidth="2"
              strokeLinecap="round"
              filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))"
            />
            
            {/* Center dot */}
            <circle
              cx="12"
              cy="12"
              r="1.5"
              fill="#E5E7EB"
            />
          </svg>
        );
      
      case 'resize':
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            shape-rendering="crispEdges"
            className="cursor-svg"
          >
            {/* Shadow / outline */}
            {resizeType === 'ns' && (
              <>
                <path d="M12 4 L12 20" stroke="#0B0F14" strokeWidth="2" transform="translate(0,1)" className="cursor-shadow" />
                <path d="M10 8 L14 8 M10 16 L14 16" stroke="#0B0F14" strokeWidth="2" transform="translate(0,1)" className="cursor-shadow" />
                <path d="M12 4 L12 20" stroke="#E5E7EB" strokeWidth="2" filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.3))" />
                <path d="M10 8 L14 8 M10 16 L14 16" stroke="#E5E7EB" strokeWidth="2" filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.3))" />
              </>
            )}
            {resizeType === 'ew' && (
              <>
                <path d="M4 12 L20 12" stroke="#0B0F14" strokeWidth="2" transform="translate(1,0)" className="cursor-shadow" />
                <path d="M8 10 L8 14 M16 10 L16 14" stroke="#0B0F14" strokeWidth="2" transform="translate(1,0)" className="cursor-shadow" />
                <path d="M4 12 L20 12" stroke="#E5E7EB" strokeWidth="2" filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.3))" />
                <path d="M8 10 L8 14 M16 10 L16 14" stroke="#E5E7EB" strokeWidth="2" filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.3))" />
              </>
            )}
            {resizeType === 'nesw' && (
              <>
                <path d="M6 6 L18 18 M6 18 L18 6" stroke="#0B0F14" strokeWidth="2" transform="translate(1,1)" className="cursor-shadow" />
                <path d="M6 6 L18 18 M6 18 L18 6" stroke="#E5E7EB" strokeWidth="2" filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.3))" />
              </>
            )}
            {resizeType === 'nwse' && (
              <>
                <path d="M6 18 L18 6 M6 6 L18 18" stroke="#0B0F14" strokeWidth="2" transform="translate(1,1)" className="cursor-shadow" />
                <path d="M6 18 L18 6 M6 6 L18 18" stroke="#E5E7EB" strokeWidth="2" filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.3))" />
              </>
            )}
          </svg>
        );
      
      default:
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            shape-rendering="crispEdges"
            className="cursor-svg"
          >
            {/* Shadow / outline */}
            <path
              d="M4 2 L4 18 L7.5 14.5 L10 22 L12.5 21 L10 13.5 L14 13 Z"
              fill="#0B0F14"
              transform="translate(1,1)"
              className="cursor-shadow"
            />
            
            {/* Main cursor */}
            <path
              d="M4 2 L4 18 L7.5 14.5 L10 22 L12.5 21 L10 13.5 L14 13 Z"
              fill="#E5E7EB"
            />
          </svg>
        );
    }
  };

  const getCursorClass = () => {
    let className = 'os-cursor';
    
    switch (cursorState) {
      case 'pointer':
        className += ' cursor-pointer';
        break;
      case 'text':
        className += ' cursor-text';
        break;
      case 'drag':
        className += ' cursor-drag';
        break;
      case 'resize':
        className += ` cursor-resize cursor-resize-${resizeType}`;
        break;
      default:
        className += ' cursor-default';
    }
    
    if (isError) {
      className += ' cursor-error';
    }
    
    return className;
  };

  return (
    <div
      ref={cursorRef}
      className={getCursorClass()}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {getCursorSVG()}
    </div>
  );
};

export default OSCursor;