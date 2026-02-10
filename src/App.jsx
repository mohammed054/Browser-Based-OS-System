import './style.css'
import { useState, useCallback, useEffect, Suspense, lazy } from 'react'
import Desktop from './components/UI/Desktop'
import Taskbar from './components/Taskbar'
import NotificationCenter from './components/UI/NotificationCenter'
import LockScreen from './components/UI/LockScreen'
import BootScreen from './components/UI/BootScreen'
import BlackScreen from './components/UI/BlackScreen'
import LoginScreen from './components/UI/LoginScreen'
import ErrorBoundary from './components/ErrorBoundary'
import { keyboardManager } from './utils/KeyboardManager'
import OSCursor from './components/UI/OSCursor'
import { soundManager } from './utils/SoundManager'
import { MobileFallback, SimplifiedPortfolio } from './components/MobileFallback'

// Lazy load components for better performance
const WindowFrame = lazy(() => import('./components/WindowFrame'))
const Calculator = lazy(() => import('./components/Calculator'))
const Terminal = lazy(() => import('./components/Terminal'))
const Chrome = lazy(() => import('./components/Chrome'))
const Settings = lazy(() => import('./components/Settings'))
const FileExplorer = lazy(() => import('./components/FileExplorer'))
const TrashBin = lazy(() => import('./components/TrashBin'))
const Notes = lazy(() => import('./components/Notes'))

// Portfolio apps
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))
const About = lazy(() => import('./components/About'))
const Resume = lazy(() => import('./components/Resume'))
const ErrorLog = lazy(() => import('./components/ErrorLog'))

