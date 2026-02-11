import { useState, useEffect, useRef } from 'react';
import './Terminal.css';
import { PROFILE } from '../config/profile';

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
        output = `🚀 Portfolio Terminal v1.0

Available commands:
  help      - Show this help message
  clear     - Clear the terminal
  whoami    - Display user information
  skills     - Show technical skills summary
  projects   - List portfolio projects
  education  - Display education background
  contact    - Show contact information
  date      - Show current date and time
  ls        - List directory contents
  open      - Open an application
  about     - About this terminal
  exit      - End terminal session
  
  🥚 Easter Eggs:
  sudo rm -rf / - Classic system destruction
  hack nasa     - Try your hacking skills
  konami        - Gaming code secret
  matrix        - Enter the digital realm
  sudo unlock   - Administrator access
  
  sudo      - Administrator commands`;
        break;

      case 'clear':
        setCommandHistory([
          '🚀 Portfolio Terminal v1.0',
          'Type "help" to see available commands.',
          'Use arrow keys to navigate command history.',
          ''
        ]);
        return;

      case 'whoami':
        output = `${PROFILE.name}
${PROFILE.title}
${PROFILE.location}

Specializing in:
⚛️ React & Advanced Frontend
🎨 Creative UI/UX Design  
🏗️ System Architecture
⚡ Performance Optimization`;
        break;

      case 'skills':
        output = `📊 Technical Skills Summary

Frontend:
  React ██████████ 90%
  JavaScript ████████░ 85%
  TypeScript █████░░░░ 75%
  HTML/CSS  ██████████ 90%

Backend:
  Node.js   ████████░ 85%
  Python    ███████░░░ 80%
  APIs      ████████░ 85%

Tools:
  Git       ████████░ 85%
  Docker    █████░░░░░ 70%
  AWS       █████░░░░░ 65%

Total: 15+ technologies mastered`;
        break;

      case 'projects':
        output = `📂 Portfolio Projects

1. 🚀 Browser OS Portfolio [COMPLETED]
   Advanced React system with window management
   
2. 🛒 E-Commerce Platform [WIP]
   Full-stack solution with payment processing
   
3. 🤖 AI Chat Assistant [PLANNING]
   ML-powered conversational interface
   
4. 📚 Component Library [COMPLETED]
   Reusable React components + TypeScript

Total: 4 projects • 3 completed • 1 in progress`;
        break;

      case 'education':
        output = `🎓 Education Background

Bachelor of Science in Computer Science
University of Technology (2015-2019)

• GPA: 3.8/4.0 (Magn Cum Laude)
• Dean's List: 6 semesters
• President: Coding Club
• Focus: Software Engineering & UI/UX

Specialized in:
○ Frontend Development
○ User Experience Design
○ System Architecture`;
        break;

      case 'contact':
        output = `📧 Contact Information

Primary:
  Email: ${PROFILE.email}
  Location: ${PROFILE.location}

Professional:
  LinkedIn: ${PROFILE.linkedin}
  GitHub:   ${PROFILE.github}

Available for:
○ Full-time opportunities
○ Freelance projects
○ Open source collaboration

Let's build something amazing together!`;
        break;

      case 'date':
        output = `Current system time: ${new Date().toString()}

System uptime: ${Math.floor(Math.random() * 24 + 1)} hours
Memory usage: ${Math.floor(Math.random() * 40 + 30)}%
CPU usage: ${Math.floor(Math.random() * 30 + 10)}%`;
        break;

      case 'ls':
        output = `📁 Current Directory:

Applications/
├── 📄 About.me
├── 🚀 Projects.app
├── 💻 Skills.sys
├── 📱 Terminal.app
├── 📋 Resume.pdf
├── ✉️ Contact.app
├── ⚠️ ErrorLog.sys
└── 🗑️ Trash/

Total: 8 items • System: Healthy`;
        break;

      case 'about':
        output = `💻 Portfolio Terminal v1.0
======================================
An interactive resume experience built entirely in the browser.

Technology Stack:
• React (Hooks & State Management)
• CSS3 (Animations & Effects)
• JavaScript (ES6+)
• Creative UI Engineering

Purpose:
• Showcase frontend development skills
• Demonstrate system-level thinking
• Provide an engaging user experience

Built with ❤️ by ${PROFILE.name}

🐛 Hidden features: Try 'sudo rm -rf /' or 'hack nasa'`;
        break;

      case 'sudo unlock':
        output = `🔒 sudo unlock
Access denied.

Nice try! 😄

This portfolio system is already 
optimized for your viewing pleasure.

No administrator privileges needed!
• All features are accessible
• No hidden content
• Just pure engineering showcase

Enjoy exploring the apps!`;
        break;

      case 'sudo rm -rf /':
        output = `💀 sudo rm -rf /
🚨 SYSTEM SELF-DESTRUCTION INITIATED 🚨
Just kidding... nice try though! 😄

System integrity: 100% (can't delete pure code)
Portfolio security: MAXIMUM
Your curiosity: Notable 👍

This command would delete everything,
but this portfolio is built to last!

Try 'help' for safer commands.`;
        break;

      case 'hack nasa':
        output = `🛸 hack nasa
═══════════════════════════════════
🔐 NASA FIREWALL DETECTED
🛡️ Pentagon counter-hack initiated!
🔍 IP trace: 127.0.0.1 (your imagination)
👨‍🚀 Elon Musk: "Not again, buddy!"
🌍 International Space Station: laughing

═══════════════════════════════════
ACCESS DENIED (obviously)
Reason: This is a portfolio, not a movie

Maybe try 'projects' instead? 🚀`;
        break;

      case 'konami':
        output = `🎮 konami
↑ ↑ ↓ ↓ ← → ← → B A

Classic gaming code detected!
Activating secret mode...
🌟 Developer mode enabled 🌟

You've unlocked:
• Infinite scroll (of this terminal)
• RGB lighting (in your imagination)
• 1337% productivity boost
• Access to the source (it's already there!)

You found the Konami egg! 🥚`;
        break;

      case 'matrix':
        output = `💻 matrix
Wake up, Neo...
The Matrix has you...
Follow the white rabbit 🐰

Wait, wrong movie. This is just:
• React state management
• CSS animations
• JavaScript fun

No agents, just clean code! 🧹
But we do have pills:
🔴 Red pill: View source code
🔵 Blue pill: Continue exploring`;
        break;

      case 'exit':
        output = `👋 exit
Thank you for using Portfolio Terminal v1.0!

Session statistics:
⏱️ Time spent: Precious seconds
🧠 Knowledge gained: Immeasurable
💻 Code appreciated: 100%
😄 Easter eggs found: ${Math.random() > 0.5 ? 'All of them!' : 'Keep looking...'}

Terminal session ended.
Type 'help' to start a new adventure!

Remember: The best portfolios are interactive ✨`;
        break;

      case 'sudo':
        output = `Usage: sudo <command>

Available sudo commands:
  sudo unlock - Easter egg command

Note: This is a demo environment.
All features are already accessible.`;
        break;

      default:
        if (trimmedCommand.startsWith('echo ')) {
          output = trimmedCommand.substring(5);
        } else if (trimmedCommand.startsWith('open ')) {
          const app = trimmedCommand.substring(5);
          output = `🚀 Opening ${app}...
   Use desktop icons to navigate between apps.`;
        } else if (trimmedCommand.startsWith('sudo ')) {
          const subCommand = trimmedCommand.substring(5);
          output = `sudo: ${subCommand}: command not found
Type "sudo" to see available administrator commands.`;
        } else {
          output = `❌ Command not found: ${trimmedCommand}
Type "help" to see available commands.`;
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

