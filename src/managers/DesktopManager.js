import appRegistry from './AppRegistry.js'

class DesktopManager {
  constructor() {
    this.desktopIcons = []
    this.deletedIcons = []
    this.listeners = new Set()
    this.initializeIcons()
  }

  // Subscribe to desktop state changes
  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Notify all listeners of state changes
  notify() {
    this.listeners.forEach(listener => listener({
      desktopIcons: [...this.desktopIcons],
      deletedIcons: [...this.deletedIcons]
    }))
  }

  // Initialize desktop icons
  initializeIcons() {
    this.desktopIcons = this.calculateInitialIconPositions(appRegistry.getAppsWithIcons())
  }

  // Calculate initial icon positions with column wrapping
  calculateInitialIconPositions(icons) {
    const COLUMN_WIDTH = 120 // Horizontal spacing between columns
    const ICON_HEIGHT = 85 // Approximate total height of icon (48px icon + 5px gap + 12px text + padding)
    const TASKBAR_HEIGHT = 48
    const MARGIN = 20

    // Calculate available vertical space (viewport height - taskbar - margins)
    const availableHeight = window.innerHeight - TASKBAR_HEIGHT - (MARGIN * 2)
    const maxRowsPerColumn = Math.max(1, Math.floor(availableHeight / ICON_HEIGHT))

    const positionedIcons = []
    let currentCol = 0
    let currentRow = 0

    icons.forEach(icon => {
      positionedIcons.push({
        ...icon,
        x: currentCol * COLUMN_WIDTH + MARGIN,
        y: currentRow * ICON_HEIGHT + MARGIN
      })

      currentRow++
      if (currentRow >= maxRowsPerColumn) {
        currentRow = 0
        currentCol++
      }
    })

    return positionedIcons
  }

  // Update icon position
  updateIconPosition(iconId, x, y, wasDragged = false) {
    if (!wasDragged) return

    const movedIconIndex = this.desktopIcons.findIndex(icon => icon.id === iconId)
    if (movedIconIndex === -1) return

    const movedIcon = this.desktopIcons[movedIconIndex]
    const ICON_WIDTH = 80
    const ICON_HEIGHT = 70
    const TASKBAR_HEIGHT = 48

    // Check if new position overlaps with any existing icon
    const checkOverlap = (testX, testY, excludeId = null) => {
      return this.desktopIcons.some(icon => {
        if (icon.id === excludeId) return false

        const overlapX = Math.abs(icon.x - testX) < ICON_WIDTH
        const overlapY = Math.abs(icon.y - testY) < ICON_HEIGHT
        return overlapX && overlapY
      })
    }

    // Find nearest available position
    const findNearestAvailablePosition = (startX, startY) => {
      const COLUMN_WIDTH = 120
      const ROW_HEIGHT = 85
      const MARGIN = 20

      // Try positions in a spiral pattern around the target
      const maxRadius = 10 // Maximum search radius
      for (let radius = 0; radius < maxRadius; radius++) {
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            // Only check perimeter of current radius (except center on first iteration)
            if (radius > 0 && Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue

            const testX = startX + dx * COLUMN_WIDTH
            const testY = startY + dy * ROW_HEIGHT

            // Ensure within bounds
            const maxX = window.innerWidth - ICON_WIDTH - MARGIN
            const maxY = window.innerHeight - ICON_HEIGHT - TASKBAR_HEIGHT - MARGIN

            if (testX >= MARGIN && testX <= maxX && testY >= MARGIN && testY <= maxY) {
              if (!checkOverlap(testX, testY, iconId)) {
                return { x: testX, y: testY }
              }
            }
          }
        }
      }

      // Fallback: find any available position
      const maxCols = Math.ceil(window.innerWidth / COLUMN_WIDTH)
      const maxRows = Math.ceil(window.innerHeight / ROW_HEIGHT)
      for (let col = 0; col < maxCols; col++) {
        for (let row = 0; row < maxRows; row++) {
          const testX = col * COLUMN_WIDTH + MARGIN
          const testY = row * ROW_HEIGHT + MARGIN

          if (testX > window.innerWidth - ICON_WIDTH - MARGIN) continue
          if (testY > window.innerHeight - ICON_HEIGHT - TASKBAR_HEIGHT - MARGIN) continue

          if (!checkOverlap(testX, testY, iconId)) {
            return { x: testX, y: testY }
          }
        }
      }

      // Ultimate fallback: use original position
      return { x: movedIcon.x, y: movedIcon.y }
    }

