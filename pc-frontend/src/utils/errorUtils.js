// Utility functions for handling errors consistently across the application
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // If it's already a string, clean it up
  if (typeof error === 'string') {
    return cleanErrorMessage(error);
  }
  
  // If it's an Error object, get the message
  if (error instanceof Error) {
    return cleanErrorMessage(error.message);
  }
  
  // If it's some other object, try to extract meaningful information
  if (typeof error === 'object' && error !== null) {
    // Try to extract common error properties
    const message = error.message || error.detail || error.error || error.msg;
    if (message) {
      return cleanErrorMessage(message);
    }
    
    // If it's a response or fetch error, handle specially
    if (error.status) {
      return cleanErrorMessage(`Request failed with status ${error.status}`);
    }
    
    // Last resort: stringify the object but avoid [object Object]
    try {
      const jsonString = JSON.stringify(error);
      if (jsonString && jsonString !== '{}') {
        return cleanErrorMessage(`Error: ${jsonString}`);
      }
    } catch (stringifyError) {
      // If JSON.stringify fails, fall back to generic message
    }
  }
  
  // If it's some other type, try to get a string representation
  return cleanErrorMessage(String(error));
};

export const cleanErrorMessage = (message) => {
  if (!message) return 'An unknown error occurred';
  
  // Remove "Error:" prefix if present
  message = message.replace(/^Error:\s*/i, '');
  
  // Remove "Failed to fetch" and similar generic messages
  message = message.replace(/Failed to fetch:?\s*/i, '');
  message = message.replace(/Failed to add watermark:?\s*/i, '');
  message = message.replace(/Failed to split PDF:?\s*/i, '');
  message = message.replace(/Failed to protect PDF:?\s*/i, '');
  message = message.replace(/Failed to repair PDF:?\s*/i, '');
  message = message.replace(/Failed to extract pages:?\s*/i, '');
  message = message.replace(/Failed to crop PDF:?\s*/i, '');
  message = message.replace(/Failed to merge PDF:?\s*/i, '');
  
  // Clean up duplicate "Failed" messages
  message = message.replace(/Failed\s*:\s*Failed/i, 'Failed');
  
  // Remove [object Object] and similar unhelpful representations
  message = message.replace(/\[object Object\]/gi, 'Unknown error');
  message = message.replace(/\[object \w+\]/gi, 'System error');
  
  // Ensure the message starts with a capital letter
  message = message.charAt(0).toUpperCase() + message.slice(1);
  
  // If the message is empty after cleaning, return a default
  if (!message.trim()) {
    return 'An error occurred while processing your request';
  }
  
  return message.trim();
};
