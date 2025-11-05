import { test, expect } from '../../src/fixtures/auth.fixture';
import { expectSuccess, expectError, expectSchema } from '../../src/utils/responseAsserts';
import { testAccounts } from '../../config/test-data';

test.describe('Authentication - Login', () => {
  test('should login successfully with admin credentials', async ({ client }) => {
    const response = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    
    await expectSuccess(response);
    await expectSchema(response, 'loginResponse');
    
    const body = await response.json();
    expect(body.data.token).toBeDefined();
    expect(body.data.token.length).toBeGreaterThan(0);
    expect(body.data.user.email).toBe(testAccounts.admin.email);
    expect(body.data.user.role).toBe('admin');
    expect(body.data.expires_in).toBe(86400); // 24 hours
  });

  test('should login successfully with user credentials', async ({ client }) => {
    const response = await client.login(testAccounts.user.email, testAccounts.user.password);
    
    await expectSuccess(response);
    
    const body = await response.json();
    expect(body.data.user.email).toBe(testAccounts.user.email);
    expect(body.data.user.role).toBe('user');
  });

  test('should fail login with invalid password', async ({ client }) => {
    const response = await client.login(testAccounts.admin.email, 'wrong_password');
    
    await expectError(response, 401, /Invalid|Unauthorized/i);
  });

  test('should fail login with non-existent email', async ({ client }) => {
    const response = await client.login('nonexistent@example.com', 'password');
    
    await expectError(response, 401);
  });

  test('should fail login with missing email', async ({ client }) => {
    const response = await client.login('', testAccounts.admin.password);
    
    await expectError(response, 400);
  });

  test('should fail login with missing password', async ({ client }) => {
    const response = await client.login(testAccounts.admin.email, '');
    
    await expectError(response, 400);
  });

  test('should fail login with invalid email format', async ({ client }) => {
    const response = await client.login('not-an-email', 'password');
    
    // API may return 401 instead of 400 for invalid email format
    expect([400, 401]).toContain(response.status());
  });

  test('should return valid JWT token structure', async ({ client }) => {
    const response = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    
    const body = await response.json();
    const token = body.data.token;
    
    // JWT has 3 parts separated by dots
    const parts = token.split('.');
    expect(parts.length).toBe(3);
    
    // Each part should be base64 encoded
    parts.forEach((part: string) => {
      expect(part.length).toBeGreaterThan(0);
    });
  });
});

