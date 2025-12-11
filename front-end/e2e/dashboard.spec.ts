import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the config.json API for every page load (matches your runtime config)
        await page.route('**/config.json', route =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    apiBaseUrl: 'http://localhost:3001/api',
                    environment: 'test',
                    features: {
                        debugMode: true,
                        enableMockData: true,
                        enableAnalytics: false,
                    }
                }),
            })
        );
    });

    test('should display dashboard header and stats', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

        // Stat cards
        await expect(page.getByText(/total products/i)).toBeVisible();
        await expect(page.getByText(/active products/i)).toBeVisible();
        await expect(page.getByText(/patch notifications/i)).toBeVisible();
        await expect(page.getByText(/patches created/i)).toBeVisible();
        await expect(page.getByText(/failed patches/i)).toBeVisible();
        await expect(page.getByText(/patches ready/i)).toBeVisible();

        // Quick Actions/Activity Feed
        await expect(page.getByText(/quick actions/i)).toBeVisible();
        await expect(page.getByText(/recent activity/i)).toBeVisible();
    });

    test('should navigate to products page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: /^products$/i }).click();
        await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
    });

    test('should navigate to executions page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: /executions/i }).click();
        await expect(page.getByRole('heading', { name: /executions/i })).toBeVisible();
    });

    test('should create and display a new product', async ({ page }) => {
        await page.goto('/products');
        await page.getByRole('button', { name: /add product/i }).click();

        // Fill out product form
        await page.getByLabel(/product name/i).fill('Test Product');
        await page.getByLabel(/vendor/i).fill('Test Vendor');
        await page.getByLabel(/cron/i).fill('0 0 * * *');
        // Add more fields if the form has more required ones!

        await page.getByRole('button', { name: /save/i }).click();

        // Confirmation message or see in the list
        await expect(page.getByText(/product created/i)).toBeVisible();
        await expect(page.getByText(/test product/i)).toBeVisible();
    });
});