function App() {
  // NEW BOOT FLOW STATE MANAGEMENT
  const [systemState, setSystemState] = useState('boot'); // 'boot' | 'black' | 'login' | 'desktop'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Debug: Log component state
  console.log('App render - systemState:', systemState)
  
  // Phase 3 State Management
  const [notifications, setNotifications] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  // const [language, setLanguage] = useState('en'); // Future: Multi-language support
  
  // Phase 5 Mobile State
  const [showMobileFallback, setShowMobileFallback] = useState(false);
  const [showSimplified, setShowSimplified] = useState(false);
  const [mobileWarningAcknowledged, setMobileWarningAcknowledged] = useState(false);
  
  // Lock screen time
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // Calculate initial icon positions with column wrapping
  const getInitialIconPositions = () => {
const icons = [
      // Portfolio apps - prioritized
      { id: 'projects', src: '/portfolio/images/file-explorer.png', label: 'Projects' },
      { id: 'skills', src: '/portfolio/images/settings.png', label: 'Skills' },
      { id: 'contact', src: '/portfolio/images/note.png', label: 'Contact' },
      { id: 'about', src: '/portfolio/images/logo.png', label: 'About' },
      // Core system apps
      { id: 'terminal', src: '/portfolio/images/terminal.png', label: 'Terminal' },
      { id: 'settings', src: '/portfolio/images/settings.png', label: 'Settings' },
      { id: 'chrome', src: '/portfolio/images/chrome.png', label: 'Chrome' },
      { id: 'file-explorer', src: '/portfolio/images/file-explorer.png', label: 'File Explorer' },
      { id: 'notes', src: '/portfolio/images/note.png', label: 'Notes' },
      { id: 'calculator', src: '/portfolio/images/calculator.apng', label: 'Calculator' },
      { id: 'trash-bin', src: '/portfolio/images/bin.png', label: 'Trash Bin' },
      // Additional portfolio apps
      { id: 'resume', src: '/portfolio/images/note.png', label: 'Resume' },
      { id: 'errorlog', src: '/portfolio/images/settings.png', label: 'ErrorLog' },
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
  
  // Phase 5 Loading states
  const [loadingWindows, setLoadingWindows] = useState(new Set());
  
  // Initialize sound manager
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.soundManager = soundManager;
      // Set initial volume to default (0.3)
      soundManager.setVolume(0.3);
    }
  }, []);

  // NEW BOOT FLOW HANDLERS
  const handleBootComplete = useCallback(() => {
    setSystemState('black');
    setTimeout(() => {
      setSystemState('login');
    }, 800);
  }, []);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setSystemState('desktop');
  }, []);

  const openWindow = (appType) => {
    // Phase 5: Check if already loading
    if (loadingWindows.has(appType)) {
      return; // Prevent duplicate launches
    }

    // Phase 5: Play window open sound
    if (typeof window !== 'undefined' && window.soundManager) {
      window.soundManager.play('windowOpen');
    }

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
        // Portfolio apps
        case 'Projects': return Projects;
        case 'Skills': return Skills;
        case 'Contact': return Contact;
        case 'About': return About;
        case 'Resume': return Resume;
        case 'ErrorLog': return ErrorLog;
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

    // Phase 5: Add loading delay
    setLoadingWindows(prev => new Set(prev).add(appType));
    
    // Calculate realistic delay (80-150ms based on app complexity)
    const getAppDelay = (app) => {
      const delays = {
        'Calculator': 80,
        'Terminal': 100,
        'Notes': 120,
        'Settings': 100,
        'File Explorer': 130,
        'Trash Bin': 90,
        'Chrome': 150,
        'Projects': 140,
        'Skills': 120,
        'Contact': 110,
        'About': 100,
        'Resume': 110,
        'ErrorLog': 130
      };
      return delays[app] || 120;
    };

    const launchDelay = getAppDelay(appType);
    
    // Show loading notification
    addNotification('system', `Launching ${appType}...`, {
      title: 'System',
      duration: launchDelay
    });

    setTimeout(() => {
      setLoadingWindows(prev => {
        const newSet = new Set(prev);
        newSet.delete(appType);
        return newSet;
      });
      
      // Continue with window creation...
    }, launchDelay);

    setTimeout(() => {
      setLoadingWindows(prev => {
        const newSet = new Set(prev);
        newSet.delete(appType);
        return newSet;
      });
      
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
          // Portfolio apps
          case 'Projects': return Projects;
          case 'Skills': return Skills;
          case 'Contact': return Contact;
          case 'About': return About;
          case 'Resume': return Resume;
          case 'ErrorLog': return ErrorLog;
          default: return () => <div>{appType} App</div>;
        }
      };

      // Desktop container dimensions (viewport minus taskbar)
      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight - 48;

      // Special sizing for different app types
      const isCalculator = appType === 'Calculator';
      const isPortfolioApp = ['Projects', 'Skills', 'Contact', 'About', 'Resume', 'ErrorLog'].includes(appType);
      let defaultWidth, defaultHeight;
      
      if (isCalculator) {
        // Calculator portrait mode
        const availableHeight = desktopHeight - 20;
        const aspectRatioHeight = Math.floor(320 * 16 / 9);
        const maxAllowedHeight = Math.min(aspectRatioHeight, availableHeight);
        const calculatedWidth = Math.min(320, Math.floor(maxAllowedHeight * 9 / 16));
        const calculatedHeight = Math.floor(calculatedWidth * 16 / 9);

        defaultWidth = calculatedWidth;
        defaultHeight = calculatedHeight;
      } else if (isPortfolioApp) {
        // Portfolio apps - fixed 520x420 size
        defaultWidth = 520;
        defaultHeight = 420;
      } else {
        // Other system apps - 75% of desktop
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
    }, launchDelay);
  }

  const closeWindow = (id) => {
    // Phase 5: Play window close sound
    if (typeof window !== 'undefined' && window.soundManager) {
      window.soundManager.play('windowClose');
    }

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

  // Phase 3 Notification Management
  const addNotification = useCallback((type, message, options = {}) => {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: new Date(),
      duration: options.duration || 5000,
      title: options.title,
      ...options
    };
    setNotifications(prev => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Phase 5 Keyboard Shortcuts System
  useEffect(() => {
    // Alt+Tab - Window switching
    const altTabUnregister = keyboardManager.registerShortcut({
      id: 'alt-tab',
      keys: ['Alt', 'Tab'],
      action: () => {
        const visibleWindows = windows.filter(w => !w.minimized);
        if (visibleWindows.length > 1) {
          const currentWindowIndex = visibleWindows.findIndex(w => w.id === activeWindowId);
          const nextIndex = (currentWindowIndex + 1) % visibleWindows.length;
          focusWindow(visibleWindows[nextIndex].id);
        }
      },
      context: 'global',
      description: 'Switch between windows',
      preventDefault: true
    });

    // Ctrl+Space - Open Start Search
    const ctrlSpaceUnregister = keyboardManager.registerShortcut({
      id: 'ctrl-space',
      keys: ['Ctrl', 'Space'],
      action: () => {
        // Trigger start menu open
        const event = new CustomEvent('open-start-menu');
        document.dispatchEvent(event);
      },
      context: 'global',
      description: 'Open start menu search',
      preventDefault: true
    });

    // Ctrl+W - Close active window
    const ctrlWUnregister = keyboardManager.registerShortcut({
      id: 'ctrl-w',
      keys: ['Ctrl', 'KeyW'],
      action: () => {
        if (activeWindowId) {
          closeWindow(activeWindowId);
        }
      },
      context: 'global',
      description: 'Close active window',
      preventDefault: true
    });

    // Ctrl+` - Open Terminal
    const ctrlBacktickUnregister = keyboardManager.registerShortcut({
      id: 'ctrl-backtick',
      keys: ['Ctrl', 'Backquote'],
      action: () => {
        openWindow('Terminal');
      },
      context: 'global',
      description: 'Open terminal',
      preventDefault: true
    });

    // Alt+F4 - Close active window
    const altF4Unregister = keyboardManager.registerShortcut({
      id: 'alt-f4',
      keys: ['Alt', 'F4'],
      action: () => {
        if (activeWindowId) {
          closeWindow(activeWindowId);
        }
      },
      context: 'global',
      description: 'Close active window (Alt+F4)',
      preventDefault: true
    });

    // Escape - Close modals/dropdowns
    const escUnregister = keyboardManager.registerShortcut({
      id: 'escape',
      keys: ['Escape'],
      action: () => {
        const event = new CustomEvent('escape-pressed');
        document.dispatchEvent(event);
      },
      context: 'global',
      description: 'Close dialogs/modals',
      preventDefault: true
    });

    // Konami Code Easter Egg
    const konamiUnregister = keyboardManager.on('konami-code-activated', () => {
      addNotification('success', '🎮 Konami Code Activated! Secret mode enabled!', {
        title: 'Easter Egg',
        duration: 5000
      });
      // Add secret visual effect
      document.body.style.animation = 'glitch 0.3s ease-in-out';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 300);
    });

    // Cleanup function
    return () => {
      altTabUnregister();
      ctrlSpaceUnregister();
      ctrlWUnregister();
      ctrlBacktickUnregister();
      altF4Unregister();
      escUnregister();
      konamiUnregister();
    };
  }, [windows, activeWindowId, openWindow, closeWindow, focusWindow, addNotification]);

  // Phase 3 Lock/Unlock Functions
  const lockSystem = useCallback(() => {
    setIsLocked(true);
    addNotification('system', 'System locked', {
      title: 'Security',
      duration: 3000
    });
  }, [addNotification]);

  const unlockSystem = useCallback((password) => {
    // Fake authentication - accept 'portfolio' as password
    if (password === 'portfolio') {
      setIsLocked(false);
      addNotification('success', 'System unlocked successfully', {
        title: 'Security',
        duration: 3000
      });
      return true;
    } else {
      addNotification('error', 'Incorrect password. Try "portfolio"', {
        title: 'Authentication Error',
        duration: 4000
      });
      return false;
    }
  }, [addNotification]);

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

  // NEW BOOT FLOW RENDER LOGIC
  if (systemState === 'boot') {
    return <BootScreen onBootComplete={handleBootComplete} />;
  }
  
  if (systemState === 'black') {
    return <BlackScreen onComplete={() => setSystemState('login')} />;
  }
  
  if (systemState === 'login') {
    return (
      <>
        <OSCursor />
        <LoginScreen
          onLogin={handleLogin}
          currentTime={currentTime}
          currentDate={currentDate}
        />
      </>
    );
  }

  // Phase 5: Show mobile fallback on mobile devices
  // Temporarily bypass mobile fallback for testing
  if (!mobileWarningAcknowledged && false) {
    return (
      <>
        <MobileFallback
          onContinue={() => setMobileWarningAcknowledged(true)}
          onSimplified={() => {
            setMobileWarningAcknowledged(true);
            setShowSimplified(true);
          }}
        />
        <OSCursor />
      </>
    );
  }

  // Phase 5: Show simplified portfolio on mobile
  if (showSimplified) {
    return (
      <SimplifiedPortfolio onClose={() => setShowSimplified(false)} />
    );
  }

  return (
    <>
      {/* OS Cursor System */}
      <OSCursor />
      
      <div className={`app ${theme}`} style={{
        opacity: isAuthenticated ? 1 : 0,
        transition: 'opacity 0.3s ease-in'
      }}>
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
          addNotification={addNotification}
        />
<Taskbar 
          openWindow={openWindow}
          windows={windows}
          activeWindowId={activeWindowId}
          addNotification={addNotification}
        />
        <NotificationCenter 
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />
        
        {/* Lock Screen Overlay */}
        <LockScreen
          isVisible={isLocked}
          onUnlock={unlockSystem}
          currentTime={currentTime}
          currentDate={currentDate}
        />
      </div>
    </>
  )
}

export default App
