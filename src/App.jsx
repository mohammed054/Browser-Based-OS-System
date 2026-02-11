import './style.css'
import { useState, useCallback, useEffect, Suspense, lazy, useMemo, useRef } from 'react'
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

const Calculator = lazy(() => import('./components/Calculator'))
const Terminal = lazy(() => import('./components/Terminal'))
const Chrome = lazy(() => import('./components/Chrome'))
const Settings = lazy(() => import('./components/Settings'))
const FileExplorer = lazy(() => import('./components/FileExplorer'))
const TrashBin = lazy(() => import('./components/TrashBin'))
const Notes = lazy(() => import('./components/Notes'))
const Projects = lazy(() => import('./components/Projects'))
const Skills = lazy(() => import('./components/Skills'))
const Contact = lazy(() => import('./components/Contact'))
const About = lazy(() => import('./components/About'))
const Resume = lazy(() => import('./components/Resume'))
const ErrorLog = lazy(() => import('./components/ErrorLog'))

const TASKBAR_HEIGHT = 48
const ICON_COLUMN_WIDTH = 120
const ICON_ROW_HEIGHT = 85
const ICON_MARGIN = 20

const APP_DEFINITIONS = {
  Calculator: { component: Calculator, icon: '/images/calculator.apng', allowMultiple: false, sizeMode: 'calculator' },
  Terminal: { component: Terminal, icon: '/images/terminal.png', allowMultiple: false },
  Chrome: { component: Chrome, icon: '/images/chrome.png', allowMultiple: false },
  Settings: { component: Settings, icon: '/images/settings.png', allowMultiple: false },
  'File Explorer': { component: FileExplorer, icon: '/images/file-explorer.png', allowMultiple: false },
  'Trash Bin': { component: TrashBin, icon: '/images/bin.png', allowMultiple: false },
  Notes: { component: Notes, icon: '/images/note.png', allowMultiple: true },
  Projects: { component: Projects, icon: '/images/file-explorer.png', allowMultiple: false, sizeMode: 'portfolio' },
  Skills: { component: Skills, icon: '/images/settings.png', allowMultiple: false, sizeMode: 'portfolio' },
  Contact: { component: Contact, icon: '/images/note.png', allowMultiple: false, sizeMode: 'portfolio' },
  About: { component: About, icon: '/images/logo.png', allowMultiple: false, sizeMode: 'portfolio' },
  Resume: { component: Resume, icon: '/images/note.png', allowMultiple: false, sizeMode: 'portfolio' },
  ErrorLog: { component: ErrorLog, icon: '/images/settings.png', allowMultiple: false, sizeMode: 'portfolio' }
}

const APP_LAUNCH_DELAYS = {
  Calculator: 80,
  Terminal: 100,
  Notes: 120,
  Settings: 100,
  'File Explorer': 130,
  'Trash Bin': 90,
  Chrome: 150,
  Projects: 140,
  Skills: 120,
  Contact: 110,
  About: 100,
  Resume: 110,
  ErrorLog: 130
}

const DESKTOP_APP_ORDER = [
  'Projects',
  'Skills',
  'Contact',
  'About',
  'Terminal',
  'Settings',
  'Chrome',
  'File Explorer',
  'Notes',
  'Calculator',
  'Trash Bin',
  'Resume',
  'ErrorLog'
]

function getDesktopBounds() {
  if (typeof window === 'undefined') {
    return { width: 1280, height: 720 }
  }

  return {
    width: window.innerWidth,
    height: Math.max(320, window.innerHeight - TASKBAR_HEIGHT)
  }
}

function computeInitialWindowSize(appType, bounds) {
  const sizeMode = APP_DEFINITIONS[appType]?.sizeMode

  if (sizeMode === 'calculator') {
    const availableHeight = bounds.height - 20
    const maxHeight = Math.min(availableHeight, Math.floor(320 * 16 / 9))
    const width = Math.min(320, Math.floor(maxHeight * 9 / 16))
    const height = Math.floor(width * 16 / 9)
    return { width, height }
  }

  if (sizeMode === 'portfolio') {
    return {
      width: Math.max(520, Math.floor(bounds.width * 0.68)),
      height: Math.max(420, Math.floor(bounds.height * 0.68))
    }
  }

  return {
    width: Math.floor(bounds.width * 0.75),
    height: Math.floor(bounds.height * 0.75)
  }
}

