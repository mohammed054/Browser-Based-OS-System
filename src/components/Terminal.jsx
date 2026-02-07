import { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const Terminal = () => {
  const [commandHistory, setCommandHistory] = useState([
    'Welcome to Browser Terminal',
    'Type "help" to see available commands.',
    'Use arrow keys to navigate command history.',
    ''
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Cursor blink animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (command) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    let output = '';

    switch (trimmedCommand.toLowerCase()) {
      case 'help':
        output = `Available commands:
  help    - Show this help message
  clear   - Clear the terminal
  echo    - Echo the provided text
  date    - Show current date and time
  ls      - List directory contents
  open    - Open an application
  about   - About this terminal`;
        break;

      case 'clear':
        setCommandHistory([
          'Welcome to Browser Terminal',
          'Type "help" to see available commands.',
          'Use arrow keys to navigate command history.',
          ''
        ]);
        return;

      case 'date':
        output = new Date().toString();
        break;

      case 'ls':
        output = `Directory listing:
  Desktop/
  Documents/
  Downloads/
  Pictures/
  Music/
  Videos/`;
        break;

      case 'about':
        output = `Browser Terminal v1.0
A simulated terminal environment for the Browser OS.
Built with React and CSS.`;
        break;

      default:
        if (trimmedCommand.startsWith('echo ')) {
          output = trimmedCommand.substring(5);
        } else if (trimmedCommand.startsWith('open ')) {
          const app = trimmedCommand.substring(5);
          output = `Opening ${app}... (simulated)`;
        } else {
          output = `Command not found: ${trimmedCommand}. Type 'help' for available commands.`;
        }
        break;
    }

    setCommandHistory(prev => [...prev, `$ ${trimmedCommand}`, output]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Navigate command history (simplified - only shows executed commands)
      const executedCommands = commandHistory.filter(line => line.startsWith('$ '));
      if (executedCommands.length > 0) {
        const newIndex = Math.min(historyIndex + 1, executedCommands.length - 1);
        setHistoryIndex(newIndex);
        const command = executedCommands[executedCommands.length - 1 - newIndex].substring(2);
        setCurrentCommand(command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const executedCommands = commandHistory.filter(line => line.startsWith('$ '));
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const command = executedCommands[executedCommands.length - 1 - newIndex].substring(2);
        setCurrentCommand(command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div className="terminal" onClick={handleTerminalClick}>
      <div className="terminal-content" ref={terminalRef}>
        {commandHistory.map((line, index) => (
          <div key={index} className="terminal-line">{line}</div>
        ))}
        <div className="terminal-line">
          <span className="terminal-prompt">$ </span>
          {currentCommand}
          <span className={`terminal-cursor ${cursorVisible ? 'visible' : ''}`}>|</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="text"
        className="terminal-input"
        value={currentCommand}
        onChange={(e) => setCurrentCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
};

export default Terminal;
