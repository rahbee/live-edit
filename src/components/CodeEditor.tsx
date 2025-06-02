'use client';

import { Editor } from '@monaco-editor/react';
import { useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
  theme?: string;
  fontSize?: number;
  onOpenSettings?: () => void;
}

export default function CodeEditor({ 
  code, 
  onCodeChange, 
  onRunCode, 
  theme = 'vs-dark',
  fontSize = 14,
  onOpenSettings 
}: CodeEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Add keyboard shortcut for running code (Ctrl+Enter / Cmd+Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode();
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium">JavaScript Editor</h2>
          <span className="text-xs text-gray-400">Press Ctrl+Enter to run</span>
        </div>
        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
              title="Settings"
            >
              ⚙️
            </button>
          )}
          <button
            onClick={onRunCode}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Run Code
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          onMount={handleEditorDidMount}
          theme={theme}
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            autoIndent: 'full',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              alwaysConsumeMouseWheel: false,
            },
            overviewRulerLanes: 2,
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}
