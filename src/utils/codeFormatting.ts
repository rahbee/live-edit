// Simple code formatting function
export function formatCode(code: string): string {
  try {
    // Basic JavaScript formatting - add proper indentation and spacing
    let formatted = code;
    
    // Add spaces around operators
    formatted = formatted.replace(/([^\s])([=+\-*/%<>!&|]+)([^\s])/g, '$1 $2 $3');
    
    // Add space after commas
    formatted = formatted.replace(/,([^\s])/g, ', $1');
    
    // Add space after semicolons (if not at end of line)
    formatted = formatted.replace(/;([^\s\n])/g, '; $1');
    
    // Add space after keywords
    formatted = formatted.replace(/\b(if|for|while|function|const|let|var|return|else|try|catch|finally)\(/g, '$1 (');
    
    return formatted;
  } catch (error) {
    console.error('Failed to format code:', error);
    return code; // Return original code if formatting fails
  }
}
