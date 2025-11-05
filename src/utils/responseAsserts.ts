import { APIResponse, expect } from '@playwright/test';
import { assertSchema } from './schemaValidator';

/**
 * Response assertion helpers
 */

/**
 * Assert response status code
 */
export async function expectStatus(response: APIResponse, expectedStatus: number): Promise<void> {
  const actualStatus = response.status();
  expect(actualStatus, `Expected status ${expectedStatus} but got ${actualStatus}`).toBe(expectedStatus);
}

/**
 * Assert successful response (2xx status)
 */
export async function expectSuccess(response: APIResponse): Promise<void> {
  const status = response.status();
  expect(status, `Expected successful response but got ${status}`).toBeGreaterThanOrEqual(200);
  expect(status, `Expected successful response but got ${status}`).toBeLessThan(300);
  
  const body = await response.json();
  expect(body.success, 'Response body should have success: true').toBe(true);
}

/**
 * Assert error response with expected status and message pattern
 */
export async function expectError(
  response: APIResponse,
  expectedStatus: number,
  messagePattern?: string | RegExp
): Promise<void> {
  await expectStatus(response, expectedStatus);
  
  const body = await response.json();
  expect(body.success, 'Error response should have success: false').toBe(false);
  expect(body.message, 'Error response should have message field').toBeDefined();
  
  if (messagePattern) {
    if (typeof messagePattern === 'string') {
      expect(body.message).toContain(messagePattern);
    } else {
      expect(body.message).toMatch(messagePattern);
    }
  }
}

/**
 * Assert response matches JSON schema
 */
export async function expectSchema(response: APIResponse, schemaKey: string): Promise<void> {
  const body = await response.json();
  assertSchema(schemaKey, body);
}

/**
 * Assert response has specific fields
 */
export async function expectFields(response: APIResponse, fields: string[]): Promise<void> {
  const body = await response.json();
  
  for (const field of fields) {
    expect(body, `Response should contain field: ${field}`).toHaveProperty(field);
  }
}

/**
 * Assert response body contains expected data
 */
export async function expectBodyContains(response: APIResponse, expected: Record<string, any>): Promise<void> {
  const body = await response.json();
  
  for (const [key, value] of Object.entries(expected)) {
    expect(body[key], `Field ${key} should equal ${value}`).toEqual(value);
  }
}

/**
 * Assert unauthorized response (401)
 */
export async function expectUnauthorized(response: APIResponse, messagePattern?: string | RegExp): Promise<void> {
  await expectError(response, 401, messagePattern);
}

/**
 * Assert forbidden response (403)
 */
export async function expectForbidden(response: APIResponse, messagePattern?: string | RegExp): Promise<void> {
  await expectError(response, 403, messagePattern);
}

/**
 * Assert not found response (404)
 */
export async function expectNotFound(response: APIResponse, messagePattern?: string | RegExp): Promise<void> {
  await expectError(response, 404, messagePattern);
}

/**
 * Assert bad request response (400)
 */
export async function expectBadRequest(response: APIResponse, messagePattern?: string | RegExp): Promise<void> {
  await expectError(response, 400, messagePattern);
}

/**
 * Assert response time is within acceptable range
 */
export async function expectResponseTime(response: APIResponse, maxMs: number): Promise<void> {
  // Note: Playwright doesn't expose response time directly
  // This is a placeholder for custom timing implementation
  const timing = (response as any)._timing;
  if (timing) {
    const responseTime = timing.responseEnd - timing.requestStart;
    expect(responseTime, `Response time ${responseTime}ms exceeds ${maxMs}ms`).toBeLessThanOrEqual(maxMs);
  }
}

/**
 * Get response body as JSON with type assertion
 */
export async function getJsonBody<T = any>(response: APIResponse): Promise<T> {
  return await response.json() as T;
}

/**
 * Assert array response contains expected number of items
 */
export async function expectArrayLength(
  response: APIResponse,
  arrayPath: string,
  expectedLength: number
): Promise<void> {
  const body = await response.json();
  const array = arrayPath.split('.').reduce((obj, key) => obj[key], body);
  
  expect(Array.isArray(array), `${arrayPath} should be an array`).toBe(true);
  expect(array.length, `${arrayPath} length should be ${expectedLength}`).toBe(expectedLength);
}

