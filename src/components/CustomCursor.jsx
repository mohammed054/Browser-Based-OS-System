import React, { useState, useEffect, useRef } from 'react';
import './CustomCursor.css';

/**
 * Custom Cursor Component
 * Provides OS-wide custom cursor with hover states and tracking
 * 
 * Features:
 * - Smooth cursor following
 * - Hover state detection
 * - Click animations
 * - Context-aware cursor styles
 * - Performance optimized
 */
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true); // Always visible for desktop OS simulation
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState('default');
  const cursorRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Smooth cursor following with requestAnimationFrame
  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Check for hoverable elements
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const cursor = computedStyle.cursor;
        
        // Determine cursor type based on element and computed styles
        if (element.tagName === 'BUTTON' || 
            element.tagName === 'A' || 
            element.classList.contains('clickable') ||
            cursor === 'pointer') {
          setCursorType('pointer');
        } else if (element.tagName === 'INPUT' && element.type === 'text' ||
                   element.tagName === 'TEXTAREA' ||
                   cursor === 'text') {
          setCursorType('text');
        } else if (element.classList.contains('resize-handle') ||
                   cursor.includes('resize')) {
          setCursorType('resize');
        } else if (element.classList.contains('dragging')) {
          setCursorType('grabbing');
        } else if (element.classList.contains('draggable')) {
          setCursorType('grab');
        } else {
          setCursorType('default');
        }
      }
    };

    const handleMouseMove = (e) => {
      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Use requestAnimationFrame for smooth following
      animationFrameRef.current = requestAnimationFrame(() => {
        updateCursor(e);
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(true); // Keep visible for desktop OS
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Hide default cursor
    document.body.style.cursor = 'none';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

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
    };
  }, []);

  // Don't render on touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.body.style.cursor = '';
    }
  }, []);

  if (!isVisible) return null;

  const getCursorClass = () => {
    let className = 'custom-cursor';
    
    switch (cursorType) {
      case 'pointer':
        className += ' cursor-pointer';
        break;
      case 'text':
        className += ' cursor-text';
        break;
      case 'resize':
        className += ' cursor-resize';
        break;
      case 'grabbing':
        className += ' cursor-grabbing';
        break;
      case 'grab':
        className += ' cursor-grab';
        break;
      default:
        className += ' cursor-default';
    }
    
    if (isClicking) {
      className += ' clicking';
    }
    
    return className;
  };

  return (
    <>
      <div
        ref={cursorRef}
        className={getCursorClass()}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {/* Inner cursor dot */}
        <div className="cursor-dot" />
        {/* Outer cursor ring */}
        <div className="cursor-ring" />
        {/* Click ripple effect */}
        {isClicking && <div className="cursor-ripple" />}
      </div>
      
      {/* Trail effect */}
      <div
        className="cursor-trail"
        style={{
          left: position.x,
          top: position.y,
        }}
      />
    </>
  );
};

export default CustomCursor;