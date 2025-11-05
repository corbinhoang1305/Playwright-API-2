import { test, expect } from '../../src/fixtures/auth.fixture';
import { expectForbidden, expectSuccess, getJsonBody } from '../../src/utils/responseAsserts';
import { userPayloads } from '../../config/test-data';

test.describe('Users - Permission Tests', () => {
  test.beforeEach(async ({ client }) => {
    // Reset database before each test
    await client.resetDatabase();
  });

  test.describe('User Role Restrictions', () => {
    test('should allow user role to list users', async ({ client, userToken }) => {
      const response = await client.listUsers(userToken);
      
      await expectSuccess(response);
    });

    test('should forbid user role to create users', async ({ client, userToken }) => {
      const newUser = userPayloads.createUser();
      
      const response = await client.createUser(userToken, newUser);
      
      await expectForbidden(response, /Insufficient permissions|Admin role required/i);
    });

    test('should forbid user role to update users', async ({ client, userToken, adminToken }) => {
      // Create a user as admin
      const newUser = userPayloads.createUser();
      const createResponse = await client.createUser(adminToken, newUser);
      const createdUser = (await getJsonBody(createResponse)).user;
      
      // Try to update as regular user
      const updateData = userPayloads.updateUser(createdUser.id, { name: 'Updated' });
      const response = await client.updateUser(userToken, updateData);
      
      await expectForbidden(response, /Insufficient permissions|Admin role required/i);
    });

    test('should forbid user role to delete users', async ({ client, userToken, adminToken }) => {
      // Create a user as admin
      const newUser = userPayloads.createUser();
      const createResponse = await client.createUser(adminToken, newUser);
      const createdUser = (await getJsonBody(createResponse)).user;
      
      // Try to delete as regular user
      const response = await client.deleteUser(userToken, createdUser.id);
      
      await expectForbidden(response, /Insufficient permissions|Admin role required/i);
    });
  });

  test.describe('Admin Role Privileges', () => {
    test('should allow admin to create users', async ({ client, adminToken }) => {
      const newUser = userPayloads.createUser();
      
      const response = await client.createUser(adminToken, newUser);
      
      await expectSuccess(response);
    });

    test('should allow admin to update users', async ({ client, adminToken }) => {
      // Create user
      const newUser = userPayloads.createUser();
      const createResponse = await client.createUser(adminToken, newUser);
      const createdUser = (await getJsonBody(createResponse)).user;
      
      // Update as admin
      const updateData = userPayloads.updateUser(createdUser.id, { name: 'Admin Updated' });
      const response = await client.updateUser(adminToken, updateData);
      
      await expectSuccess(response);
    });

    test('should allow admin to delete users', async ({ client, adminToken }) => {
      // Create user
      const newUser = userPayloads.createUser();
      const createResponse = await client.createUser(adminToken, newUser);
      expect(createResponse.ok()).toBe(true);
      const createdUser = (await getJsonBody(createResponse)).user;
      
      // Delete as admin - parse ID correctly
      const userId = typeof createdUser.id === 'string' ? parseInt(createdUser.id) : createdUser.id;
      const response = await client.deleteUser(adminToken, userId);
      
      await expectSuccess(response);
    });

    test('should allow admin to create another admin', async ({ client, adminToken }) => {
      const newAdmin = userPayloads.createUser({ role: 'admin' });
      
      const response = await client.createUser(adminToken, newAdmin);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.user.role).toBe('admin');
    });
  });

  test.describe('Cross-Role Scenarios', () => {
    test('should prevent user from elevating their own role', async ({ client, userToken }) => {
      // Get user's own profile
      const profileResponse = await client.getProfile(userToken);
      const profile = (await getJsonBody(profileResponse)).profile;
      
      // Try to update role via user endpoint (should fail due to lack of permissions)
      const updateData = userPayloads.updateUser(profile.id, { role: 'admin' });
      const response = await client.updateUser(userToken, updateData);
      
      await expectForbidden(response);
    });

    test('should allow admin to change user role', async ({ client, adminToken }) => {
      // Create regular user
      const newUser = userPayloads.createUser({ role: 'user' });
      const createResponse = await client.createUser(adminToken, newUser);
      const createdUser = (await getJsonBody(createResponse)).user;
      
      expect(createdUser.role).toBe('user');
      
      // Promote to admin
      const updateData = userPayloads.updateUser(createdUser.id, { role: 'admin' });
      const response = await client.updateUser(adminToken, updateData);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.user.role).toBe('admin');
    });
  });
});

