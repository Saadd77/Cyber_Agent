import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Square, Trash2 } from 'lucide-react';

interface TerminalProps {
  isConnected: boolean;
}

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

export const Terminal: React.FC<TerminalProps> = ({ isConnected }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'AI Penetration Testing Platform Terminal v1.0',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Type "help" for available commands',
      timestamp: new Date()
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };

    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleClick);
      return () => terminal.removeEventListener('click', handleClick);
    }
  }, []);

  const addLine = (content: string, type: 'command' | 'output' | 'error' = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setHistory(prev => [...prev, newLine]);
  };

  const executeCommand = async (command: string) => {
    // Add command to history
    addLine(`$ ${command}`, 'command');
    setCommandHistory(prev => [...prev, command]);

    // Simulate command execution
    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      case 'help':
        addLine('Available commands:');
        addLine('  help          - Show this help message');
        addLine('  clear         - Clear terminal');
        addLine('  status        - Show system status');
        addLine('  scan <target> - Start security scan');
        addLine('  history       - Show command history');
        addLine('  exit          - Close terminal session');
        break;
        
      case 'clear':
        setHistory([]);
        break;
        
      case 'status':
        addLine(`Connection: ${isConnected ? 'Connected' : 'Disconnected'}`);
        addLine(`System: AI PenTest Platform v1.0`);
        addLine(`Time: ${new Date().toLocaleString()}`);
        break;
        
      case 'history':
        commandHistory.forEach((cmd, index) => {
          addLine(`${index + 1}: ${cmd}`);
        });
        break;
        
      case 'exit':
        addLine('Terminal session ended.');
        break;
        
      default:
        if (cmd.startsWith('scan ')) {
          const target = cmd.substring(5);
          if (target) {
            addLine(`Starting security scan on: ${target}`);
            addLine('Initializing scan modules...');
            // Simulate scan progress
            setTimeout(() => addLine('Port scanning in progress...'), 1000);
            setTimeout(() => addLine('Vulnerability assessment running...'), 2000);
            setTimeout(() => addLine(`Scan completed for ${target}`), 3000);
          } else {
            addLine('Usage: scan <target>', 'error');
          }
        } else {
          addLine(`Command not found: ${command}`, 'error');
          addLine('Type "help" for available commands');
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input.trim());
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const clearTerminal = () => {
    setHistory([]);
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-5 w-5 text-green-400" />
          <span className="text-white font-medium">Terminal</span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => executeCommand('help')}
            className="p-2 rounded hover:bg-gray-700 transition-colors"
            title="Help"
          >
            <Play className="h-4 w-4 text-gray-400" />
          </button>
          <button
            onClick={clearTerminal}
            className="p-2 rounded hover:bg-gray-700 transition-colors"
            title="Clear"
          >
            <Trash2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm"
      >
        {history.map((line) => (
          <div key={line.id} className={`mb-1 ${getLineColor(line.type)}`}>
            {line.content}
          </div>
        ))}
        
        {/* Current Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-blue-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-green-400"
            placeholder="Enter command..."
            autoFocus
          />
          <span className="text-green-400 terminal-cursor">|</span>
        </form>
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Ready for commands</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};