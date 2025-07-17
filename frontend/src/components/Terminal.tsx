import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, Square, Trash2 } from 'lucide-react';

interface TerminalProps {
  isConnected: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ isConnected }) => {
  const [output, setOutput] = useState<string[]>([
    '$ AI PenTest Platform Terminal v1.0',
    '$ Ready for penetration testing operations...',
    '$ Type "help" for available commands',
    '',
  ]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (command: string) => {
    const newOutput = [...output, `$ ${command}`];
    
    switch (command.toLowerCase()) {
      case 'help':
        newOutput.push(
          'Available commands:',
          '  scan <target>     - Start network scan',
          '  webtest <url>     - Start web penetration test',
          '  classify <url>    - Classify website',
          '  status           - Show current status',
          '  clear            - Clear terminal',
          '  help             - Show this help message',
          ''
        );
        break;
      case 'clear':
        setOutput(['$ Terminal cleared', '']);
        return;
      case 'status':
        newOutput.push(
          `Connection: ${isConnected ? 'Connected' : 'Disconnected'}`,
          `Status: ${isRunning ? 'Running' : 'Idle'}`,
          `Agent: Ready for operations`,
          ''
        );
        break;
      default:
        if (command.startsWith('scan ')) {
          const target = command.substring(5);
          newOutput.push(`Initiating network scan on ${target}...`);
          simulateOutput(newOutput, 'network');
        } else if (command.startsWith('webtest ')) {
          const url = command.substring(8);
          newOutput.push(`Starting web penetration test on ${url}...`);
          simulateOutput(newOutput, 'web');
        } else if (command.startsWith('classify ')) {
          const url = command.substring(9);
          newOutput.push(`Classifying website ${url}...`);
          simulateOutput(newOutput, 'classify');
        } else if (command.trim() === '') {
          newOutput.push('');
        } else {
          newOutput.push(`Command not found: ${command}`, '');
        }
    }
    
    setOutput(newOutput);
  };

  const simulateOutput = (currentOutput: string[], type: string) => {
    setIsRunning(true);
    
    const simulate = (lines: string[], delay: number = 1000) => {
      lines.forEach((line, index) => {
        setTimeout(() => {
          setOutput(prev => [...prev, line]);
          if (index === lines.length - 1) {
            setIsRunning(false);
          }
        }, delay * (index + 1));
      });
    };

    switch (type) {
      case 'network':
        simulate([
          'Scanning ports 1-1000...',
          'Port 22: Open (SSH)',
          'Port 80: Open (HTTP)',
          'Port 443: Open (HTTPS)',
          'Scan complete. 3 open ports found.',
          ''
        ]);
        break;
      case 'web':
        simulate([
          'Analyzing web application...',
          'Checking for SQL injection vulnerabilities...',
          'Testing XSS vulnerabilities...',
          'Checking authentication bypass...',
          'Scan complete. 2 vulnerabilities found.',
          ''
        ]);
        break;
      case 'classify':
        simulate([
          'Analyzing website content...',
          'Extracting features...',
          'Running AI classification model...',
          'Classification: E-commerce (95% confidence)',
          'Analysis complete.',
          ''
        ]);
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  const clearTerminal = () => {
    setOutput(['$ Terminal cleared', '']);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-5 w-5 text-red-400" />
          <span className="text-sm font-medium text-gray-200">AI Agent Terminal</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            {isRunning ? (
              <Square className="h-4 w-4 text-red-400" />
            ) : (
              <Play className="h-4 w-4 text-red-400" />
            )}
          </button>
          
          <button
            onClick={clearTerminal}
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-black/20"
      >
        {output.map((line, index) => (
          <div key={index} className="text-red-400 whitespace-pre-wrap">
            {line}
          </div>
        ))}
        
        {!isRunning && (
          <div className="flex items-center text-red-400">
            <span className="mr-2">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent outline-none text-green-400"
              className="flex-1 bg-transparent outline-none text-red-400"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};