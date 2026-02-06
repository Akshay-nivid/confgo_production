const { execSync } = require('child_process');
const path = require('path');

function compileTS() {
  console.log('Compiling TypeScript files...');
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('TypeScript compilation complete.');
}

compileTS();
