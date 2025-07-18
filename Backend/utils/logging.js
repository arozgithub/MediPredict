/**
 * Simple logging utility for the PredictiX backend
 */

const logging = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  },
  
  error: (message) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  },
  
  warn: (message) => {
    console.warn(`[WARNING] ${new Date().toISOString()}: ${message}`);
  },
  
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
  }
};

export default logging;