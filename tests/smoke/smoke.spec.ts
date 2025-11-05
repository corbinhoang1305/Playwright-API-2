import { test, expect } from '../../src/fixtures/auth.fixture';
import { expectSuccess, getJsonBody } from '../../src/utils/responseAsserts';
import { testAccounts, userPayloads } from '../../config/test-data';

/**
 * Smoke tests - Critical path validation
 * These tests verify core functionality is working
 */
test.describe('Smoke Tests', () => {
  test.beforeAll(async ({ }) => {
    // Reset database once before all smoke tests
    const { request } = await import('@playwright/test');
    const apiContext = await request.newContext();
    const { UserManagementClient } = await import('../../src/clients/userManagementClient');
    const client = new UserManagementClient(apiContext);
    await client.resetDatabase();
    await apiContext.dispose();
  });

  test('critical path: login and list users', async ({ client }) => {
    // Step 1: Login as admin
    const loginResponse = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    await expectSuccess(loginResponse);
    
    const loginBody = await getJsonBody(loginResponse);
    const token = loginBody.data.token;
    expect(token).toBeDefined();
    
    // Step 2: List users
    const listResponse = await client.listUsers(token);
    await expectSuccess(listResponse);
    
    const listBody = await getJsonBody(listResponse);
    expect(listBody.users.length).toBeGreaterThan(0);
  });

  test('critical path: complete user CRUD workflow', async ({ client, adminToken }) => {
    // Create
    const newUser = userPayloads.createUser();
    const createResponse = await client.createUser(adminToken, newUser);
    await expectSuccess(createResponse);
    
    const createdUser = (await getJsonBody(createResponse)).user;
    expect(createdUser.email).toBe(newUser.email);
    
    // Read (list)
    const listResponse = await client.listUsers(adminToken);
    const users = (await getJsonBody(listResponse)).users;
    const foundUser = users.find((u: any) => u.id === createdUser.id);
    expect(foundUser).toBeDefined();
    
    // Update
    const updateData = userPayloads.updateUser(createdUser.id, { name: 'Updated Name' });
    const updateResponse = await client.updateUser(adminToken, updateData);
    await expectSuccess(updateResponse);
    
    const updatedUser = (await getJsonBody(updateResponse)).user;
    expect(updatedUser.name).toBe('Updated Name');
    
    // Delete
    const deleteResponse = await client.deleteUser(adminToken, createdUser.id);
    await expectSuccess(deleteResponse);
  });

  test('critical path: profile management workflow', async ({ client, userToken }) => {
    // Get profile
    const getResponse = await client.getProfile(userToken);
    await expectSuccess(getResponse);
    
    const profile = (await getJsonBody(getResponse)).profile;
    expect(profile).toBeDefined();
    
    // Update profile
    const updateData = userPayloads.updateProfile({ name: 'Smoke Test User' });
    const updateResponse = await client.updateProfile(userToken, updateData);
    await expectSuccess(updateResponse);
    
    const updatedProfile = (await getJsonBody(updateResponse)).profile;
    expect(updatedProfile.name).toBe('Smoke Test User');
  });

  test('critical path: role-based access control', async ({ client, adminToken, userToken }) => {
    // Admin can create users
    const newUser = userPayloads.createUser();
    const adminCreateResponse = await client.createUser(adminToken, newUser);
    await expectSuccess(adminCreateResponse);
    
    // User cannot create users
    const userCreateResponse = await client.createUser(userToken, userPayloads.createUser());
    expect(userCreateResponse.status()).toBe(403);
    
    // Both can list users
    const adminListResponse = await client.listUsers(adminToken);
    const userListResponse = await client.listUsers(userToken);
    await expectSuccess(adminListResponse);
    await expectSuccess(userListResponse);
  });

  test('critical path: authentication flow', async ({ client, adminToken }) => {
    // Valid login
    const validLogin = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    await expectSuccess(validLogin);
    
    // Invalid login
    const invalidLogin = await client.login(testAccounts.admin.email, 'wrong_password');
    expect(invalidLogin.status()).toBe(401);
    
    // Token usage - use pre-authenticated token
    const authenticatedRequest = await client.listUsers(adminToken);
    await expectSuccess(authenticatedRequest);
    
    // No token
    const noTokenRequest = await client.listUsers('');
    expect(noTokenRequest.status()).toBe(401);
  });

  test('critical path: database reset functionality', async ({ client }) => {
    // Reset database
    const resetResponse = await client.resetDatabase();
    await expectSuccess(resetResponse);
    
    // Verify can login after reset
    const loginResponse = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    await expectSuccess(loginResponse);
    
    // Verify default users exist
    const token = (await getJsonBody(loginResponse)).data.token;
    const listResponse = await client.listUsers(token);
    const users = (await getJsonBody(listResponse)).users;
    
    expect(users.length).toBeGreaterThan(0);
  });

  test('smoke: API is accessible and responding', async ({ client }) => {
    // Simple ping test using login endpoint
    const response = await client.login(testAccounts.admin.email, testAccounts.admin.password);
    
    expect(response.status()).toBeLessThan(500); // No server errors
    await expectSuccess(response);
  });

  test('smoke: all endpoints return JSON', async ({ client, adminToken }) => {
    const responses = await Promise.all([
      client.login(testAccounts.admin.email, testAccounts.admin.password),
      client.listUsers(adminToken),
      client.getProfile(adminToken),
      client.resetDatabase(),
    ]);
    
    for (const response of responses) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
      
      // Verify it's valid JSON
      const body = await response.json();
      expect(body).toBeDefined();
    }
  });

  test('smoke: response times are acceptable', async ({ client }) => {
    const start = Date.now();
    
    await client.login(testAccounts.admin.email, testAccounts.admin.password);
    
    const duration = Date.now() - start;
    
    // Response should be under 5 seconds for smoke test
    expect(duration).toBeLessThan(5000);
  });
});

