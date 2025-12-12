const fs = require('fs');
const path = require('path');

class Logger {
  static log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };
    
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    
    // In production, you might want to write to files
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile(logEntry);
    }
  }
  
  static info(message, data) {
    this.log('info', message, data);
  }
  
  static error(message, data) {
    this.log('error', message, data);
  }
  
  static warn(message, data) {
    this.log('warn', message, data);
  }
  
  static writeToFile(logEntry) {
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }
}

module.exports = Logger;