function clampWindowToBounds(windowState, bounds) {
  const width = Math.max(260, Math.min(windowState.width, bounds.width))
  const height = Math.max(180, Math.min(windowState.height, bounds.height))

  const maxX = Math.max(0, bounds.width - width)
  const maxY = Math.max(0, bounds.height - height)

  return {
    ...windowState,
    width,
    height,
    x: Math.max(0, Math.min(windowState.x, maxX)),
    y: Math.max(0, Math.min(windowState.y, maxY))
  }
}

function buildInitialDesktopIcons() {
  if (typeof window === 'undefined') {
    return []
  }

  const { height } = getDesktopBounds()
  const availableHeight = height - ICON_MARGIN * 2
  const maxRowsPerColumn = Math.max(1, Math.floor(availableHeight / ICON_ROW_HEIGHT))

  return DESKTOP_APP_ORDER.map((app, index) => {
    const col = Math.floor(index / maxRowsPerColumn)
    const row = index % maxRowsPerColumn

    return {
      id: app.toLowerCase().replace(/\s+/g, '-'),
      label: app,
      src: APP_DEFINITIONS[app]?.icon || '/images/logo.png',
      x: ICON_MARGIN + col * ICON_COLUMN_WIDTH,
      y: ICON_MARGIN + row * ICON_ROW_HEIGHT
    }
  })
}

