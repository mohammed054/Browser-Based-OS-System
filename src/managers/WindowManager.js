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
    // Validate input parameters
    const safeDesktopWidth = Number.isFinite(desktopWidth) && desktopWidth > 0 ? desktopWidth : 1280
    const safeDesktopHeight = Number.isFinite(desktopHeight) && desktopHeight > 0 ? desktopHeight : 720

    const defaultWidth = Math.floor(safeDesktopWidth * 0.75)
    const defaultHeight = Math.floor(safeDesktopHeight * 0.75)

    // Ensure minimum dimensions
    const safeDefaultWidth = Math.max(260, defaultWidth)
    const safeDefaultHeight = Math.max(180, defaultHeight)

    if (appRegistry.hasSpecialSizing(appType)) {
      // Special sizing for Calculator (portrait mode)
      const availableHeight = safeDesktopHeight - 20
      const aspectRatioHeight = Math.floor(320 * 16 / 9) // 568px for 320px width
      const maxAllowedHeight = Math.min(aspectRatioHeight, availableHeight)
      const calculatedWidth = Math.min(320, Math.floor(maxAllowedHeight * 9 / 16))
      const calculatedHeight = Math.floor(calculatedWidth * 16 / 9)

      // Ensure calculated dimensions are valid
      const safeCalculatedWidth = Number.isFinite(calculatedWidth) && calculatedWidth > 0 ? calculatedWidth : 320
      const safeCalculatedHeight = Number.isFinite(calculatedHeight) && calculatedHeight > 0 ? calculatedHeight : 568

      return {
        width: safeCalculatedWidth,
        height: safeCalculatedHeight
      }
    }

    return {
      width: safeDefaultWidth,
      height: safeDefaultHeight
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
      
      // Validate bounds
      const safeBoundsWidth = Number.isFinite(bounds.width) && bounds.width > 0 ? bounds.width : 1280
      const safeBoundsHeight = Number.isFinite(bounds.height) && bounds.height > 0 ? bounds.height : 720
      
      // Validate window dimensions
      const safeWindowWidth = Number.isFinite(window.width) && window.width > 0 ? window.width : 260
      const safeWindowHeight = Number.isFinite(window.height) && window.height > 0 ? window.height : 180

      const maxX = Math.max(0, safeBoundsWidth - safeWindowWidth)
      const maxY = Math.max(0, safeBoundsHeight - safeWindowHeight)

      // Clamp to bounds and ensure valid numbers
      const safeX = Number.isFinite(x) ? x : 0
      const safeY = Number.isFinite(y) ? y : 0

      window.x = Math.max(0, Math.min(safeX, maxX))
      window.y = Math.max(0, Math.min(safeY, maxY))
      
      this.notify()
    }
  }

  // Update window size
  updateWindowSize(id, width, height) {
    const window = this.windows.find(w => w.id === id)
    if (window) {
      const bounds = this.getDesktopBounds()
      
      // Validate bounds
      const safeBoundsWidth = Number.isFinite(bounds.width) && bounds.width > 0 ? bounds.width : 1280
      const safeBoundsHeight = Number.isFinite(bounds.height) && bounds.height > 0 ? bounds.height : 720
      
      // Validate current window position
      const safeWindowX = Number.isFinite(window.x) && window.x >= 0 ? window.x : 0
      const safeWindowY = Number.isFinite(window.y) && window.y >= 0 ? window.y : 0

      // Validate new dimensions
      const safeWidth = Number.isFinite(width) ? width : window.width
      const safeHeight = Number.isFinite(height) ? height : window.height

      const maxAllowedWidth = Math.max(260, safeBoundsWidth - safeWindowX)
      const maxAllowedHeight = Math.max(180, safeBoundsHeight - safeWindowY)

      const finalWidth = Math.max(260, Math.min(safeWidth, maxAllowedWidth))
      const finalHeight = Math.max(180, Math.min(safeHeight, maxAllowedHeight))

      window.width = finalWidth
      window.height = finalHeight
      this.notify()
    }
  }

  // Toggle maximize window
  toggleMaximizeWindow(id) {
    const window = this.windows.find(w => w.id === id)
    if (!window) return

    if (window.maximized) {
      // Restore to last bounds
      if (window.lastBounds) {
        Object.assign(window, window.lastBounds)
        window.maximized = false
        window.lastBounds = null
      }
    } else {
      // Maximize - use proper desktop bounds
      const desktopBounds = this.getDesktopBounds()

      // Validate desktop bounds
      const safeDesktopWidth = Number.isFinite(desktopBounds.width) && desktopBounds.width > 0 ? desktopBounds.width : 1280
      const safeDesktopHeight = Number.isFinite(desktopBounds.height) && desktopBounds.height > 0 ? desktopBounds.height : 720

      window.lastBounds = {
        x: window.x,
        y: window.y,
        width: window.width,
        height: window.height
      }

      // Set to full desktop bounds with proper validation
      window.x = 0
      window.y = 0
      window.width = safeDesktopWidth
      window.height = safeDesktopHeight
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
    
    // Validate bounds
    const safeBoundsWidth = Number.isFinite(bounds.width) && bounds.width > 0 ? bounds.width : 1280
    const safeBoundsHeight = Number.isFinite(bounds.height) && bounds.height > 0 ? bounds.height : 720

    let changed = false

    this.windows.forEach(window => {
      if (window.maximized) {
        // Ensure maximized windows get valid dimensions
        window.width = safeBoundsWidth
        window.height = safeBoundsHeight
        changed = true
      } else {
        // Validate current window dimensions
        const safeWindowWidth = Number.isFinite(window.width) && window.width > 0 ? window.width : 260
        const safeWindowHeight = Number.isFinite(window.height) && window.height > 0 ? window.height : 180
        
        // Validate current window position
        const safeWindowX = Number.isFinite(window.x) && window.x >= 0 ? window.x : 0
        const safeWindowY = Number.isFinite(window.y) && window.y >= 0 ? window.y : 0

        // Clamp position if it falls out of bounds
        const maxX = Math.max(0, safeBoundsWidth - safeWindowWidth)
        const maxY = Math.max(0, safeBoundsHeight - safeWindowHeight)
        
        const newX = Math.max(0, Math.min(safeWindowX, maxX))
        const newY = Math.max(0, Math.min(safeWindowY, maxY))

        if (newX !== safeWindowX || newY !== safeWindowY) {
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
