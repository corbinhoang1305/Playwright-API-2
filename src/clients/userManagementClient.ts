import { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../../config/env';

/**
 * User Management API Client
 * Wraps Playwright APIRequestContext with typed methods for all endpoints
 */
export class UserManagementClient {
  private baseURL: string;
  private context: APIRequestContext;

  constructor(context: APIRequestContext, baseURL?: string) {
    this.context = context;
    this.baseURL = baseURL || env.baseURL;
  }

  /**
   * Authentication endpoint
   */
  async login(email: string, password: string): Promise<APIResponse> {
    return await this.context.post(`${this.baseURL}/login.php`, {
      data: { email, password },
    });
  }

  /**
   * User management endpoints
   */
  async listUsers(token: string): Promise<APIResponse> {
    return await this.context.get(`${this.baseURL}/users.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createUser(token: string, userData: CreateUserRequest): Promise<APIResponse> {
    return await this.context.post(`${this.baseURL}/users.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: userData,
    });
  }

  async updateUser(token: string, userData: UpdateUserRequest): Promise<APIResponse> {
    return await this.context.put(`${this.baseURL}/users.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: userData,
    });
  }

  async deleteUser(token: string, userId: number): Promise<APIResponse> {
    return await this.context.delete(`${this.baseURL}/users.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id: userId },
    });
  }

  /**
   * Profile management endpoints
   */
  async getProfile(token: string): Promise<APIResponse> {
    return await this.context.get(`${this.baseURL}/profile.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProfile(token: string, profileData: UpdateProfileRequest): Promise<APIResponse> {
    return await this.context.put(`${this.baseURL}/profile.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: profileData,
    });
  }

  /**
   * Database management
   */
  async resetDatabase(): Promise<APIResponse> {
    return await this.context.post(`${this.baseURL}/reset.php`);
  }

  /**
   * Generic request method with automatic token handling
   */
  async request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    token?: string,
    data?: any
  ): Promise<APIResponse> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;
    const options = { headers, data };

    switch (method) {
      case 'GET':
        return await this.context.get(url, options);
      case 'POST':
        return await this.context.post(url, options);
      case 'PUT':
        return await this.context.put(url, options);
      case 'DELETE':
        return await this.context.delete(url, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}

/**
 * Type definitions for API requests/responses
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  facebook?: string;
  avatar?: string;
  hobbies?: string;
  role?: 'user' | 'admin';
}

export interface UpdateUserRequest {
  id: number;
  name: string;
  email: string;
  facebook?: string;
  avatar?: string;
  hobbies?: string;
  role?: 'user' | 'admin';
}

export interface UpdateProfileRequest {
  name: string;
  facebook?: string;
  avatar?: string;
  hobbies?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  facebook?: string;
  avatar?: string;
  hobbies?: string;
  role: 'user' | 'admin';
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
    expires_in: number;
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

