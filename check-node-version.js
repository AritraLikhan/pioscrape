const { execSync } = require('child_process');

const checkNodeVersion = () => {
  try {
    execSync('node -v', { stdio: 'ignore' });
    console.log('Node.js is installed.');
  } catch (error) {
    console.error('Node.js is not installed. Please install Node.js from https://nodejs.org/');
    process.exit(1);
  }
};

checkNodeVersion();
