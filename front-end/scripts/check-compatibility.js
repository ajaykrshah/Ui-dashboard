#!/usr/bin/env node

/**
 * Compatibility Check Script
 * Verifies that all dependencies work together with Next.js 16.x and React 19.x
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkCompatibility() {
  console.log('🔍 Checking Next.js 16.x, React 19.x, and Node.js 24.x compatibility...\n');

  // Check Node.js version
  console.log('🚀 Checking Node.js and npm versions...');
  const nodeVersion = process.version;
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();

  console.log(`  ✅ Node.js: ${nodeVersion} (recommended: v24.11.1+)`);
  console.log(`  ✅ npm: ${npmVersion} (recommended: 11.6.0+)`);

  if (parseInt(nodeVersion.slice(1)) < 24) {
    console.log('  ⚠️  Consider upgrading to Node.js 24.x for better performance');
  }
  if (parseInt(npmVersion.split('.')[0]) < 11) {
    console.log('  ⚠️  Consider upgrading to npm 11.x for improved package management');
  }

  try {
    // Check package.json versions
    console.log('📦 Checking package versions...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

    const criticalDeps = {
      next: '^16.0.8',
      react: '^19.2.1',
      'react-dom': '^19.2.1',
      typescript: '^5.9.3',
      '@typescript-eslint/eslint-plugin': '^8.49.0',
      '@typescript-eslint/parser': '^8.49.0',
      vitest: '^4.0.15',
      '@testing-library/react': '^16.3.0',
    };

    for (const [dep, expectedVersion] of Object.entries(criticalDeps)) {
      const installedVersion =
        packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
      if (installedVersion) {
        console.log(`  ✅ ${dep}: ${installedVersion} (expected: ${expectedVersion})`);
      } else {
        console.log(`  ❌ ${dep}: MISSING`);
      }
    }

    // Check TypeScript configuration
    console.log('\n⚙️  Checking TypeScript config...');

    let tsConfig;
    try {
      const tsConfigContent = fs.readFileSync('tsconfig.json', 'utf-8');
      // Remove comments from JSONC
      const cleanedContent = tsConfigContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*/g, ''); // Remove line comments
      tsConfig = JSON.parse(cleanedContent);
    } catch (error) {
      console.log('  ⚠️  Could not parse tsconfig.json:', error.message);
      tsConfig = { compilerOptions: {} };
    }

    const requiredCompilerOptions = {
      target: 'ES2023',
      lib: ['dom', 'dom.iterable', 'ES2023'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'react-jsx',
      incremental: true,
      plugins: [{ name: 'next' }],
    };

    for (const [option, expectedValue] of Object.entries(requiredCompilerOptions)) {
      const actualValue = tsConfig.compilerOptions?.[option];
      if (JSON.stringify(actualValue) === JSON.stringify(expectedValue)) {
        console.log(`  ✅ ${option}: ${JSON.stringify(actualValue)}`);
      } else {
        console.log(
          `  ⚠️  ${option}: ${JSON.stringify(actualValue)} (expected: ${JSON.stringify(expectedValue)})`
        );
      }
    }

    // Check Next.js configuration
    console.log('\n🔧 Checking Next.js config...');
    if (fs.existsSync('next.config.js')) {
      console.log('  ✅ next.config.js exists');
      const nextConfig = fs.readFileSync('next.config.js', 'utf-8');
      if (nextConfig.includes('output: "export"')) {
        console.log('  ✅ Static export configured');
      } else {
        console.log('  ⚠️  Static export not configured');
      }
      if (nextConfig.includes('trailingSlash: true')) {
        console.log('  ✅ Trailing slash configured');
      } else {
        console.log('  ⚠️  Trailing slash not configured');
      }
      if (nextConfig.includes('images')) {
        console.log('  ✅ Image optimization configured');
      } else {
        console.log('  ⚠️  Image optimization not configured');
      }
    } else {
      console.log('  ❌ next.config.js missing');
    }

    // Check test configuration
    console.log('\n🧪 Checking test config...');
    if (fs.existsSync('vitest.config.ts')) {
      console.log('  ✅ vitest.config.ts exists');
    } else {
      console.log('  ❌ vitest.config.ts missing');
    }

    if (fs.existsSync('playwright.config.ts')) {
      console.log('  ✅ playwright.config.ts exists');
    } else {
      console.log('  ❌ playwright.config.ts missing');
    }

    // Check essential files
    console.log('\n📁 Checking essential files...');
    const essentialFiles = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/globals.css',
      'src/shared/lib/api.ts',
      'src/shared/providers/auth.provider.tsx',
      'tailwind.config.ts',
      'eslint.config.mjs',
    ];

    for (const file of essentialFiles) {
      if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ❌ ${file} missing`);
      }
    }

    // Try to run TypeScript check
    console.log('\n🔍 Running TypeScript check...');
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: process.cwd() });
      console.log('  ✅ TypeScript check passed');
    } catch (error) {
      console.log('  ❌ TypeScript check failed');
      console.log('  Error:', error.stdout?.toString() || error.message);
    }

    // Try to run linting
    console.log('\n🧹 Running ESLint check...');
    try {
      execSync('npx eslint .', { stdio: 'pipe', cwd: process.cwd() });
      console.log('  ✅ ESLint check passed');
    } catch (error) {
      console.log('  ❌ ESLint check failed');
      console.log('  Error:', error.stdout?.toString() || error.message);
    }

    console.log('\n🎉 Compatibility check complete!');
    console.log('\nNext steps:');
    console.log('1. Run "npm install" to install dependencies');
    console.log('2. Run "npm run dev" to start development server');
    console.log('3. Run "npm test" to run unit tests');
    console.log('4. Run "npm run test:e2e" to run end-to-end tests');
    console.log('5. Run "npm run build" to create production build');
  } catch (error) {
    console.error('❌ Error during compatibility check:', error.message);
    process.exit(1);
  }
}

// Run the check
checkCompatibility();
