/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/e2e/**',
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov', 'cobertura'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/coverage/**',
                'out/',
                '.next/',
                'scripts/',
                '**/__tests__/fixtures/**',
                '**/*.test.{ts,tsx}',
                '**/*.spec.{ts,tsx}',
            ],
            thresholds: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80,
                },
            },
        },
        // Vitest v2.x settings
        reporters: ['verbose'],
        outputFile: {
            junit: './test-results/junit.xml',
        },
        // Fail tests if coverage thresholds are not met
        passWithNoTests: false,
        // Changed from failOnCoverage to coverage.thresholds.autoUpdate
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@/components': resolve(__dirname, './src/shared/components'),
            '@/hooks': resolve(__dirname, './src/shared/hooks'),
            '@/lib': resolve(__dirname, './src/shared/lib'),
            '@/types': resolve(__dirname, './src/shared/types'),
            '@/config': resolve(__dirname, './src/config'),
            '@/features': resolve(__dirname, './src/features'),
            '@/providers': resolve(__dirname, './src/shared/providers'),
            '@/forms': resolve(__dirname, './src/shared/forms'),
        },
    },
});