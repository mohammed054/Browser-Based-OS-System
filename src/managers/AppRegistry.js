import { lazy } from 'react'

// Lazy load components for better performance
const Calculator = lazy(() => import('../components/Calculator'))
const Terminal = lazy(() => import('../components/Terminal'))
const Chrome = lazy(() => import('../components/Chrome'))
const Settings = lazy(() => import('../components/Settings'))
const FileExplorer = lazy(() => import('../components/FileExplorer'))
const TrashBin = lazy(() => import('../components/TrashBin'))
const Notes = lazy(() => import('../components/Notes'))

class AppRegistry {
  constructor() {
    this.apps = new Map([
      ['Calculator', {
        component: Calculator,
        title: 'Calculator',
        allowMultiple: false,
        specialSizing: true, // portrait mode
        icon: './images/calculator.apng'
      }],
      ['Terminal', {
        component: Terminal,
        title: 'Terminal',
        allowMultiple: false,
        specialSizing: false,
        icon: './images/terminal.png'
      }],
      ['Chrome', {
        component: Chrome,
        title: 'Chrome',
        allowMultiple: false,
        specialSizing: false,
        icon: './images/chrome.png'
      }],
      ['Settings', {
        component: Settings,
        title: 'Settings',
        allowMultiple: false,
        specialSizing: false,
        icon: './images/settings.png'
      }],
      ['File Explorer', {
        component: FileExplorer,
        title: 'File Explorer',
        allowMultiple: false,
        specialSizing: false,
        icon: './images/file-explorer.png'
      }],
      ['Trash Bin', {
        component: TrashBin,
        title: 'Trash Bin',
        allowMultiple: false,
        specialSizing: false,
        icon: './images/bin.png'
      }],
      ['Notes', {
        component: Notes,
        title: 'Notes',
        allowMultiple: true,
        specialSizing: false,
        icon: './images/note.png'
      }]
    ])
  }

  getAppDefinition(appType) {
    return this.apps.get(appType)
  }

  getComponent(appType) {
    const definition = this.getAppDefinition(appType)
    return definition ? definition.component : null
  }

  getTitle(appType) {
    const definition = this.getAppDefinition(appType)
    return definition ? definition.title : appType
  }

  allowsMultiple(appType) {
    const definition = this.getAppDefinition(appType)
    return definition ? definition.allowMultiple : false
  }

  hasSpecialSizing(appType) {
    const definition = this.getAppDefinition(appType)
    return definition ? definition.specialSizing : false
  }

  getIcon(appType) {
    const definition = this.getAppDefinition(appType)
    return definition ? definition.icon : null
  }

  getAllApps() {
    return Array.from(this.apps.keys())
  }

  getAppsWithIcons() {
    return Array.from(this.apps.entries()).map(([name, definition]) => ({
      id: name.toLowerCase().replace(' ', '-'),
      label: name,
      src: definition.icon
    }))
  }

  registerApp(appType, definition) {
    this.apps.set(appType, definition)
  }

  unregisterApp(appType) {
    this.apps.delete(appType)
  }
}

// Singleton instance
export const appRegistry = new AppRegistry()
export default appRegistry
