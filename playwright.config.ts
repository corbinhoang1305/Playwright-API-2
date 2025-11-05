import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Playwright configuration for API testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 1 : 0,
  
  // Parallel workers
  workers: process.env.CI ? 2 : 1,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  
  // Global test settings
  use: {
    // Base URL based on environment
    baseURL: process.env.BASE_URL || 'https://material.playwrightvn.com/api/user-management/v1',
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    
    // API request timeout
    actionTimeout: 15 * 1000,
    
    // Trace on failure
    trace: 'on-first-retry',
  },

  // Configure projects for different test suites
  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.spec.ts',
    },
  ],
});

