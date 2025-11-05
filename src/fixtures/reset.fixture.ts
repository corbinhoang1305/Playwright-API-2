import { test as base, request } from '@playwright/test';
import { UserManagementClient } from '../clients/userManagementClient';

/**
 * Reset fixture for database initialization
 */
export type ResetFixtures = {
  resetDatabase: () => Promise<void>;
};

/**
 * Extended test with reset capability
 */
export const test = base.extend<ResetFixtures>({
  /**
   * Reset database fixture
   * Can be used in beforeEach hooks or called directly in tests
   */
  resetDatabase: async ({}, use) => {
    const resetFn = async () => {
      const apiContext = await request.newContext();
      const client = new UserManagementClient(apiContext);
      
      const response = await client.resetDatabase();
      
      if (!response.ok()) {
        throw new Error(`Failed to reset database: ${response.status()} ${await response.text()}`);
      }

      await apiContext.dispose();
    };

    await use(resetFn);
  },
});

/**
 * Hook to reset database before each test if metadata is set
 * Usage in test file:
 * 
 * test.describe('My Suite', () => {
 *   test.beforeEach(async ({ resetDatabase }) => {
 *     await resetDatabase();
 *   });
 * 
 *   test('my test', async () => { ... });
 * });
 */
export function setupDatabaseReset() {
  test.beforeEach(async ({ resetDatabase }, testInfo) => {
    // Check if test or suite has 'needsReset' annotation
    const needsReset = testInfo.annotations.some(a => a.type === 'needsReset');
    
    if (needsReset) {
      console.log(`🔄 Resetting database for test: ${testInfo.title}`);
      await resetDatabase();
    }
  });
}

export { expect } from '@playwright/test';

