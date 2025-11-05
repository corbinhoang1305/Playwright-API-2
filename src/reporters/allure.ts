/**
 * Allure reporter configuration
 * @see https://www.npmjs.com/package/allure-playwright
 */

/**
 * Allure reporter configuration for playwright.config.ts
 */
export const allureConfig = {
  outputFolder: 'allure-results',
  detail: true,
  suiteTitle: true,
  environmentInfo: {
    'Test Environment': process.env.NODE_ENV || 'production',
    'Base URL': process.env.BASE_URL || 'https://material.playwrightvn.com/api/user-management/v1',
    'Node Version': process.version,
  },
};

/**
 * Allure categories configuration
 * Define custom failure categories for better reporting
 */
export const allureCategories = [
  {
    name: 'Authentication Failures',
    matchedStatuses: ['failed'],
    messageRegex: '.*401.*|.*Unauthorized.*|.*Invalid token.*',
  },
  {
    name: 'Permission Errors',
    matchedStatuses: ['failed'],
    messageRegex: '.*403.*|.*Forbidden.*|.*Insufficient permissions.*',
  },
  {
    name: 'Validation Errors',
    matchedStatuses: ['failed'],
    messageRegex: '.*400.*|.*Bad request.*|.*Invalid.*',
  },
  {
    name: 'Schema Validation Failures',
    matchedStatuses: ['failed'],
    messageRegex: '.*Schema validation failed.*',
  },
  {
    name: 'Timeout Errors',
    matchedStatuses: ['broken'],
    messageRegex: '.*Timeout.*|.*exceeded.*',
  },
];

/**
 * Helper function to add Allure attachments
 */
export function attachAllureData(testInfo: any, name: string, content: string, type: string = 'text/plain'): void {
  if (testInfo && testInfo.attach) {
    testInfo.attach(name, { body: content, contentType: type });
  }
}

/**
 * Helper to attach API request details to Allure report
 */
export function attachApiRequest(testInfo: any, method: string, url: string, body?: any, headers?: any): void {
  const requestData = {
    method,
    url,
    headers: headers || {},
    body: body || null,
  };
  
  attachAllureData(
    testInfo,
    'API Request',
    JSON.stringify(requestData, null, 2),
    'application/json'
  );
}

/**
 * Helper to attach API response details to Allure report
 */
export function attachApiResponse(testInfo: any, status: number, body: any, headers?: any): void {
  const responseData = {
    status,
    headers: headers || {},
    body,
  };
  
  attachAllureData(
    testInfo,
    'API Response',
    JSON.stringify(responseData, null, 2),
    'application/json'
  );
}

export default allureConfig;

