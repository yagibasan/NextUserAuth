// This file only exists to maintain compatibility with existing npm scripts
// The actual application runs directly with Vite on port 5000

import { spawn } from 'child_process';

console.log('Starting Vite development server on port 5000...');

const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  stdio: 'inherit',
  shell: true
});

vite.on('error', (error) => {
  console.error('Failed to start Vite:', error);
  process.exit(1);
});

vite.on('exit', (code) => {
  process.exit(code || 0);
});
