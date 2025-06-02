interface ExecutionResult {
  logs: Array<{
    type: 'log' | 'error' | 'warn' | 'info';
    message: string;
  }>;
}

export function executeJavaScript(code: string): ExecutionResult {
  const logs: ExecutionResult['logs'] = [];
  
  // Create a mock console object to capture output
  const mockConsole = {
    log: (...args: unknown[]) => {
      logs.push({
        type: 'log',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')
      });
    },
    error: (...args: unknown[]) => {
      logs.push({
        type: 'error',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')
      });
    },
    warn: (...args: unknown[]) => {
      logs.push({
        type: 'warn',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')
      });
    },
    info: (...args: unknown[]) => {
      logs.push({
        type: 'info',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')
      });
    }
  };

  try {
    // Create a function with the user code and mock console
    const executeCode = new Function('console', code);
    executeCode(mockConsole);
  } catch (error) {
    logs.push({
      type: 'error',
      message: error instanceof Error ? error.message : String(error)
    });
  }

  return { logs };
}
