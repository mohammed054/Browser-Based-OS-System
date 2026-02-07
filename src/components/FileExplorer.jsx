import { useState } from 'react';

const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState('Home');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [clipboard, setClipboard] = useState(null);

  // Mock file system structure
  const fileSystem = {
    'Home': [
      { icon: '📁', name: 'Documents', size: '2.1 GB', type: 'folder' },
      { icon: '📁', name: 'Downloads', size: '1.8 GB', type: 'folder' },
      { icon: '📁', name: 'Pictures', size: '5.2 GB', type: 'folder' },
      { icon: '📁', name: 'Videos', size: '12.4 GB', type: 'folder' },
      { icon: '📁', name: 'Music', size: '3.7 GB', type: 'folder' },
    ],
    'Documents': [
      { icon: '📄', name: 'readme.txt', size: '2 KB', type: 'file' },
      { icon: '📄', name: 'report.docx', size: '1.2 MB', type: 'file' },
      { icon: '📄', name: 'notes.txt', size: '5 KB', type: 'file' },
    ],
    'Downloads': [
      { icon: '📦', name: 'setup.exe', size: '45 MB', type: 'file' },
      { icon: '📄', name: 'manual.pdf', size: '8.5 MB', type: 'file' },
    ],
    'Pictures': [
      { icon: '🖼️', name: 'vacation.jpg', size: '2.3 MB', type: 'file' },
      { icon: '🖼️', name: 'family.png', size: '1.8 MB', type: 'file' },
    ],
    'Videos': [
      { icon: '🎥', name: 'movie.mp4', size: '1.2 GB', type: 'file' },
    ],
    'Music': [
      { icon: '🎵', name: 'song.mp3', size: '5 MB', type: 'file' },
    ],
    'Desktop': [
      { icon: '📄', name: 'shortcut.lnk', size: '1 KB', type: 'file' },
    ],
    'C:': [
      { icon: '📁', name: 'Windows', size: '15 GB', type: 'folder' },
      { icon: '📁', name: 'Program Files', size: '25 GB', type: 'folder' },
      { icon: '📁', name: 'Users', size: '50 GB', type: 'folder' },
    ],
    'D:': [
      { icon: '📁', name: 'Data', size: '100 GB', type: 'folder' },
      { icon: '📁', name: 'Backup', size: '200 GB', type: 'folder' },
    ],
  };

  const navigationItems = [
    { icon: '🏠', name: 'Home', path: 'Home' },
    { icon: '📂', name: 'Desktop', path: 'Desktop' },
    { icon: '📁', name: 'Documents', path: 'Documents' },
    { icon: '📥', name: 'Downloads', path: 'Downloads' },
    { icon: '💽', name: 'Local Disk (C:)', path: 'C:' },
    { icon: '💽', name: 'Local Disk (D:)', path: 'D:' },
  ];

  const getCurrentFiles = () => {
    return fileSystem[currentPath] || [];
  };

  const handleNavClick = (path) => {
    setCurrentPath(path);
    setSelectedFiles([]);
  };

  const handleFileClick = (fileName, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      setSelectedFiles(prev =>
        prev.includes(fileName)
          ? prev.filter(f => f !== fileName)
          : [...prev, fileName]
      );
    } else {
      setSelectedFiles([fileName]);
    }
  };

  const handleFileDoubleClick = (file) => {
    if (file.type === 'folder') {
      setCurrentPath(file.name);
      setSelectedFiles([]);
    }
  };

  const handleNewFolder = () => {
    const newFolderName = `New folder ${getCurrentFiles().filter(f => f.type === 'folder').length + 1}`;
    // In a real app, this would create a folder
    // For demo, we'll just show it was clicked
    alert(`New folder "${newFolderName}" would be created in ${currentPath}`);
  };

  const handleCopy = () => {
    if (selectedFiles.length > 0) {
      setClipboard({ action: 'copy', files: selectedFiles, from: currentPath });
    }
  };

  const handlePaste = () => {
    if (clipboard) {
      alert(`${clipboard.action === 'copy' ? 'Copied' : 'Cut'} ${clipboard.files.length} item(s) would be pasted here`);
      // In a real app, this would move/copy files
    }
  };

  const handleDelete = () => {
    if (selectedFiles.length > 0) {
      alert(`${selectedFiles.length} item(s) would be deleted`);
      // In a real app, this would delete files
    }
  };

  return (
    <div className="file-explorer-app">
      <div className="explorer-toolbar">
        <div className="toolbar-button" title="New folder" onClick={handleNewFolder}>📁 New</div>
        <div className="toolbar-button" title="Copy" onClick={handleCopy}>📋 Copy</div>
        <div className="toolbar-button" title="Paste" onClick={handlePaste}>📄 Paste</div>
        <div className="toolbar-button" title="Delete" onClick={handleDelete}>🗑️ Delete</div>
      </div>
      <div className="explorer-main">
        <div className="explorer-nav">
          <h4>Quick access</h4>
          {navigationItems.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </div>
          ))}
          <h4>This PC</h4>
          {navigationItems.slice(4).map((item, index) => (
            <div
              key={index + 4}
              className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </div>
          ))}
        </div>
        <div className="explorer-content">
          <div className="address-bar">
            <span>📁 {currentPath}</span>
          </div>
          <div className="file-grid">
            {getCurrentFiles().map((item, index) => (
              <div
                key={index}
                className={`file-item ${selectedFiles.includes(item.name) ? 'selected' : ''}`}
                onClick={(e) => handleFileClick(item.name, e)}
                onDoubleClick={() => handleFileDoubleClick(item)}
              >
                <div className="file-icon">{item.icon}</div>
                <div className="file-name">{item.name}</div>
                <div className="file-size">{item.size}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
