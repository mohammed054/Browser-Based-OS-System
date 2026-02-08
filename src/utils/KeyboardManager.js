/**
 * Global Keyboard Manager
 * Handles system-wide keyboard shortcuts and command routing
 * 
 * Features:
 * - Global shortcut registry
 * - Context-aware routing
 * - Conflict resolution
 * - Keyboard event normalization
 */

class KeyboardManager {
  constructor() {
    this.shortcuts = new Map();
    this.contexts = new Map();
    this.activeContext = 'global';
    this.konamiCode = [];
    this.konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    this.eventListeners = new Set();
    this.isDestroyed = false;
    
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Prevent default browser behavior for our shortcuts
    document.addEventListener('keydown', this.preventDefaultForShortcuts.bind(this), { capture: true });
  }

  /**
   * Register a keyboard shortcut
   * @param {Object} config - Shortcut configuration
   * @param {string} config.id - Unique identifier
   * @param {string[]} config.keys - Key combination (e.g., ['Ctrl', 'Space'])
   * @param {Function} config.action - Action to execute
   * @param {string} config.context - Context where shortcut is active
   * @param {string} config.description - Human-readable description
   * @param {boolean} config.preventDefault - Whether to prevent default behavior
   */
  registerShortcut(config) {
    const {
      id,
      keys = [],
      action,
      context = 'global',
      description = '',
      preventDefault = true
    } = config;

    const key = this.normalizeKeyCombo(keys);
    
    const shortcut = {
      id,
      keys: key,
      action,
      context,
      description,
      preventDefault
    };

    this.shortcuts.set(id, shortcut);
    
    // Track contexts
    if (!this.contexts.has(context)) {
      this.contexts.set(context, new Set());
    }
    this.contexts.get(context).add(id);

    return () => this.unregisterShortcut(id);
  }

  /**
   * Unregister a shortcut
   */
  unregisterShortcut(id) {
    const shortcut = this.shortcuts.get(id);
    if (shortcut) {
      this.contexts.get(shortcut.context)?.delete(id);
      this.shortcuts.delete(id);
    }
  }

  /**
   * Set active context for routing
   */
  setContext(context) {
    this.activeContext = context;
  }

  /**
   * Normalize key combination to string
   */
  normalizeKeyCombo(keys) {
    return keys
      .map(key => {
        // Handle special cases
        switch(key.toLowerCase()) {
          case 'ctrl': return 'Control';
          case 'cmd': case 'meta': return 'Meta';
          case 'win': return 'Meta';
          case 'alt': return 'Alt';
          case 'shift': return 'Shift';
          case 'space': return ' ';
          case '`': return 'Backquote';
          case '[': return 'BracketLeft';
          case ']': return 'BracketRight';
          case ';': return 'Semicolon';
          case "'": return 'Quote';
          case ',': return 'Comma';
          case '.': return 'Period';
          case '/': return 'Slash';
          case '\\': return 'Backslash';
          case '-': return 'Minus';
          case '=': return 'Equal';
          case 'enter': return 'Enter';
          case 'tab': return 'Tab';
          case 'escape': return 'Escape';
          case 'backspace': return 'Backspace';
          case 'delete': return 'Delete';
          case 'home': return 'Home';
          case 'end': return 'End';
          case 'pageup': return 'PageUp';
          case 'pagedown': return 'PageDown';
          case 'arrowup': return 'ArrowUp';
          case 'arrowdown': return 'ArrowDown';
          case 'arrowleft': return 'ArrowLeft';
          case 'arrowright': return 'ArrowRight';
          default: return key.charAt(0).toUpperCase() + key.slice(1);
        }
      })
      .sort()
      .join('+');
  }

  /**
   * Parse KeyboardEvent into key combination
   */
  parseKeyCombo(event) {
    const keys = [];
    
    if (event.ctrlKey || event.metaKey) keys.push('Control');
    if (event.shiftKey) keys.push('Shift');
    if (event.altKey) keys.push('Alt');
    
    // Skip if it's just a modifier key
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(event.code)) {
      return null;
    }
    
    keys.push(event.code);
    