function App() {
  const [systemState, setSystemState] = useState('boot')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [notifications, setNotifications] = useState([])
  const [isLocked, setIsLocked] = useState(false)
  const [theme, setTheme] = useState('dark')

  const [windows, setWindows] = useState([])
  const [activeWindowId, setActiveWindowId] = useState(null)

  const [desktopIcons, setDesktopIcons] = useState(() => buildInitialDesktopIcons())
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

  const [showSimplified, setShowSimplified] = useState(false)
  const [mobileWarningAcknowledged, setMobileWarningAcknowledged] = useState(false)

  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  const launchTimersRef = useRef(new Set())
  const loadingAppsRef = useRef(new Set())
  const windowsRef = useRef([])

  const addNotification = useCallback((type, message, options = {}) => {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: new Date(),
      duration: options.duration || 5000,
      title: options.title,
      ...options
    }

    setNotifications(prev => [...prev, notification])
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const focusWindow = useCallback((id) => {
    setWindows(prev => {
      const target = prev.find(window => window.id === id)
      if (!target) {
        return prev
      }

      const others = prev.filter(window => window.id !== id)
      return [...others, { ...target, minimized: false }]
    })

    setActiveWindowId(id)
  }, [])

  const closeWindow = useCallback((id) => {
    if (typeof window !== 'undefined' && window.soundManager) {
      window.soundManager.play('windowClose')
    }

    let nextActiveId = null
    setWindows(prev => {
      const next = prev.filter(window => window.id !== id)
      nextActiveId = next.length > 0 ? next[next.length - 1].id : null
      return next
    })

    setActiveWindowId(nextActiveId)
  }, [])

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(window => {
      if (window.id !== id) {
        return window
      }

      return { ...window, minimized: true }
    }))

    setActiveWindowId(prev => (prev === id ? null : prev))
  }, [])

  const toggleMaximizeWindow = useCallback((id) => {
    setWindows(prev => {
      const bounds = getDesktopBounds()

      return prev.map(window => {
        if (window.id !== id) {
          return window
        }

        if (window.maximized) {
          if (window.lastBounds) {
            return {
              ...window,
              ...window.lastBounds,
              maximized: false,
              lastBounds: null
            }
          }

          return { ...window, maximized: false }
        }

        return {
          ...window,
          x: 0,
          y: 0,
          width: bounds.width,
          height: bounds.height,
          maximized: true,
          lastBounds: {
            x: window.x,
            y: window.y,
            width: window.width,
            height: window.height
          }
        }
      })
    })
  }, [])

  const updateWindowPosition = useCallback((id, x, y) => {
    setWindows(prev => {
      const bounds = getDesktopBounds()

      return prev.map(window => {
        if (window.id !== id || window.maximized) {
          return window
        }

        const maxX = Math.max(0, bounds.width - window.width)
        const maxY = Math.max(0, bounds.height - window.height)

        return {
          ...window,
          x: Math.max(0, Math.min(x, maxX)),
          y: Math.max(0, Math.min(y, maxY))
        }
      })
    })
  }, [])

  const updateWindowSize = useCallback((id, width, height) => {
    setWindows(prev => {
      const bounds = getDesktopBounds()

      return prev.map(window => {
        if (window.id !== id || window.maximized) {
          return window
        }

        const safeWidth = Math.max(260, Math.min(width, bounds.width - window.x))
        const safeHeight = Math.max(180, Math.min(height, bounds.height - window.y))

        return {
          ...window,
          width: safeWidth,
          height: safeHeight
        }
      })
    })
  }, [])

  const handleTaskbarWindowAction = useCallback((id) => {
    let nextActiveId = activeWindowId

    setWindows(prev => {
      const target = prev.find(window => window.id === id)
      if (!target) {
        return prev
      }

      if (!target.minimized && activeWindowId === id) {
        nextActiveId = null
        return prev.map(window => (window.id === id ? { ...window, minimized: true } : window))
      }

      nextActiveId = id
      const others = prev.filter(window => window.id !== id)
      return [...others, { ...target, minimized: false }]
    })

    setActiveWindowId(nextActiveId)
  }, [activeWindowId])

  const openWindow = useCallback((appType) => {
    const definition = APP_DEFINITIONS[appType]
    if (!definition) {
      addNotification('error', `Unknown app: ${appType}`, { title: 'Launch Error', duration: 2500 })
      return
    }

    if (loadingAppsRef.current.has(appType)) {
      return
    }

    if (typeof window !== 'undefined' && window.soundManager) {
      window.soundManager.play('windowOpen')
    }

    if (!definition.allowMultiple) {
      const existing = windowsRef.current.find(window => window.appType === appType)
      if (existing) {
        focusWindow(existing.id)
        return
      }
    }

    const launchDelay = APP_LAUNCH_DELAYS[appType] || 100

    loadingAppsRef.current.add(appType)

    addNotification('system', `Launching ${appType}...`, {
      title: 'System',
      duration: launchDelay
    })

    const timerId = window.setTimeout(() => {
      loadingAppsRef.current.delete(appType)

      let nextWindowId = null

      setWindows(prev => {
        const bounds = getDesktopBounds()
        const size = computeInitialWindowSize(appType, bounds)

        const width = Math.min(size.width, bounds.width)
        const height = Math.min(size.height, bounds.height)

        const maxOffsetX = Math.max(0, bounds.width - width)
        const maxOffsetY = Math.max(0, bounds.height - height)
        const cascade = (prev.length % 8) * 24

        const x = Math.min(Math.max(0, Math.floor((bounds.width - width) / 2 + cascade)), maxOffsetX)
        const y = Math.min(Math.max(0, Math.floor((bounds.height - height) / 2 + cascade)), maxOffsetY)

        const instanceCount = prev.filter(window => window.appType === appType).length
        nextWindowId = definition.allowMultiple ? `${appType}-${instanceCount + 1}` : appType

        const newWindow = {
          id: nextWindowId,
          appType,
          title: appType,
          component: definition.component,
          x,
          y,
          width,
          height,
          maximized: false,
          minimized: false,
          lastBounds: null,
          isCalculator: appType === 'Calculator'
        }

        return [...prev, newWindow]
      })

      if (nextWindowId) {
        setActiveWindowId(nextWindowId)
      }

      launchTimersRef.current.delete(timerId)
    }, launchDelay)

    launchTimersRef.current.add(timerId)
  }, [addNotification, focusWindow])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const lockSystem = useCallback(() => {
    setIsLocked(true)
    addNotification('system', 'System locked', {
      title: 'Security',
      duration: 2500
    })
  }, [addNotification])

  const unlockSystem = useCallback((password) => {
    if (password === 'portfolio' || password === 'guest') {
      setIsLocked(false)
      addNotification('success', 'System unlocked successfully', {
        title: 'Security',
        duration: 2500
      })
      return true
    }

    addNotification('error', 'Incorrect password. Try "portfolio"', {
      title: 'Authentication Error',
      duration: 3500
    })

    return false
  }, [addNotification])

  const deleteIcon = useCallback((iconId) => {
    setDesktopIcons(prev => {
      const iconToDelete = prev.find(icon => icon.id === iconId)
      if (!iconToDelete) {
        return prev
      }

      setDeletedIcons(deletedPrev => ([
        ...deletedPrev,
        {
          ...iconToDelete,
          deletedDate: new Date().toLocaleString(),
          type: 'application'
        }
      ]))

      return prev.filter(icon => icon.id !== iconId)
    })
  }, [])

  const restoreIcon = useCallback((icon) => {
    const { deletedDate: _deletedDate, ...desktopIcon } = icon
    setDesktopIcons(prev => [...prev, desktopIcon])
    setDeletedIcons(prev => prev.filter(item => item.id !== icon.id))
  }, [])

  const deletePermanently = useCallback((icon) => {
    setDeletedIcons(prev => prev.filter(item => item.id !== icon.id))
  }, [])

  const updateIconPosition = useCallback((iconId, x, y) => {
    setDesktopIcons(prev => {
      const movedIconIndex = prev.findIndex(icon => icon.id === iconId)
      if (movedIconIndex === -1) {
        return prev
      }

      const ICON_WIDTH = 80
      const ICON_HEIGHT = 70
      const bounds = getDesktopBounds()

      const snapX = Math.round((x - ICON_MARGIN) / ICON_COLUMN_WIDTH) * ICON_COLUMN_WIDTH + ICON_MARGIN
      const snapY = Math.round((y - ICON_MARGIN) / ICON_ROW_HEIGHT) * ICON_ROW_HEIGHT + ICON_MARGIN

      const maxX = bounds.width - ICON_WIDTH - ICON_MARGIN
      const maxY = bounds.height - ICON_HEIGHT - ICON_MARGIN

      let targetX = Math.max(ICON_MARGIN, Math.min(snapX, maxX))
      let targetY = Math.max(ICON_MARGIN, Math.min(snapY, maxY))

      const overlaps = prev.some(icon => {
        if (icon.id === iconId) {
          return false
        }

        const overlapX = Math.abs(icon.x - targetX) < ICON_WIDTH
        const overlapY = Math.abs(icon.y - targetY) < ICON_HEIGHT

        return overlapX && overlapY
      })

      if (overlaps) {
        for (let col = 0; col < Math.ceil(bounds.width / ICON_COLUMN_WIDTH); col += 1) {
          for (let row = 0; row < Math.ceil(bounds.height / ICON_ROW_HEIGHT); row += 1) {
            const candidateX = ICON_MARGIN + col * ICON_COLUMN_WIDTH
            const candidateY = ICON_MARGIN + row * ICON_ROW_HEIGHT

            if (candidateX > maxX || candidateY > maxY) {
              continue
            }

            const occupied = prev.some(icon => {
              if (icon.id === iconId) {
                return false
              }

              return Math.abs(icon.x - candidateX) < ICON_WIDTH && Math.abs(icon.y - candidateY) < ICON_HEIGHT
            })

            if (!occupied) {
              targetX = candidateX
              targetY = candidateY
              col = Number.POSITIVE_INFINITY
              break
            }
          }
        }
      }

      return prev.map(icon => (icon.id === iconId ? { ...icon, x: targetX, y: targetY } : icon))
    })
  }, [])

  const renderWindowContent = useCallback((windowState) => {
    const Component = windowState.component

    const componentProps = windowState.appType === 'Settings'
      ? { theme, toggleTheme }
      : windowState.appType === 'Trash Bin'
        ? { deletedIcons, onRestore: restoreIcon, onDeletePermanently: deletePermanently }
        : {}

    return (
      <ErrorBoundary>
        <Suspense fallback={<div style={{ padding: 16, color: '#9CA3AF' }}>Loading...</div>}>
          <Component {...componentProps} />
        </Suspense>
      </ErrorBoundary>
    )
  }, [deletePermanently, deletedIcons, restoreIcon, theme, toggleTheme])

  const windowsWithChildren = useMemo(() => windows.map(windowState => ({
    ...windowState,
    children: renderWindowContent(windowState)
  })), [windows, renderWindowContent])

  useEffect(() => {
    windowsRef.current = windows
  }, [windows])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.soundManager = soundManager
      soundManager.setVolume(0.3)
    }

    const launchTimers = launchTimersRef.current
    return () => {
      launchTimers.forEach(timerId => window.clearTimeout(timerId))
      launchTimers.clear()
    }
  }, [])

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleResizeNow = () => {
      const bounds = getDesktopBounds()

      setWindows(prev => prev.map(windowState => {
        if (windowState.maximized) {
          return {
            ...windowState,
            x: 0,
            y: 0,
            width: bounds.width,
            height: bounds.height
          }
        }

        return clampWindowToBounds(windowState, bounds)
      }))

      setDesktopIcons(prev => {
        const maxX = bounds.width - 80 - ICON_MARGIN
        const maxY = bounds.height - 70 - ICON_MARGIN

        return prev.map(icon => ({
          ...icon,
          x: Math.max(ICON_MARGIN, Math.min(icon.x, maxX)),
          y: Math.max(ICON_MARGIN, Math.min(icon.y, maxY))
        }))
      })
    }

    let resizeRaf = 0
    const handleResize = () => {
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf)
      }

      resizeRaf = requestAnimationFrame(handleResizeNow)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf)
      }
    }
  }, [])

  useEffect(() => {
    const altTabUnregister = keyboardManager.registerShortcut({
      id: 'alt-tab',
      keys: ['Alt', 'Tab'],
      action: () => {
        const visibleWindows = windows.filter(windowState => !windowState.minimized)
        if (visibleWindows.length <= 1) {
          return
        }

        const currentIndex = visibleWindows.findIndex(windowState => windowState.id === activeWindowId)
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % visibleWindows.length

        focusWindow(visibleWindows[nextIndex].id)
      },
      context: 'global',
      description: 'Switch between windows',
      preventDefault: true
    })

    const ctrlSpaceUnregister = keyboardManager.registerShortcut({
      id: 'ctrl-space',
      keys: ['Ctrl', 'Space'],
      action: () => document.dispatchEvent(new CustomEvent('open-start-menu')),
      context: 'global',
      description: 'Open start menu search',
      preventDefault: true
    })

    const ctrlWUnregister = keyboardManager.registerShortcut({
      id: 'ctrl-w',
      keys: ['Ctrl', 'KeyW'],
      action: () => {
        if (activeWindowId) {
          closeWindow(activeWindowId)
        }
      },
      context: 'global',
      description: 'Close active window',
      preventDefault: true
    })

    const ctrlBacktickUnregister = keyboardManager.registerShortcut({
      id: 'ctrl-backtick',
      keys: ['Ctrl', 'Backquote'],
      action: () => openWindow('Terminal'),
      context: 'global',
      description: 'Open terminal',
      preventDefault: true
    })

    const altF4Unregister = keyboardManager.registerShortcut({
      id: 'alt-f4',
      keys: ['Alt', 'F4'],
      action: () => {
        if (activeWindowId) {
          closeWindow(activeWindowId)
        }
      },
      context: 'global',
      description: 'Close active window',
      preventDefault: true
    })

    const escUnregister = keyboardManager.registerShortcut({
      id: 'escape',
      keys: ['Escape'],
      action: () => document.dispatchEvent(new CustomEvent('escape-pressed')),
      context: 'global',
      description: 'Close menus and overlays',
      preventDefault: true
    })

    const lockShortcutUnregister = keyboardManager.registerShortcut({
      id: 'ctrl-lock',
      keys: ['Ctrl', 'KeyL'],
      action: () => lockSystem(),
      context: 'global',
      description: 'Lock system',
      preventDefault: true
    })

    const konamiUnregister = keyboardManager.on('konami-code-activated', () => {
      addNotification('success', 'Konami Code activated', {
        title: 'Easter Egg',
        duration: 3500
      })
    })

    return () => {
      altTabUnregister()
      ctrlSpaceUnregister()
      ctrlWUnregister()
      ctrlBacktickUnregister()
      altF4Unregister()
      escUnregister()
      lockShortcutUnregister()
      konamiUnregister()
    }
  }, [windows, activeWindowId, focusWindow, closeWindow, openWindow, lockSystem, addNotification])

  const handleBootComplete = useCallback(() => {
    setSystemState('black')
    window.setTimeout(() => setSystemState('login'), 800)
  }, [])

  const handleLogin = useCallback(() => {
    if (isAuthenticated || isLoggingIn) {
      return
    }

    setIsLoggingIn(true)
    setIsAuthenticated(true)
    setSystemState('desktop')

    window.setTimeout(() => {
      setIsLoggingIn(false)
    }, 900)
  }, [isAuthenticated, isLoggingIn])

  if (systemState === 'boot') {
    return <BootScreen onBootComplete={handleBootComplete} />
  }

  if (systemState === 'black') {
    return <BlackScreen onComplete={() => setSystemState('login')} />
  }

  if (systemState === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        currentTime={currentTime}
        currentDate={currentDate}
      />
    )
  }

  const isLikelyMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (!mobileWarningAcknowledged && isLikelyMobile) {
    return (
      <MobileFallback
        onContinue={() => setMobileWarningAcknowledged(true)}
        onSimplified={() => {
          setMobileWarningAcknowledged(true)
          setShowSimplified(true)
        }}
      />
    )
  }

  if (showSimplified) {
    return <SimplifiedPortfolio onClose={() => setShowSimplified(false)} />
  }

  return (
    <>
      <OSCursor />

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
          addNotification={addNotification}
          isFullscreen={false}
        />

        <Taskbar
          openWindow={openWindow}
          windows={windows}
          activeWindowId={activeWindowId}
          onWindowAction={handleTaskbarWindowAction}
          addNotification={addNotification}
        />

        <NotificationCenter
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />

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
