'use client';

import { useEffect, useRef } from 'react';

interface ConsoleLog {
  id: number;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

interface ConsoleProps {
  logs: ConsoleLog[];
  onClear: () => void;
}

export default function Console({ logs, onClear }: ConsoleProps) {
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added, but only within the console container
    if (consoleEndRef.current && consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogTypeStyles = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400 border-l-red-500';
      case 'warn':
        return 'text-yellow-400 border-l-yellow-500';
      case 'info':
        return 'text-blue-400 border-l-blue-500';
      default:
        return 'text-gray-300 border-l-gray-500';
    }
  };

  const formatMessage = (message: string) => {
    try {
      // Try to parse as JSON for better object display
      const parsed = JSON.parse(message);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return message;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Console Header */}
      <div className="bg-gray-800 text-white px-3 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Console</h3>
          <span className="text-xs text-gray-400">({logs.length})</span>
        </div>
        <button
          onClick={onClear}
          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Console Content */}
      <div 
        ref={consoleContainerRef}
        className="flex-1 overflow-y-auto p-2 font-mono text-sm scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 italic text-center py-8">
            Console output will appear here...
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-2 border-l-2 bg-gray-800 rounded-r text-xs ${getLogTypeStyles(log.type)}`}
              >
                <div className="space-y-1">
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {formatMessage(log.message)}
                  </pre>
                  <div className="text-xs text-gray-500">
                    {log.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
