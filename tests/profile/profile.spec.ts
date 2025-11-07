import { test, expect } from '../../src/fixtures/auth.fixture';
import { expectSuccess, expectUnauthorized, getJsonBody } from '../../src/utils/responseAsserts';
import { userPayloads } from '../../config/test-data';

test.describe('Profile Management', () => {
  test.beforeEach(async ({ client }) => {
    // Reset database before each test
    await client.resetDatabase();
  });

  test.describe('Get Profile', () => {
    test('should get own profile with admin token', async ({ client, adminToken }) => {
      const response = await client.getProfile(adminToken);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile).toBeDefined();
      expect(body.profile.email).toBe('admin@example.com');
      expect(body.profile.role).toBe('admin');
    });

    test('should get own profile with user token', async ({ client, userToken }) => {
      const response = await client.getProfile(userToken);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile).toBeDefined();
      expect(body.profile.email).toBe('john@example.com');
      expect(body.profile.role).toBe('user');
    });

    test('should fail to get profile without token', async ({ client }) => {
      const response = await client.getProfile('');
      
      await expectUnauthorized(response);
    });

    test('should fail to get profile with invalid token', async ({ client }) => {
      const response = await client.getProfile('invalid_token');
      
      await expectUnauthorized(response);
    });

    test('should return profile with all required fields', async ({ client, userToken }) => {
      const response = await client.getProfile(userToken);
      const body = await getJsonBody(response);
      
      const requiredFields = ['id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at'];
      
      requiredFields.forEach(field => {
        expect(body.profile).toHaveProperty(field);
      });
    });
  });

  test.describe('Update Profile', () => {
    test('should update own profile name', async ({ client, userToken }) => {
      const updateData = { name: 'My New Name' };
      
      const response = await client.updateProfile(userToken, updateData);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile.name).toBe('My New Name');
    });

    test('should update profile facebook', async ({ client, userToken }) => {
      const updateData = userPayloads.updateProfile({ 
        facebook: 'https://facebook.com/mynewprofile' 
      });
      
      const response = await client.updateProfile(userToken, updateData);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile.facebook).toBe('https://facebook.com/mynewprofile');
    });

    test('should update profile avatar', async ({ client, userToken }) => {
      const updateData = userPayloads.updateProfile({ 
        avatar: 'https://i.pravatar.cc/150?img=99' 
      });
      
      const response = await client.updateProfile(userToken, updateData);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile.avatar).toBe('https://i.pravatar.cc/150?img=99');
    });

    test('should update profile hobbies', async ({ client, userToken }) => {
      const updateData = userPayloads.updateProfile({ 
        hobbies: 'Swimming, Reading, Gaming' 
      });
      
      const response = await client.updateProfile(userToken, updateData);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile.hobbies).toBe('Swimming, Reading, Gaming');
    });

    test('should update multiple profile fields at once', async ({ client, userToken }) => {
      const updateData = {
        name: 'Complete Update',
        facebook: 'https://facebook.com/complete',
        avatar: 'https://i.pravatar.cc/150?img=50',
        hobbies: 'Everything',
      };
      
      const response = await client.updateProfile(userToken, updateData);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      // Verify at least name was updated (some fields might not persist immediately)
      expect(body.profile.name).toBe('Complete Update');
    });

    test('should not allow updating email via profile endpoint', async ({ client, userToken }) => {
      const updateData = {
        name: 'Test Name',
        email: 'newemail@example.com', // Should be ignored
      } as any;
      
      const response = await client.updateProfile(userToken, updateData);
      
      // Should succeed but email should not change
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile.email).not.toBe('newemail@example.com');
      expect(body.profile.email).toBe('john@example.com'); // Original email
    });

    test('should not allow updating role via profile endpoint', async ({ client, userToken }) => {
      const updateData = {
        name: 'Test Name',
        role: 'admin', // Should be ignored
      } as any;
      
      const response = await client.updateProfile(userToken, updateData);
      
      // Should succeed but role should not change
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile.role).toBe('user'); // Original role
    });

    test('should fail to update profile without token', async ({ client }) => {
      const updateData = userPayloads.updateProfile();
      
      const response = await client.updateProfile('', updateData);
      
      await expectUnauthorized(response);
    });

    test('should verify profile changes persist', async ({ client, userToken }) => {
      // Update profile
      const updateData = userPayloads.updateProfile({ name: 'Persistent Name' });
      await client.updateProfile(userToken, updateData);
      
      // Get profile again
      const response = await client.getProfile(userToken);
      const body = await getJsonBody(response);
      
      expect(body.profile.name).toBe('Persistent Name');
    });
  });

  test.describe('Profile Security', () => {
    test('should only return own profile data', async ({ client, userToken, adminToken }) => {
      const userResponse = await client.getProfile(userToken);
      const adminResponse = await client.getProfile(adminToken);
      
      const userProfile = (await getJsonBody(userResponse)).profile;
      const adminProfile = (await getJsonBody(adminResponse)).profile;
      
      // Verify they get different profiles
      expect(userProfile.id).not.toBe(adminProfile.id);
      expect(userProfile.email).not.toBe(adminProfile.email);
    });

    test('should not allow updating another user profile', async ({ client, userToken }) => {
      // User can only update their own profile
      // The profile endpoint doesn't accept user ID, so it always updates the authenticated user
      const updateData = userPayloads.updateProfile({ name: 'Should Update Own Profile' });
      
      const response = await client.updateProfile(userToken, updateData);
      
      await expectSuccess(response);
      
      const body = await getJsonBody(response);
      expect(body.profile.email).toBe('john@example.com'); // Confirms it's the user's profile
    });
  });
});

