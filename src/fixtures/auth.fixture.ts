import { test as base, request } from '@playwright/test';
import { UserManagementClient, LoginResponse } from '../clients/userManagementClient';
import { testAccounts } from '../../config/test-data';

/**
 * Token cache per worker to avoid repeated login calls
 */
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

/**
 * Extended test fixtures with authentication
 */
export type AuthFixtures = {
  client: UserManagementClient;
  adminToken: string;
  userToken: string;
  authenticatedRequest: (role: 'admin' | 'user') => Promise<{ client: UserManagementClient; token: string }>;
};

/**
 * Get or refresh token for a role
 */
async function getToken(client: UserManagementClient, role: 'admin' | 'user'): Promise<string> {
  const cacheKey = `${role}_token`;
  const cached = tokenCache.get(cacheKey);

  // Return cached token if still valid (with 5 min buffer)
  if (cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cached.token;
  }

  // Login to get new token
  const account = testAccounts[role];
  const response = await client.login(account.email, account.password);
  
  if (!response.ok()) {
    throw new Error(`Failed to login as ${role}: ${response.status()} ${await response.text()}`);
  }

  const body = await response.json() as LoginResponse;
  const token = body.data.token;
  const expiresIn = body.data.expires_in * 1000; // Convert to milliseconds
  const expiresAt = Date.now() + expiresIn;

  // Cache the token
  tokenCache.set(cacheKey, { token, expiresAt });

  return token;
}

/**
 * Auth fixtures
 */
export const test = base.extend<AuthFixtures>({
  /**
   * API client instance
   */
  client: async ({}, use) => {
    const apiContext = await request.newContext();
    const client = new UserManagementClient(apiContext);
    await use(client);
    await apiContext.dispose();
  },

  /**
   * Admin token - automatically fetched and cached
   */
  adminToken: async ({ client }, use) => {
    const token = await getToken(client, 'admin');
    await use(token);
  },

  /**
   * User token - automatically fetched and cached
   */
  userToken: async ({ client }, use) => {
    const token = await getToken(client, 'user');
    await use(token);
  },

  /**
   * Authenticated request helper - returns client with token for specified role
   */
  authenticatedRequest: async ({ client }, use) => {
    const helper = async (role: 'admin' | 'user') => {
      const token = await getToken(client, role);
      return { client, token };
    };
    await use(helper);
  },
});

export { expect } from '@playwright/test';

/**
 * Clear token cache (useful for testing token expiration)
 */
export function clearTokenCache(): void {
  tokenCache.clear();
}

/**
 * Get token from cache (for debugging)
 */
export function getTokenFromCache(role: 'admin' | 'user'): string | undefined {
  return tokenCache.get(`${role}_token`)?.token;
}

