import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment configuration for tests
 */
export const env = {
  // Base API URL
  baseURL: process.env.BASE_URL || 'https://material.playwrightvn.com/api/user-management/v1',
  
  // Admin credentials
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'password',
  },
  
  // Regular user credentials
  user: {
    email: process.env.USER_EMAIL || 'john.doe@example.com',
    password: process.env.USER_PASSWORD || 'password',
  },
  
  // Environment type
  nodeEnv: process.env.NODE_ENV || 'production',
  
  // Feature flags
  features: {
    enableAllureReports: process.env.ENABLE_ALLURE === 'true',
    enableDebugLogs: process.env.DEBUG === 'true',
  },
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const required = ['BASE_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'USER_EMAIL', 'USER_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values from env.ts');
  }
}

// Validate on import
validateEnv();

