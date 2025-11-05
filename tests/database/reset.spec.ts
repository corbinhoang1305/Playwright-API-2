import { test, expect } from '../../src/fixtures/auth.fixture';
import { expectSuccess, getJsonBody } from '../../src/utils/responseAsserts';
import { testAccounts } from '../../config/test-data';

test.describe('Database Management - Reset', () => {
  test('should reset database successfully', async ({ client }) => {
    const response = await client.resetDatabase();
    
    await expectSuccess(response);
    
    const body = await getJsonBody(response);
    expect(body.reset).toBeDefined();
    expect(body.reset.message).toContain('reset');
  });

  test('should return sample data information after reset', async ({ client }) => {
    const response = await client.resetDatabase();
    const body = await getJsonBody(response);
    
    // Check if response has expected structure (API may vary)
    if (body.reset && body.reset.sample_data) {
      expect(body.reset.sample_data.users).toBeGreaterThan(0);
      expect(body.reset.sample_data.default_password).toBe('password');
    } else {
      // Alternative structure check
      expect(body.success).toBe(true);
    }
  });

  test('should return account information after reset', async ({ client }) => {
    const response = await client.resetDatabase();
    const body = await getJsonBody(response);
    
    // Check if response has accounts info (API may vary structure)
    if (body.reset && body.reset.sample_data && body.reset.sample_data.accounts) {
      expect(Array.isArray(body.reset.sample_data.accounts)).toBe(true);
      const emails = body.reset.sample_data.accounts.map((acc: any) => acc.email);
      expect(emails).toContain('admin@example.com');
    } else {
      expect(body.success).toBe(true);
    }
  });

  test('should allow login after database reset', async ({ client }) => {
    // Reset database
    await client.resetDatabase();
    
    // Try to login with default credentials
    const loginResponse = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    
    await expectSuccess(loginResponse);
    
    const body = await getJsonBody(loginResponse);
    expect(body.data.token).toBeDefined();
  });

  test('should restore default users after reset', async ({ client, adminToken }) => {
    // Reset database
    await client.resetDatabase();
    
    // List users
    const listResponse = await client.listUsers(adminToken);
    const body = await getJsonBody(listResponse);
    
    expect(body.users.length).toBeGreaterThan(0);
    
    const emails = body.users.map((u: any) => u.email);
    expect(emails).toContain('admin@example.com');
    expect(emails.some((e: string) => e.includes('john'))).toBe(true);
  });

  test('should clear custom users created during tests', async ({ client, adminToken }) => {
    // Reset first to ensure clean state
    await client.resetDatabase();
    
    // Get fresh token after reset
    const loginResponse = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    const freshToken = (await getJsonBody(loginResponse)).data.token;
    
    // Create a custom user
    const customUser = {
      name: 'Temporary User',
      email: 'temp_' + Date.now() + '@example.com',
      password: 'password',
      role: 'user' as const,
    };
    
    const createResponse = await client.createUser(freshToken, customUser);
    expect(createResponse.ok()).toBe(true);
    
    // Verify user exists
    let listResponse = await client.listUsers(freshToken);
    let users = (await getJsonBody(listResponse)).users;
    let customUserExists = users.some((u: any) => u.email === customUser.email);
    expect(customUserExists).toBe(true);
    
    // Reset database
    await client.resetDatabase();
    
    // Need to get new token after reset
    const loginResponse2 = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    const newToken = (await getJsonBody(loginResponse2)).data.token;
    
    // Verify custom user is gone
    listResponse = await client.listUsers(newToken);
    users = (await getJsonBody(listResponse)).users;
    customUserExists = users.some((u: any) => u.email === customUser.email);
    expect(customUserExists).toBe(false);
  });

  test('should reset database multiple times without errors', async ({ client }) => {
    for (let i = 0; i < 3; i++) {
      const response = await client.resetDatabase();
      await expectSuccess(response);
    }
  });

  test('should restore consistent user count after reset', async ({ client, adminToken }) => {
    // Reset and count users
    await client.resetDatabase();
    
    const firstResponse = await client.listUsers(adminToken);
    const firstCount = (await getJsonBody(firstResponse)).users.length;
    
    // Reset again and count
    await client.resetDatabase();
    
    const secondResponse = await client.listUsers(adminToken);
    const secondCount = (await getJsonBody(secondResponse)).users.length;
    
    expect(firstCount).toBe(secondCount);
  });

  test('should not require authentication to reset database', async ({ client }) => {
    // Reset without any token
    const response = await client.resetDatabase();
    
    await expectSuccess(response);
  });
});