    let newX = x
    let newY = y

    // Ensure position is within bounds
    const maxX = window.innerWidth - ICON_WIDTH - 20
    const maxY = window.innerHeight - ICON_HEIGHT - TASKBAR_HEIGHT - 20
    newX = Math.max(20, Math.min(newX, maxX))
    newY = Math.max(20, Math.min(newY, maxY))

    let finalX = newX
    let finalY = newY

    // Check for overlap
    if (checkOverlap(newX, newY, iconId)) {
      // Find if we're dropping directly on another icon (for swapping)
      const overlappingIcon = this.desktopIcons.find(icon => {
        if (icon.id === iconId) return false
        const overlapX = Math.abs(icon.x - newX) < ICON_WIDTH
        const overlapY = Math.abs(icon.y - newY) < ICON_HEIGHT
        return overlapX && overlapY
      })

      if (overlappingIcon) {
        // Swap positions with the overlapping icon
        const newIcons = [...this.desktopIcons]
        newIcons[movedIconIndex] = { ...movedIcon, x: overlappingIcon.x, y: overlappingIcon.y }
        const overlappingIndex = newIcons.findIndex(icon => icon.id === overlappingIcon.id)
        newIcons[overlappingIndex] = { ...overlappingIcon, x: newX, y: newY }
        this.desktopIcons = newIcons
        this.notify()
        return
      } else {
        // Find nearest available position
        const availablePos = findNearestAvailablePosition(newX, newY)
        finalX = availablePos.x
        finalY = availablePos.y
      }
    }

    // Update the moved icon's position
    this.desktopIcons = this.desktopIcons.map(icon =>
      icon.id === iconId ? { ...icon, x: finalX, y: finalY } : icon
    )

    this.notify()
  }

  // Delete an icon
  deleteIcon(iconId) {
    const iconToDelete = this.desktopIcons.find(icon => icon.id === iconId)
    if (!iconToDelete) return

    const deletedItem = {
      ...iconToDelete,
      deletedDate: new Date().toLocaleString(),
      type: 'application' // Default type for apps
    }

    this.deletedIcons.push(deletedItem)
    this.desktopIcons = this.desktopIcons.filter(icon => icon.id !== iconId)
    this.notify()
  }

  // Restore an icon from trash
  restoreIcon(icon) {
    // Remove deleted-specific properties and keep only desktop icon properties
    const { deletedDate: _deletedDate, ...desktopIcon } = icon
    this.desktopIcons.push(desktopIcon)
    this.deletedIcons = this.deletedIcons.filter(item => item.id !== icon.id)
    this.notify()
  }

  // Permanently delete an icon
  deletePermanently(icon) {
    this.deletedIcons = this.deletedIcons.filter(item => item.id !== icon.id)
    this.notify()
  }

  // Get current state
  getState() {
    return {
      desktopIcons: [...this.desktopIcons],
      deletedIcons: [...this.deletedIcons]
    }
  }

  // Get desktop icons
  getDesktopIcons() {
    return [...this.desktopIcons]
  }

  // Get deleted icons
  getDeletedIcons() {
    return [...this.deletedIcons]
  }

  // Check if icon exists on desktop
  hasDesktopIcon(iconId) {
    return this.desktopIcons.some(icon => icon.id === iconId)
  }
}

// Singleton instance
export const desktopManager = new DesktopManager()
export default desktopManager
