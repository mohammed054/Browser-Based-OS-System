import { useState, useRef, useCallback } from 'react';

const DesktopIcon = ({ src, label, onDoubleClick, onContextMenu, type, x, y, onUpdatePosition, id, isSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x, y });
  const iconRef = useRef(null);
  const lastClickTime = useRef(0);
  const clickCount = useRef(0);

  const getIcon = (type) => {
    switch (type) {
      case 'document': return '📄';
      case 'image': return '🖼️';
      case 'spreadsheet': return '📊';
      case 'video': return '🎥';
      case 'archive': return '📦';
      default: return '📄';
    }
  };



  const wasDraggedRef = useRef(false);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left mouse button

    e.preventDefault();
    e.stopPropagation();

    const rect = iconRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    wasDraggedRef.current = false;
    setCurrentPosition({ x, y });

    const handleMouseMove = (e) => {
      const deltaX = Math.abs(e.clientX - (x + offsetX));
      const deltaY = Math.abs(e.clientY - (y + offsetY));
      if (deltaX > 3 || deltaY > 3) {
        wasDraggedRef.current = true;
      }

      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      setCurrentPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e) => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      const wasDragged = wasDraggedRef.current;

      if (wasDragged) {
        const finalX = e.clientX - offsetX;
        const finalY = e.clientY - offsetY;
        onUpdatePosition(id, finalX, finalY, wasDragged);
      }

      // Handle double-click detection
      const currentTime = Date.now();
      const timeDiff = currentTime - lastClickTime.current;

      if (timeDiff < 300 && !wasDragged) { // 300ms double-click threshold
        onDoubleClick();
        clickCount.current = 0;
      } else {
        clickCount.current = 1;
      }

      lastClickTime.current = currentTime;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [x, y, onUpdatePosition, id, onDoubleClick]);



  const style = isDragging ? {
    position: 'absolute',
    left: currentPosition.x,
    top: currentPosition.y,
    zIndex: 1000,
    pointerEvents: 'none',
    opacity: 0.8
  } : {
    position: 'absolute',
    left: x,
    top: y
  };



  return (
    <div
      ref={iconRef}
      className={`icon ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
      style={style}
      onMouseDown={handleMouseDown}
      onContextMenu={onContextMenu}
    >
      {src ? (
        <img src={src} alt={label} />
      ) : (
        <span className="emoji-icon">{getIcon(type)}</span>
      )}
      <span>{label}</span>
    </div>
  );
};

export default DesktopIcon;
