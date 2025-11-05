import { test, expect } from '../../src/fixtures/auth.fixture';
import { expectSuccess, expectUnauthorized, getJsonBody } from '../../src/utils/responseAsserts';

test.describe('Users - List Users', () => {
  test.beforeEach(async ({ client }) => {
    // Reset database before each test to ensure consistent state
    await client.resetDatabase();
  });

  test('should list users with admin token', async ({ client, adminToken }) => {
    const response = await client.listUsers(adminToken);
    
    await expectSuccess(response);
    
    const body = await getJsonBody(response);
    expect(body.users).toBeDefined();
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);
    
    // Verify user structure
    const firstUser = body.users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('role');
  });

  test('should list users with user token', async ({ client, userToken }) => {
    const response = await client.listUsers(userToken);
    
    await expectSuccess(response);
    
    const body = await getJsonBody(response);
    expect(body.users).toBeDefined();
    expect(Array.isArray(body.users)).toBe(true);
  });

  test('should fail without authentication token', async ({ client }) => {
    const response = await client.listUsers('');
    
    await expectUnauthorized(response);
  });

  test('should fail with invalid token', async ({ client }) => {
    const response = await client.listUsers('invalid_token_here');
    
    await expectUnauthorized(response);
  });

  test('should fail with malformed token', async ({ client }) => {
    const response = await client.listUsers('Bearer malformed.token.xyz');
    
    await expectUnauthorized(response);
  });

  test('should return users with correct fields', async ({ client, adminToken }) => {
    const response = await client.listUsers(adminToken);
    const body = await getJsonBody(response);
    
    const requiredFields = ['id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at'];
    
    body.users.forEach((user: any) => {
      requiredFields.forEach(field => {
        expect(user).toHaveProperty(field);
      });
      
      // Validate role values
      expect(['user', 'admin']).toContain(user.role);
    });
  });

  test('should include both admin and user accounts after reset', async ({ client, adminToken }) => {
    const response = await client.listUsers(adminToken);
    const body = await getJsonBody(response);
    
    const roles = body.users.map((u: any) => u.role);
    expect(roles).toContain('admin');
    expect(roles).toContain('user');
  });
});

