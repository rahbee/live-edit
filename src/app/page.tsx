'use client';

import { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import Console from '@/components/Console';
import Settings from '@/components/Settings';
import { executeJavaScript } from '@/utils/codeExecution';
import { formatCode } from '@/utils/codeFormatting';

interface ConsoleLog {
  id: number;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

const defaultCode = `// Welcome to the Live JavaScript Editor!
// Write your JavaScript code here and press Ctrl+Enter or click "Run Code" to execute

console.log("Hello, World!");

// Try some examples:
const numbers = [1, 2, 3, 4, 5];
console.log("Numbers:", numbers);

const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);

// You can also use modern JavaScript features
const greet = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greet("Developer"));

// Objects and arrays work too
const person = {
  name: "John",
  age: 30,
  hobbies: ["coding", "reading", "gaming"]
};

console.log("Person:", person);`;

export default function Home() {
  // Function to detect system dark mode preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'github';
    }
    return 'github'; // Default fallback, changed from vs-dark
  };

  const [code, setCode] = useState(defaultCode);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [logCounter, setLogCounter] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(getSystemTheme()); // Use system theme by default
  const [fontSize, setFontSize] = useState(15); // Default font size to 15

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCode = localStorage.getItem('live-editor-code');
      const savedLogs = localStorage.getItem('live-editor-logs');
      const savedTheme = localStorage.getItem('live-editor-theme');
      const savedFontSize = localStorage.getItem('live-editor-fontsize');

      if (savedCode) {
        setCode(savedCode);
      }

      if (savedLogs) {
        try {
          const parsedLogs: ConsoleLog[] = JSON.parse(savedLogs);
          setLogs(parsedLogs.map((log) => ({
            ...log,
            timestamp: new Date(log.timestamp)
          })));
          setLogCounter(parsedLogs.length);
        } catch (error) {
          console.error('Failed to parse saved logs:', error);
        }
      }

      if (savedTheme) {
        setTheme(savedTheme);
      }

      if (savedFontSize) {
        setFontSize(Number(savedFontSize));
      }
    }
  }, []);

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && code !== defaultCode) {
      localStorage.setItem('live-editor-code', code);
    }
  }, [code]);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && logs.length > 0) {
      localStorage.setItem('live-editor-logs', JSON.stringify(logs));
    }
  }, [logs]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('live-editor-theme', theme);
    }
  }, [theme]);

  // Save font size to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('live-editor-fontsize', fontSize.toString());
    }
  }, [fontSize]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRunCode = () => {
    const result = executeJavaScript(code);
    const newLogs = result.logs.map(log => ({
      id: logCounter + Math.random(),
      type: log.type,
      message: log.message,
      timestamp: new Date()
    }));

    setLogs(prevLogs => [...prevLogs, ...newLogs]);
    setLogCounter(prev => prev + newLogs.length);
  };

  const handleClearConsole = () => {
    setLogs([]);
    setLogCounter(0);
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('live-editor-logs');
    }
  };

  const handleFormatCode = () => {
    const formatted = formatCode(code);
    setCode(formatted);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
  };

  return (
    <div className="h-screen flex bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor - 70% width (left side) */}
        <div className="overflow-hidden border-r border-gray-700" style={{ width: '70%' }}>
          <CodeEditor
            code={code}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            theme={theme}
            fontSize={fontSize}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>

        {/* Console - 30% width (right side) */}
        <div className="overflow-hidden" style={{ width: '30%' }}>
          <Console
            logs={logs}
            onClear={handleClearConsole}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        onFormatCode={handleFormatCode}
      />
    </div>
  );
}
