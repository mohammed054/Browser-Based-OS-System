import './style.css'
import { useState, useCallback, Suspense, lazy } from 'react'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load components for better performance
const WindowFrame = lazy(() => import('./components/WindowFrame'))
const Calculator = lazy(() => import('./components/Calculator'))
const Terminal = lazy(() => import('./components/Terminal'))
const Chrome = lazy(() => import('./components/Chrome'))
const Settings = lazy(() => import('./components/Settings'))
const FileExplorer = lazy(() => import('./components/FileExplorer'))
const TrashBin = lazy(() => import('./components/TrashBin'))
const Notes = lazy(() => import('./components/Notes'))

function App() {
  // Calculate initial icon positions with column wrapping
  const getInitialIconPositions = () => {
    const icons = [
      { id: 'trash-bin', src: './images/bin.png', label: 'Trash Bin' },
      { id: 'chrome', src: './images/chrome.png', label: 'Chrome' },
      { id: 'settings', src: './images/settings.png', label: 'Settings' },
      { id: 'file-explorer', src: './images/file-explorer.png', label: 'File Explorer' },
      { id: 'terminal', src: './images/terminal.png', label: 'Terminal' },
      { id: 'notes', src: './images/note.png', label: 'Notes' },
      { id: 'calculator', src: './images/calculator.apng', label: 'Calculator' },
    ];

    const COLUMN_WIDTH = 120; // Horizontal spacing between columns
    const ICON_HEIGHT = 85; // Approximate total height of icon (48px icon + 5px gap + 12px text + padding)
    const TASKBAR_HEIGHT = 48;
    const MARGIN = 20;

    // Calculate available vertical space (viewport height - taskbar - margins)
    const availableHeight = window.innerHeight - TASKBAR_HEIGHT - (MARGIN * 2);
    const maxRowsPerColumn = Math.max(1, Math.floor(availableHeight / ICON_HEIGHT));

    const positionedIcons = [];
    let currentCol = 0;
    let currentRow = 0;

    icons.forEach(icon => {
      positionedIcons.push({
        ...icon,
        x: currentCol * COLUMN_WIDTH + MARGIN,
        y: currentRow * ICON_HEIGHT + MARGIN
      });

      currentRow++;
      if (currentRow >= maxRowsPerColumn) {
        currentRow = 0;
        currentCol++;
      }
    });

    return positionedIcons;
  };

  const [windows, setWindows] = useState([])
  const [activeWindowId, setActiveWindowId] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [deletedIcons, setDeletedIcons] = useState([
    {
      id: 'dummy-image',
      label: 'Vacation Photo.jpg',
      deletedDate: new Date().toLocaleString(),
      type: 'image'
    },
    {
      id: 'dummy-spreadsheet',
      label: 'Budget.xlsx',
      deletedDate: new Date().toLocaleString(),
      type: 'spreadsheet'
    }
  ])
  const [desktopIcons, setDesktopIcons] = useState(getInitialIconPositions())

  const openWindow = (appType) => {
    // For Notes, allow multiple windows
    if (appType === 'Notes') {
      const notesWindows = windows.filter(w => w.id.startsWith('Notes-'))
      const nextId = `Notes-${notesWindows.length + 1}`
      const offset = windows.length * 20 // Slight offset for cascade effect
      const getComponent = (appType) => {
        switch (appType) {
          case 'Calculator': return Calculator;
          case 'Terminal': return Terminal;
          case 'Chrome': return Chrome;
          case 'Settings': return Settings;
          case 'File Explorer': return FileExplorer;
          case 'Trash Bin': return TrashBin;
          case 'Notes': return Notes;
          default: return () => <div>{appType} App</div>;
        }
      };

      // Desktop container dimensions (viewport minus taskbar)
      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight - 48;

      const defaultWidth = Math.floor(desktopWidth * 0.75);
      const defaultHeight = Math.floor(desktopHeight * 0.75);

      const newWindow = {
        id: nextId,
        title: 'Notes',
        component: getComponent(appType),
        x: Math.max(0, (desktopWidth - defaultWidth) / 2 + offset), // Center horizontally with offset
        y: Math.max(0, (desktopHeight - defaultHeight) / 2 + offset), // Center vertically with offset
        width: defaultWidth,
        height: defaultHeight,
        maximized: false,
        minimized: false,
        lastBounds: null,
        isCalculator: false
      }

      setWindows(prev => [...prev, newWindow])
      setActiveWindowId(nextId)
      return
    }

    // Check if window already exists
    if (windows.some(w => w.id === appType)) {
      // Bring to front if exists and restore if minimized
      setWindows(prev => {
        const existing = prev.find(w => w.id === appType)
        const others = prev.filter(w => w.id !== appType)
        return [...others, { ...existing, minimized: false }]
      })
      setActiveWindowId(appType)
      return // No duplicates
    }

    const offset = windows.length * 20 // Slight offset for cascade effect
    const getComponent = (appType) => {
      switch (appType) {
        case 'Calculator': return Calculator;
        case 'Terminal': return Terminal;
        case 'Chrome': return Chrome;
        case 'Settings': return Settings;
        case 'File Explorer': return FileExplorer;
        case 'Trash Bin': return TrashBin;
        case 'Notes': return Notes;
        default: return () => <div>{appType} App</div>;
      }
    };

    // Desktop container dimensions (viewport minus taskbar)
    const desktopWidth = window.innerWidth;
    const desktopHeight = window.innerHeight - 48;

    // Special sizing for Calculator (portrait mode)
    const isCalculator = appType === 'Calculator';
    let defaultWidth, defaultHeight;
    if (isCalculator) {
      // Calculate maximum height that fits in desktop area
      const availableHeight = desktopHeight - 20; // Some padding
      // Maintain 9:16 aspect ratio, but cap at available height
      const aspectRatioHeight = Math.floor(320 * 16 / 9); // 568px for 320px width
      const maxAllowedHeight = Math.min(aspectRatioHeight, availableHeight);
      // Adjust width to maintain aspect ratio if height is constrained
      const calculatedWidth = Math.min(320, Math.floor(maxAllowedHeight * 9 / 16));
      const calculatedHeight = Math.floor(calculatedWidth * 16 / 9);

      defaultWidth = calculatedWidth;
      defaultHeight = calculatedHeight;
    } else {
      defaultWidth = Math.floor(desktopWidth * 0.75);
      defaultHeight = Math.floor(desktopHeight * 0.75);
    }

    const newWindow = {
      id: appType,
      title: appType,
      component: getComponent(appType),
      x: Math.max(0, (desktopWidth - defaultWidth) / 2 + offset), // Center horizontally with offset
      y: Math.max(0, (desktopHeight - defaultHeight) / 2 + offset), // Center vertically with offset
      width: defaultWidth,
      height: defaultHeight,
      maximized: false,
      minimized: false,
      lastBounds: null,
      isCalculator: isCalculator
    }

    setWindows(prev => [...prev, newWindow])
    setActiveWindowId(appType)
  }

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }

  const focusWindow = (id) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      const others = prev.filter(w => w.id !== id)
      return [...others, existing]
    })
    setActiveWindowId(id)
  }

  const updateWindowPosition = useCallback((id, x, y) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w))
  }, [])

  const updateWindowSize = useCallback((id, width, height) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w))
  }, [])

  const toggleMaximizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        if (w.maximized) {
          // Restore to last bounds
          return {
            ...w,
            ...w.lastBounds,
            maximized: false,
            lastBounds: null
          }
        } else {
          // Maximize - store current bounds and set to maximized relative to desktop container
          const lastBounds = { x: w.x, y: w.y, width: w.width, height: w.height }
          // Desktop container dimensions (viewport minus taskbar)
          const desktopWidth = window.innerWidth;
          const desktopHeight = window.innerHeight - 48;
          return {
            ...w,
            x: 0,
            y: 0,
            width: desktopWidth,
            height: desktopHeight, // Fill the desktop container completely
            maximized: true,
            lastBounds
          }
        }
      }
      return w
    }))
  }, [])

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w))
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }, [activeWindowId])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  const deleteIcon = useCallback((iconId) => {
    const iconToDelete = desktopIcons.find(icon => icon.id === iconId);
    if (iconToDelete) {
      const deletedItem = {
        ...iconToDelete,
        deletedDate: new Date().toLocaleString(),
        type: 'application' // Default type for apps
      };
      setDeletedIcons(prev => [...prev, deletedItem]);
      setDesktopIcons(prev => prev.filter(icon => icon.id !== iconId));
    }
  }, [desktopIcons]);

  const restoreIcon = useCallback((icon) => {
    // Remove deleted-specific properties and keep only desktop icon properties
    const { deletedDate, ...desktopIcon } = icon;
    setDesktopIcons(prev => [...prev, desktopIcon]);
    setDeletedIcons(prev => prev.filter(item => item.id !== icon.id));
  }, []);

  const deletePermanently = useCallback((icon) => {
    setDeletedIcons(prev => prev.filter(item => item.id !== icon.id));
  }, []);



  const updateIconPosition = useCallback((iconId, x, y) => {
    setDesktopIcons(prev => {
      const icons = [...prev];
      const movedIconIndex = icons.findIndex(icon => icon.id === iconId);

      if (movedIconIndex === -1) return prev;

      const movedIcon = icons[movedIconIndex];
      const ICON_WIDTH = 80;
      const ICON_HEIGHT = 70;
      const TASKBAR_HEIGHT = 48;
      const COLUMN_WIDTH = 120;
      const ROW_HEIGHT = 85;

      // Snap to grid
      const snapToGrid = (posX, posY) => {
        const snappedX = Math.round(posX / COLUMN_WIDTH) * COLUMN_WIDTH + 20;
        const snappedY = Math.round(posY / ROW_HEIGHT) * ROW_HEIGHT + 20;

        const maxX = window.innerWidth - ICON_WIDTH - 20;
        const maxY = window.innerHeight - ICON_HEIGHT - TASKBAR_HEIGHT - 20;

        return {
          x: Math.max(20, Math.min(snappedX, maxX)),
          y: Math.max(20, Math.min(snappedY, maxY))
        };
      };

      // Check if new position overlaps with any existing icon
      const checkOverlap = (testX, testY, excludeId = null) => {
        return icons.some(icon => {
          if (icon.id === excludeId) return false;

          const overlapX = Math.abs(icon.x - testX) < ICON_WIDTH;
          const overlapY = Math.abs(icon.y - testY) < ICON_HEIGHT;
          return overlapX && overlapY;
        });
      };

      // Find nearest available position
      const findNearestAvailablePosition = (startX, startY) => {
        const MARGIN = 20;
        const maxX = window.innerWidth - ICON_WIDTH - MARGIN;
        const maxY = window.innerHeight - ICON_HEIGHT - TASKBAR_HEIGHT - MARGIN;

        let closestPos = null;
        let closestDist = Infinity;

        // Check all possible grid positions within reasonable bounds
        const maxCols = Math.ceil(window.innerWidth / COLUMN_WIDTH);
        const maxRows = Math.ceil(window.innerHeight / ROW_HEIGHT);

        for (let col = 0; col < maxCols; col++) {
          for (let row = 0; row < maxRows; row++) {
            const testX = col * COLUMN_WIDTH + MARGIN;
            const testY = row * ROW_HEIGHT + MARGIN;

            if (testX > maxX || testY > maxY) continue;

            if (!checkOverlap(testX, testY, iconId)) {
              const dist = Math.pow(testX - startX, 2) + Math.pow(testY - startY, 2);
              if (dist < closestDist) {
                closestDist = dist;
                closestPos = { x: testX, y: testY };
              }
            }
          }
        }

        if (closestPos) return closestPos;

        // Ultimate fallback: use original position
        return { x: movedIcon.x, y: movedIcon.y };
      };

      // Snap to grid first
      let { x: newX, y: newY } = snapToGrid(x, y);

      // Check for overlap
      if (checkOverlap(newX, newY, iconId)) {
        // Find nearest available position
        const availablePos = findNearestAvailablePosition(newX, newY);
        newX = availablePos.x;
        newY = availablePos.y;
      }

      // Update the moved icon's position
      const newIcons = [...icons];
      newIcons[movedIconIndex] = { ...movedIcon, x: newX, y: newY };
      return newIcons;
    });
  }, []);

  const renderComponent = (win) => {
    const Component = win.component;
    const componentProps = win.id === 'Settings'
      ? { theme, toggleTheme }
      : win.id === 'Trash Bin'
      ? { deletedIcons, onRestore: restoreIcon, onDeletePermanently: deletePermanently }
      : {};

    return (
      <ErrorBoundary>
        <Component {...componentProps} />
      </ErrorBoundary>
    );
  };

  // Create window objects with rendered children for the Desktop component
  const windowsWithChildren = windows.map(window => ({
    ...window,
    children: renderComponent(window)
  }));

  return (
    <>
      <div className={`app ${theme}`}>
        <Desktop
          openWindow={openWindow}
          icons={desktopIcons}
          onDeleteIcon={deleteIcon}
          onUpdateIconPosition={updateIconPosition}
          windows={windowsWithChildren}
          closeWindow={closeWindow}
          focusWindow={focusWindow}
          updateWindowPosition={updateWindowPosition}
          updateWindowSize={updateWindowSize}
          toggleMaximizeWindow={toggleMaximizeWindow}
          minimizeWindow={minimizeWindow}
          activeWindowId={activeWindowId}
        />
        <Taskbar openWindow={openWindow} />
      </div>
    </>
  )
}

export default App
