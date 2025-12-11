import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';

export default [
    js.configs.recommended,

    // Next.js/React/Prettier/Import rules for all JS/TS code (except scripts/tests)
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            '@next/next': nextPlugin,
            import: importPlugin,
        },
        rules: {
            ...nextPlugin.configs['core-web-vitals'].rules,
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        }
    },

    // TypeScript-only files
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2023,
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                React: 'readonly',
                JSX: 'readonly',
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                console: 'readonly',
                NodeJS: 'readonly',
            }
        },
        plugins: { '@typescript-eslint': tsPlugin },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                }
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'prefer-const': 'error',
            'no-var': 'error',
            // No react plugin/rules here—they come from next-plugin-next core-web-vitals!
        }
    },

    // Scripts, configs: relax strict lint/polyfill Node globals
    {
        files: ['scripts/**/*.{js,ts,mjs,cjs}', '*.config.{js,ts,mjs,cjs}'],
        languageOptions: {
            globals: {
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
                console: 'readonly',
            }
        },
        rules: {
            'no-console': 'off',
            'no-undef': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            'import/order': 'off',
        }
    },

    // Unit/integration/test files (Vitest/React Testing Library)
    {
        files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*', 'src/test/**/*'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                vi: 'readonly',
                vitest: 'readonly',
                jest: 'readonly', // for some matcher packages
            }
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'no-console': 'off',
            'no-undef': 'off',
        }
    },

    // E2E test files (Playwright)
    {
        files: ['e2e/**/*', 'playwright.config.ts'],
        languageOptions: {
            globals: {
                test: 'readonly',
                expect: 'readonly',
            }
        },
        rules: {
            'no-console': 'off',
            'no-undef': 'off',
        }
    },

    // Global ignores for all
    {
        ignores: [
            '**/node_modules/**',
            '**/.next/**',
            '**/out/**',
            '**/dist/**',
            '**/build/**',
            '**/.turbo/**',
            '**/coverage/**',
            '**/playwright-report/**',
            '**/test-results/**',
            'scripts/**',
            '*.config.{js,mjs,cjs,ts}',
            'vitest.config.ts',
            'playwright.config.ts',
        ]
    },

    // Prettier must be LAST!
    prettierConfig
];