    return keys
      .sort()
      .join('+');
  }

  /**
   * Handle key down events
   */
  handleKeyDown(event) {
    if (this.isDestroyed) return;
    
    const keyCombo = this.parseKeyCombo(event);
    if (!keyCombo) return;

    // Check for Konami code
    this.checkKonamiCode(event.code);

    // Find matching shortcuts in current context
    const activeShortcuts = this.getShortcutsInContext(this.activeContext);
    
    for (const shortcut of activeShortcuts) {
      if (this.matchesShortcut(keyCombo, shortcut)) {
        try {
          shortcut.action(event);
          
          // Emit shortcut triggered event
          this.emit('shortcut-triggered', {
            id: shortcut.id,
            context: this.activeContext,
            keys: keyCombo,
            event
          });
          
          return;
        } catch (error) {
          console.error(`Error executing shortcut ${shortcut.id}:`, error);
        }
      }
    }
  }

  /**
   * Handle key up events
   */
  handleKeyUp(event) {
    // Can be used for key release tracking if needed
  }

  /**
   * Prevent default behavior for registered shortcuts
   */
  preventDefaultForShortcuts(event) {
    const keyCombo = this.parseKeyCombo(event);
    if (!keyCombo) return;

    const activeShortcuts = this.getShortcutsInContext(this.activeContext);
    
    for (const shortcut of activeShortcuts) {
      if (shortcut.preventDefault && this.matchesShortcut(keyCombo, shortcut)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }
  }

  /**
   * Get shortcuts active in current context
   */
  getShortcutsInContext(context) {
    const shortcuts = [];
    
    // Add global shortcuts
    for (const shortcut of this.shortcuts.values()) {
      if (shortcut.context === 'global' || shortcut.context === context) {
        shortcuts.push(shortcut);
      }
    }
    
    return shortcuts;
  }

  /**
   * Check if key combination matches shortcut
   */
  matchesShortcut(keyCombo, shortcut) {
    return keyCombo === shortcut.keys;
  }

  /**
   * Konami code checker for Easter egg
   */
  checkKonamiCode(code) {
    this.konamiCode.push(code);
    
    // Keep only last 10 keys
    if (this.konamiCode.length > 10) {
      this.konamiCode.shift();
    }
    
    // Check for Konami pattern
    if (JSON.stringify(this.konamiCode.slice(-10)) === JSON.stringify(this.konamiPattern)) {
      this.emit('konami-code-activated');
      this.konamiCode = []; // Reset
    }
  }

  /**
   * Event emission system
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
    
    return () => this.eventListeners.get(event)?.delete(callback);
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in keyboard event listener:`, error);
        }
      });
    }
  }

  /**
   * Get all registered shortcuts for help/documentation
   */
  getShortcuts(context = null) {
    const shortcuts = [];
    
    for (const shortcut of this.shortcuts.values()) {
      if (!context || shortcut.context === context || shortcut.context === 'global') {
        shortcuts.push({
          id: shortcut.id,
          keys: this.formatShortcutKeys(shortcut.keys),
          context: shortcut.context,
          description: shortcut.description
        });
      }
    }
    
    return shortcuts.sort((a, b) => a.keys.localeCompare(b.keys));
  }

  /**
   * Format shortcut keys for display
   */
  formatShortcutKeys(keys) {
    const keyMap = {
      'Control': 'Ctrl',
      'Meta': 'Win',
      'Alt': 'Alt',
      'Shift': 'Shift',
      ' ': 'Space',
      'Backquote': '`',
      'BracketLeft': '[',
      'BracketRight': ']',
      'Semicolon': ';',
      'Quote': "'",
      'Comma': ',',
      'Period': '.',
      'Slash': '/',
      'Backslash': '\\',
      'Minus': '-',
      'Equal': '=',
      'Enter': 'Enter',
      'Tab': 'Tab',
      'Escape': 'Esc',
      'Backspace': 'Backspace',
      'Delete': 'Delete',
      'Home': 'Home',
      'End': 'End',
      'PageUp': 'PageUp',
      'PageDown': 'PageDown',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→'
    };

    return keys
      .split('+')
      .map(key => keyMap[key] || key)
      .join(' + ');
  }

  /**
   * Destroy the keyboard manager and clean up event listeners
   */
  destroy() {
    this.isDestroyed = true;
    
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this));
      document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    }
    
    this.shortcuts.clear();
    this.contexts.clear();
    this.eventListeners.clear();
    this.konamiCode = [];
  }
}

// Create singleton instance
export const keyboardManager = new KeyboardManager();

export default KeyboardManager;