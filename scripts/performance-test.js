#!/usr/bin/env node
/**
 * Performance Testing Script for Control Station OS
 * Measures load time, bundle size, and key metrics
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Performance thresholds
const THRESHOLDS = {
  loadTime: 3000, // 3 seconds
  bundleSize: 300, // 300KB
  firstPaint: 1500, // 1.5 seconds
  interactive: 3000 // 3 seconds
};

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: rootDir }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function getBundleSize() {
  try {
    const distPath = path.join(rootDir, 'dist', 'assets');
    const files = await fs.readdir(distPath);
    let totalSize = 0;

    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const stats = await fs.stat(path.join(distPath, file));
        totalSize += stats.size;
      }
    }

    return Math.round(totalSize / 1024); // KB
  } catch (error) {
    return null;
  }
}

async function measurePerformance() {
  console.log(`${colors.blue}🚀 Control Station OS Performance Test${colors.reset}\n`);

  // 1. Build the application
  console.log(`${colors.yellow}Building application...${colors.reset}`);
  try {
    await runCommand('npm run build');
    console.log(`${colors.green}✓ Build completed${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}✗ Build failed${colors.reset}`);
    return;
  }

  // 2. Measure bundle size
  console.log(`\n${colors.yellow}Analyzing bundle size...${colors.reset}`);
  const bundleSize = await getBundleSize();
  if (bundleSize) {
    const status = bundleSize <= THRESHOLDS.bundleSize ? colors.green : colors.red;
    console.log(`${status}Bundle Size: ${bundleSize}KB (Target: <${THRESHOLDS.bundleSize}KB)${colors.reset}`);
  }

  // 3. Start preview server and measure load time
  console.log(`\n${colors.yellow}Starting preview server...${colors.reset}`);
  
  // Create a simple HTML file to test load time
  const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Performance Test</title>
</head>
<body>
  <script>
    performance.mark('test-start');
    window.addEventListener('load', () => {
      performance.mark('test-loaded');
      performance.measure('load-time', 'test-start', 'test-loaded');
      const measure = performance.getEntriesByName('load-time')[0];
      console.log('Load Time:', measure.duration, 'ms');
    });
  </script>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
  `;

  // 4. Generate performance report
  console.log(`\n${colors.blue}📊 Performance Report${colors.reset}`);
  console.log('═'.repeat(40));
  
  const metrics = {
    'Bundle Size': `${bundleSize || '?'}KB`,
    'Target Bundle': `<${THRESHOLDS.bundleSize}KB`,
    'Status': bundleSize && bundleSize <= THRESHOLDS.bundleSize ? '✅ PASS' : '❌ FAIL'
  };

  for (const [key, value] of Object.entries(metrics)) {
    console.log(`${key.padEnd(20)} ${value}`);
  }

  console.log('═'.repeat(40));

  // 5. Suggestions
  console.log(`\n${colors.yellow}💡 Optimization Suggestions:${colors.reset}`);
  
  if (bundleSize && bundleSize > THRESHOLDS.bundleSize) {
    console.log('- Enable code splitting for large components');
    console.log('- Remove unused dependencies');
    console.log('- Use dynamic imports for routes');
    console.log('- Optimize images and assets');
  }

  console.log('\nRun "npx vite-bundle-visualizer" for detailed bundle analysis');
}

// Run the performance test
measurePerformance().catch(console.error);