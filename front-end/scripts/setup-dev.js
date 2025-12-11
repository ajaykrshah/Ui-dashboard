#!/usr/bin/env node

/**
 * Modern Development Setup for Node.js 24.x and npm 11.x
 * Optimizes development environment for maximum performance
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up development environment with Node.js 24.x and npm 11.x\n');

// Check prerequisites
function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');

  const nodeVersion = process.version;
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();

  console.log(`  Node.js: ${nodeVersion}`);
  console.log(`  npm: ${npmVersion}`);

  if (parseInt(nodeVersion.slice(1)) < 24) {
    console.error('❌ Node.js 24.x is required. Please upgrade.');
    process.exit(1);
  }

  if (parseInt(npmVersion.split('.')[0]) < 11) {
    console.error('❌ npm 11.x is required. Please upgrade with: npm install -g npm@latest');
    process.exit(1);
  }

  console.log('✅ Prerequisites met\n');
}

// Setup npm for optimal performance
function setupNpm() {
  console.log('📦 Configuring npm for Node.js 24.x...');

  try {
    // Configure npm for performance
    execSync('npm config set fund false', { stdio: 'inherit' });
    execSync('npm config set audit-level moderate', { stdio: 'inherit' });
    execSync('npm config set prefer-offline true', { stdio: 'inherit' });
    execSync('npm config set cache-max 86400000', { stdio: 'inherit' });

    console.log('✅ npm configuration optimized\n');
  } catch (error) {
    console.error('❌ Failed to configure npm:', error.message);
  }
}

// Clean and install dependencies
function installDependencies() {
  console.log('📦 Installing dependencies with npm 11.x optimizations...');

  try {
    // Clean previous installations
    if (fs.existsSync('node_modules')) {
      console.log('🧹 Cleaning previous installation...');
      execSync('npm run clean', { stdio: 'inherit' });
    }

    // Install with npm 11.x performance features
    console.log('📥 Installing dependencies...');
    execSync('npm install --timing --loglevel=warn', {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=8192',
      },
    });

    console.log('✅ Dependencies installed\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Setup development tools
function setupDevTools() {
  console.log('🔧 Setting up development tools...');

  try {
    // Setup Husky hooks
    if (fs.existsSync('.husky')) {
      console.log('🪝 Setting up git hooks...');
      execSync('npm run prepare', { stdio: 'inherit' });
    }

    // Run compatibility check
    console.log('🧪 Running compatibility check...');
    execSync('npm run check:compatibility', { stdio: 'inherit' });

    console.log('✅ Development tools configured\n');
  } catch (error) {
    console.error('❌ Failed to setup development tools:', error.message);
  }
}

// Run initial validation
function runValidation() {
  console.log('🧪 Running initial validation...');

  try {
    // TypeScript check
    console.log('📝 Checking TypeScript...');
    execSync('npm run type-check', { stdio: 'inherit' });

    // ESLint check
    console.log('🧹 Running linter...');
    execSync('npm run lint', { stdio: 'inherit' });

    // Format check
    console.log('✨ Checking formatting...');
    execSync('npm run format:check', { stdio: 'inherit' });

    console.log('✅ Validation passed\n');
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    console.log('💡 Run "npm run lint:fix" and "npm run format" to fix issues');
  }
}

// Performance optimization tips
function showOptimizationTips() {
  console.log('💡 Node.js 24.x Performance Optimization Tips:\n');

  console.log('🚀 Development Commands:');
  console.log('  npm run dev --turbo      # Use Turbopack for faster dev builds');
  console.log('  npm run build:analyze    # Analyze bundle size');
  console.log('  npm run check:performance # Monitor build performance');
  console.log('');

  console.log('⚡ Environment Variables for Performance:');
  console.log('  NODE_OPTIONS="--max-old-space-size=8192"');
  console.log('  ANALYZE=true npm run build  # Enable bundle analyzer');
  console.log('');

  console.log('🎯 VS Code Extensions (recommended):');
  console.log('  - ES6+ Snippets');
  console.log('  - TypeScript Importer');
  console.log('  - Prettier');
  console.log('  - ESLint');
  console.log('  - Tailwind CSS IntelliSense');
  console.log('');
}

// Main setup function
function main() {
  try {
    checkPrerequisites();
    setupNpm();
    installDependencies();
    setupDevTools();
    runValidation();
    showOptimizationTips();

    console.log('🎉 Development environment setup complete!');
    console.log('🚀 Run "npm run dev" to start developing');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkPrerequisites, installDependencies, main, setupNpm };
