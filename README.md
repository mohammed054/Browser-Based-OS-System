# Browser-Based OS System

🌟 **[View Live Demo](https://mohammed054.github.io/Browser-Based-OS-System/)**

A sophisticated, production-quality operating system simulation built entirely in the browser using modern React architecture. This project demonstrates advanced frontend engineering through custom-built window management, desktop interactions, and application frameworks - all without external UI libraries or OS simulation dependencies.

> **Advanced Implementation**: This is not a simple demo. Every component, from the window manager to the desktop icon collision detection, is custom-engineered with complex algorithms and state management typically found in production desktop environments.

## ✨ Features

### Core Desktop Experience
- **Desktop Environment**: Clean, responsive desktop with wallpaper and icons arranged in columns
- **Window Management**: Full window controls including drag, resize, minimize, maximize, and close
- **Window Cascading**: Automatic offset positioning when opening multiple windows
- **Taskbar**: Windows-style taskbar with app shortcuts and window management
- **Themes**: Toggle between dark and light themes for comfortable viewing
- **Active Window Tracking**: Visual focus indicators and z-index management

### Icon Management
- **Drag & Drop Icons**: Intuitive desktop icon positioning with mouse interaction
- **Collision Detection**: Smart repositioning to prevent icon overlap
- **Icon Swapping**: Drop icons on each other to swap positions
- **Bounds Checking**: Icons stay within desktop boundaries
- **Grid Snapping**: Automatic alignment to invisible grid for organized layout

### Built-in Applications
- **Calculator**: Full-featured calculator with keyboard support and portrait aspect ratio optimization
- **Terminal**: Command-line interface simulation for familiar CLI experience
- **Chrome Browser**: Web browser simulator with navigation capabilities
- **Settings**: System settings panel with theme controls and preferences
- **File Explorer**: File system navigation interface
- **Notes**: Multi-instance note-taking app (open multiple note windows simultaneously)
- **Trash Bin**: File deletion system with restore and permanent delete functionality

### Advanced Features
- **Multi-window Support**: Run multiple applications simultaneously without conflicts
- **Specialized Sizing**: Calculator maintains 9:16 aspect ratio for optimal usability
- **Window State Management**: Minimize/restore windows with state preservation
- **Responsive Design**: Adapts to different screen sizes and viewport changes
- **Icon Deletion**: Drag icons to trash bin for deletion with recovery options
- **Dynamic Positioning**: Icons automatically reposition based on available screen space

## 🏗️ Architecture & Technical Highlights

### Custom-Built Manager Classes
This project features a sophisticated architecture with three custom-built manager classes that handle complex state management and interactions:

- **AppRegistry**: Singleton class managing application metadata, lazy loading, and component registration with support for multi-instance apps
- **WindowManager**: Advanced window lifecycle management with z-index handling, cascade positioning, maximize/minimize state, and boundary detection
- **DesktopManager**: Complex desktop icon management featuring collision detection algorithms, spiral search for available positions, and drag-and-drop swapping

### Advanced Window System
- **8-Direction Resizing**: Full window resizing with intelligent boundary checking and minimum size constraints
- **Drag & Drop**: Smooth window positioning with double-click maximize/restore functionality (Windows-style behavior)
- **Z-Index Management**: Proper window focus management with visual indicators and layering
- **Cascade Positioning**: Automatic offset calculation when opening multiple windows to prevent overlap
- **Animation System**: Smooth transitions for minimize, maximize, and window opening/closing states

### Sophisticated Desktop Interactions
- **Collision Detection**: Real-time overlap prevention using geometric calculations
- **Spiral Search Algorithm**: Advanced positioning logic that searches in expanding circles to find available desktop space
- **Icon Swapping**: Drop-to-swap functionality for rearranging desktop icons
- **Bounds Management**: Intelligent repositioning that keeps icons within desktop boundaries
- **Grid-Based Layout**: Invisible grid system for organized icon placement

### Performance Optimizations
- **Lazy Loading**: Components are loaded on-demand using React.lazy() for better initial load times
- **Suspense Boundaries**: Graceful loading states with custom fallback UI
- **Efficient Re-rendering**: Optimized state management to minimize unnecessary component updates
- **Memory Management**: Proper cleanup of event listeners and subscriptions

### Custom Application Framework
Each built-in application is fully implemented with production-quality features:
- **Calculator**: Complete arithmetic engine with keyboard support, memory functions, and error handling
- **Terminal**: Command-line interface with history navigation, cursor animation, and command parsing
- **Notes**: Multi-instance text editor with persistent state management
- **File Explorer**: Hierarchical file system simulation with navigation controls
- **Settings**: Theme management and system configuration interface

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/mohammed054/Browser-Based-OS-System.git
   cd Browser-Based-OS-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

- **Open Applications**: Double-click desktop icons or use the taskbar shortcuts
- **Manage Windows**: Drag window title bars to move, use resize handles, click minimize/maximize/close buttons
- **Organize Icons**: Drag icons around the desktop - they will snap to a grid and avoid overlaps
- **Switch Themes**: Open Settings → toggle between dark and light themes
- **Delete Items**: Drag icons to the Trash Bin to delete them

## 🛠️ Technologies

- **React 19**: Modern React with hooks, concurrent features, and lazy loading
- **Vite**: Fast build tool and development server with hot module replacement
- **CSS3**: Custom styling with animations, responsive design, and CSS Grid/Flexbox
- **JavaScript ES6+**: Modern JavaScript with classes, async/await, and advanced DOM manipulation
- **Zero Dependencies**: No external UI libraries or OS simulation frameworks - everything is custom-built

## 📁 Project Structure

```
Browser-Based-OS-System/
├── public/
│   ├── images/          # Application icons and assets
│   └── manifest.json    # PWA manifest for installation
├── src/
│   ├── components/      # React components (all custom-built)
│   │   ├── Calculator.jsx     # Full-featured calculator with keyboard support
│   │   ├── Chrome.jsx         # Browser simulator
│   │   ├── Desktop.jsx        # Desktop environment with icon management
│   │   ├── DesktopIcon.jsx    # Draggable desktop icons
│   │   ├── ErrorBoundary.jsx  # Error handling component
│   │   ├── FileExplorer.jsx   # File system navigation
│   │   ├── Notes.jsx          # Multi-instance text editor
│   │   ├── Settings.jsx       # System preferences
│   │   ├── Taskbar.jsx        # Windows-style taskbar
│   │   ├── Terminal.jsx       # Command-line interface
│   │   ├── TrashBin.jsx       # File deletion/recovery system
│   │   └── WindowFrame.jsx    # Advanced window management component
│   ├── managers/        # Custom-built manager classes
│   │   ├── AppRegistry.js     # Application registration and metadata
│   │   ├── DesktopManager.js  # Desktop icon positioning and interactions
│   │   └── WindowManager.js   # Window lifecycle and state management
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component-specific styles
│   ├── index.css        # Global styles and CSS variables
│   └── main.jsx         # Application entry point
├── package.json
├── vite.config.js       # Build configuration
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React and Vite
- Inspired by modern desktop operating systems
- Icons from various free icon packs

---

**Enjoy your browser-based computing experience!** 🖥️
