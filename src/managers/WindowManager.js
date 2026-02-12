import appRegistry from './AppRegistry.js'

const TASKBAR_HEIGHT = 48

class WindowManager {
  constructor() {
    this.windows = []
    this.activeWindowId = null
    this.listeners = new Set()
    this.snapshot = { windows: [], activeWindowId: null }
  }

  getDesktopBounds() {
    if (typeof window === 'undefined') return { width: 1280, height: 720 }
    return {
      width: window.innerWidth,
      height: Math.max(320, window.innerHeight - TASKBAR_HEIGHT)
    }
  }

  // Subscribe to window state changes
  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Notify all listeners of state changes
  notify() {
    this.snapshot = {
      windows: [...this.windows],
      activeWindowId: this.activeWindowId
    }
    this.listeners.forEach(listener => listener())
  }

  // Generate unique ID for windows
  generateWindowId(appType) {
    if (!appRegistry.allowsMultiple(appType)) {
      return appType
    }

    // For apps that allow multiple instances
    return `${appType}-${Date.now()}`
  }

  // Open a new window
  openWindow(appType) {
    const definition = appRegistry.getAppDefinition(appType)
    if (!definition) {
      console.error(`App type "${appType}" not found in registry`)
      return
    }

    // Check if window already exists and app doesn't allow multiples
    if (!appRegistry.allowsMultiple(appType)) {
      const existing = this.windows.find(w => w.appType === appType)
      if (existing) {
        this.focusWindow(existing.id)
        return
      }
    }

    // Calculate desktop dimensions
    const desktopWidth = window.innerWidth
    const desktopHeight = window.innerHeight - TASKBAR_HEIGHT

    // Generate window dimensions
    const dimensions = this.calculateWindowDimensions(appType, desktopWidth, desktopHeight)

    // Calculate position with cascade effect
    const offset = this.windows.length * 20
    const position = {
      x: Math.max(0, (desktopWidth - dimensions.width) / 2 + offset),
      y: Math.max(0, (desktopHeight - dimensions.height) / 2 + offset)
    }

    const windowId = this.generateWindowId(appType)
    const zIndex = this.windows.length + 1

    const newWindow = {
      id: windowId,
      appType,
      title: appRegistry.getTitle(appType),
      component: appRegistry.getComponent(appType),
      ...position,
      ...dimensions,
      maximized: false,
      minimized: false,
      lastBounds: null,
      zIndex,
      isCalculator: appType === 'Calculator'
    }

    this.windows.push(newWindow)
    this.activeWindowId = windowId
    this.notify()
  }

  // Calculate window dimensions based on app type
  calculateWindowDimensions(appType, desktopWidth, desktopHeight) {
    const defaultWidth = Math.floor(desktopWidth * 0.75)
    const defaultHeight = Math.floor(desktopHeight * 0.75)

    if (appRegistry.hasSpecialSizing(appType)) {
      // Special sizing for Calculator (portrait mode)
      const availableHeight = desktopHeight - 20
      const aspectRatioHeight = Math.floor(320 * 16 / 9) // 568px for 320px width
      const maxAllowedHeight = Math.min(aspectRatioHeight, availableHeight)
      const calculatedWidth = Math.min(320, Math.floor(maxAllowedHeight * 9 / 16))
      const calculatedHeight = Math.floor(calculatedWidth * 16 / 9)

      return {
        width: calculatedWidth,
        height: calculatedHeight
      }
    }

    return {
      width: defaultWidth,
      height: defaultHeight
    }
  }

  // Close a window
  closeWindow(id) {
    const index = this.windows.findIndex(w => w.id === id)
    if (index === -1) return

    this.windows.splice(index, 1)

    // Update active window if it was closed
    if (this.activeWindowId === id) {
      this.activeWindowId = this.windows.length > 0 ? this.windows[this.windows.length - 1].id : null
    }

    this.notify()
  }

  // Focus a window (bring to front)
  focusWindow(id) {
    const window = this.windows.find(w => w.id === id)
    if (!window) return

    // Move window to end of array (highest z-index)
    const index = this.windows.findIndex(w => w.id === id)
    const [focusedWindow] = this.windows.splice(index, 1)
    this.windows.push(focusedWindow)

    // Update z-index for all windows (the focused window gets the highest z-index)
    this.windows.forEach((w, i) => {
      w.zIndex = i + 1
    })

    // Restore if minimized
    if (focusedWindow.minimized) {
      focusedWindow.minimized = false
    }

    this.activeWindowId = id
    this.notify()
  }

  // Update window position
  updateWindowPosition(id, x, y) {
    const window = this.windows.find(w => w.id === id)
    if (window) {
      const bounds = this.getDesktopBounds()
      const maxX = Math.max(0, bounds.width - window.width)
      const maxY = Math.max(0, bounds.height - window.height)

      // Clamp to bounds
      window.x = Math.max(0, Math.min(x, maxX))
      window.y = Math.max(0, Math.min(y, maxY))
      
      this.notify()
    }
  }

  // Update window size
  updateWindowSize(id, width, height) {
    const window = this.windows.find(w => w.id === id)
    if (window) {
      const bounds = this.getDesktopBounds()
      const safeWidth = Math.max(260, Math.min(width, bounds.width - window.x))
      const safeHeight = Math.max(180, Math.min(height, bounds.height - window.y))

      window.width = safeWidth
      window.height = safeHeight
      this.notify()
    }
  }

  // Toggle maximize window
  toggleMaximizeWindow(id) {
    const window = this.windows.find(w => w.id === id)
    if (!window) return

    if (window.maximized) {
      // Restore to last bounds
      Object.assign(window, window.lastBounds)
      window.maximized = false
      window.lastBounds = null
    } else {
      // Maximize
      const desktopWidth = window.innerWidth
      const desktopHeight = window.innerHeight - TASKBAR_HEIGHT

      window.lastBounds = {
        x: window.x,
        y: window.y,
        width: window.width,
        height: window.height
      }

      window.x = 0
      window.y = 0
      window.width = desktopWidth
      window.height = desktopHeight
      window.maximized = true
    }

    this.notify()
  }

  // Minimize window
  minimizeWindow(id) {
    const window = this.windows.find(w => w.id === id)
    if (window) {
      window.minimized = true
      if (this.activeWindowId === id) {
        this.activeWindowId = null
      }
      this.notify()
    }
  }

  // Get current state
  getState() {
    return this.snapshot
  }

  // Handle screen resize
  handleScreenResize() {
    const bounds = this.getDesktopBounds()
    let changed = false

    this.windows.forEach(window => {
      if (window.maximized) {
        window.width = bounds.width
        window.height = bounds.height
        changed = true
      } else {
        // Clamp position if it falls out of bounds
        const maxX = Math.max(0, bounds.width - window.width)
        const maxY = Math.max(0, bounds.height - window.height)
        
        const newX = Math.max(0, Math.min(window.x, maxX))
        const newY = Math.max(0, Math.min(window.y, maxY))

        if (newX !== window.x || newY !== window.y) {
          window.x = newX
          window.y = newY
          changed = true
        }
      }
    })

    if (changed) {
      this.notify()
    }
  }

  // Get window by ID
  getWindow(id) {
    return this.windows.find(w => w.id === id)
  }

  // Get all windows
  getWindows() {
    return [...this.windows]
  }

  // Check if window exists
  hasWindow(id) {
    return this.windows.some(w => w.id === id)
  }
}

// Singleton instance
export const windowManager = new WindowManager()
export default windowManager
