import { env } from './env';

/**
 * Generate random email for testing
 */
export function randomEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}@example.com`;
}

/**
 * Generate random string
 */
export function randomString(length = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Default test accounts
 */
export const testAccounts = {
  admin: {
    email: env.admin.email,
    password: env.admin.password,
    role: 'admin' as const,
  },
  user: {
    email: env.user.email,
    password: env.user.password,
    role: 'user' as const,
  },
};

/**
 * Sample user payload builders
 */
export const userPayloads = {
  /**
   * Create a valid user creation payload
   */
  createUser: (overrides?: Partial<CreateUserPayload>): CreateUserPayload => ({
    name: `Test User ${randomString(5)}`,
    email: randomEmail('newuser'),
    password: 'password123',
    facebook: 'https://facebook.com/testuser',
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    hobbies: 'Testing, Coding, Automation',
    role: 'user',
    ...overrides,
  }),

  /**
   * Create a valid user update payload
   */
  updateUser: (id: number, overrides?: Partial<UpdateUserPayload>): UpdateUserPayload => ({
    id,
    name: `Updated User ${randomString(5)}`,
    email: randomEmail('updated'),
    facebook: 'https://facebook.com/updated',
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    hobbies: 'Reading, Travel, Photography',
    role: 'user',
    ...overrides,
  }),

  /**
   * Create a valid profile update payload
   */
  updateProfile: (overrides?: Partial<UpdateProfilePayload>): UpdateProfilePayload => ({
    name: `My Updated Name ${randomString(5)}`,
    facebook: 'https://facebook.com/myprofile',
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    hobbies: 'Coding, Music, Travel',
    ...overrides,
  }),

  /**
   * Create invalid payloads for negative testing
   */
  invalid: {
    missingRequiredField: {
      email: randomEmail(),
      password: 'password123',
      // missing 'name' field
    },
    invalidEmail: {
      name: 'Test User',
      email: 'not-an-email',
      password: 'password123',
    },
    emptyFields: {
      name: '',
      email: '',
      password: '',
    },
  },
};

/**
 * Type definitions for payloads
 */
export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  facebook?: string;
  avatar?: string;
  hobbies?: string;
  role?: 'user' | 'admin';
}

export interface UpdateUserPayload {
  id: number;
  name: string;
  email: string;
  facebook?: string;
  avatar?: string;
  hobbies?: string;
  role?: 'user' | 'admin';
}

export interface UpdateProfilePayload {
  name: string;
  facebook?: string;
  avatar?: string;
  hobbies?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

