# User Management API - Playwright Test Suite

Comprehensive TypeScript Playwright API testing framework for the User Management API with JWT Authentication and Role-Based Access Control.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Organization](#test-organization)
- [Fixtures and Utilities](#fixtures-and-utilities)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)
- [Contributing](#contributing)

## ✨ Features

- **TypeScript-based** tests with full type safety
- **JWT Authentication** handling with token caching
- **Role-Based Access Control** testing (admin/user roles)
- **Schema Validation** using JSON Schema (Ajv)
- **Custom Fixtures** for auth, database reset, and client setup
- **Comprehensive Assertions** with helper utilities
- **Allure Reporting** for detailed test reports
- **Smoke Tests** for critical path validation
- **73+ test cases** covering positive and negative scenarios

## 🗂️ Project Structure

```
.
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── env.example                   # Environment variables template
│
├── config/
│   ├── env.ts                    # Environment configuration loader
│   └── test-data.ts              # Test data builders and utilities
│
├── src/
│   ├── clients/
│   │   └── userManagementClient.ts    # API client wrapper
│   ├── fixtures/
│   │   ├── auth.fixture.ts            # Authentication fixtures
│   │   └── reset.fixture.ts           # Database reset fixtures
│   ├── utils/
│   │   ├── schemaValidator.ts         # JSON schema validation
│   │   └── responseAsserts.ts         # Response assertion helpers
│   └── reporters/
│       └── allure.ts                  # Allure reporter config
│
├── tests/
│   ├── authentication/
│   │   └── login.spec.ts              # Authentication tests
│   ├── users/
│   │   ├── users.list.spec.ts         # List users tests
│   │   ├── users.crud.spec.ts         # CRUD operation tests
│   │   └── users.permissions.spec.ts  # Permission tests
│   ├── profile/
│   │   └── profile.spec.ts            # Profile management tests
│   ├── database/
│   │   └── reset.spec.ts              # Database reset tests
│   └── smoke/
│       └── smoke.spec.ts              # Critical path smoke tests
│
├── data/
│   ├── payloads/                      # Sample request payloads
│   │   ├── createUser.json
│   │   └── updateProfile.json
│   └── schemas/                       # JSON schemas for validation
│       ├── loginResponse.schema.json
│       └── user.schema.json
│
├── docs/
│   └── test-matrix.md                 # Test coverage documentation
│
└── scripts/
    └── seed.ts                        # Database seeding utility
```

## 🔧 Prerequisites

- **Node.js** 18+ (recommended: 20.x)
- **npm** 9+

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwrighht-API-2
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers (if needed for other features):
```bash
npx playwright install
```

4. Copy environment template:
```bash
# On Windows
copy env.example .env

# On Linux/Mac
cp env.example .env
```

5. Configure environment variables in `.env`:
```env
BASE_URL=https://material.playwrightvn.com/api/user-management/v1
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password
USER_EMAIL=john@example.com
USER_PASSWORD=password
NODE_ENV=production
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | API base URL | Production URL |
| `ADMIN_EMAIL` | Admin account email | admin@example.com |
| `ADMIN_PASSWORD` | Admin account password | password |
| `USER_EMAIL` | Regular user email | john@example.com |
| `USER_PASSWORD` | Regular user password | password |
| `NODE_ENV` | Environment type | production |

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test timeout (default: 30s)
- Parallel workers
- Retry strategy
- Reporter settings

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Authentication tests
npx playwright test tests/authentication/

# User management tests
npx playwright test tests/users/

# Profile tests
npx playwright test tests/profile/

# Smoke tests only
npx playwright test tests/smoke/
```

### Run with UI Mode (Debug)
```bash
npm run test:debug
```

### Run in Headed Mode
```bash
npm run test:headed
```

### Run CI Mode
```bash
npm run test:ci
```

### Run Single Test File
```bash
npx playwright test tests/authentication/login.spec.ts
```

### Run Tests with Grep
```bash
# Run tests matching pattern
npx playwright test --grep "should login"

# Exclude tests matching pattern
npx playwright test --grep-invert "should fail"
```

## 📚 Test Organization

### Test Categories

1. **Authentication Tests** (`tests/authentication/`)
   - Login scenarios (valid/invalid credentials)
   - JWT token validation
   - Error handling

2. **User Management Tests** (`tests/users/`)
   - List users
   - CRUD operations (Create, Update, Delete)
   - Permission-based access control

3. **Profile Tests** (`tests/profile/`)
   - Get own profile
   - Update profile fields
   - Security restrictions

4. **Database Tests** (`tests/database/`)
   - Database reset functionality
   - Data persistence verification

5. **Smoke Tests** (`tests/smoke/`)
   - Critical path validation
   - Quick health checks
   - Integration workflows

### Test Coverage

See [docs/test-matrix.md](docs/test-matrix.md) for detailed coverage matrix.

**Total:** 73+ test cases covering:
- ✅ Positive scenarios
- ✅ Negative scenarios
- ✅ Permission boundaries
- ✅ Schema validation
- ✅ Security testing

## 🛠️ Fixtures and Utilities

### Authentication Fixtures (`src/fixtures/auth.fixture.ts`)

Provides automatic token management:

```typescript
import { test, expect } from '../../src/fixtures/auth.fixture';

test('example test', async ({ client, adminToken, userToken }) => {
  // client: UserManagementClient instance
  // adminToken: Pre-authenticated admin JWT
  // userToken: Pre-authenticated user JWT
  
  const response = await client.listUsers(adminToken);
  expect(response.ok()).toBe(true);
});
```

**Features:**
- Token caching per worker
- Automatic token refresh
- Role-based token fixtures

### Database Reset Fixture (`src/fixtures/reset.fixture.ts`)

```typescript
test.beforeEach(async ({ resetDatabase }) => {
  await resetDatabase(); // Resets to default state
});
```

### Response Assertions (`src/utils/responseAsserts.ts`)

Helper functions for common assertions:

```typescript
import { expectSuccess, expectError, expectForbidden } from '../../src/utils/responseAsserts';

await expectSuccess(response);              // Assert 2xx
await expectError(response, 401, /token/);  // Assert error with pattern
await expectForbidden(response);            // Assert 403
```

### Schema Validation (`src/utils/schemaValidator.ts`)

```typescript
import { validateSchema, assertSchema } from '../../src/utils/schemaValidator';

const result = validateSchema('loginResponse', data);
assertSchema('user', userData); // Throws on failure
```

### API Client (`src/clients/userManagementClient.ts`)

Typed wrapper around Playwright's APIRequestContext:

```typescript
const client = new UserManagementClient(apiContext);

// Login
const response = await client.login(email, password);

// CRUD operations
await client.listUsers(token);
await client.createUser(token, userData);
await client.updateUser(token, userData);
await client.deleteUser(token, userId);

// Profile
await client.getProfile(token);
await client.updateProfile(token, profileData);

// Database
await client.resetDatabase();
```

## 📊 Reporting

### HTML Report

Generated automatically after test run:
```bash
npm run report
```

Opens `playwright-report/index.html` in browser.

### Allure Report

Generate and view Allure report:
```bash
npm run allure:generate
npm run allure:open
```

**Features:**
- Test categorization by suite
- Failure screenshots and traces
- Request/response attachments
- Historical trends

### Console Output

Real-time test execution with:
- Test status (pass/fail)
- Execution time
- Error details

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Environment Variables in CI

Set secrets in your CI platform:
- `BASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `USER_EMAIL`
- `USER_PASSWORD`

## 📝 Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '../../src/fixtures/auth.fixture';
import { expectSuccess } from '../../src/utils/responseAsserts';

test.describe('My Feature', () => {
  test.beforeEach(async ({ client }) => {
    await client.resetDatabase();
  });

  test('should perform action', async ({ client, adminToken }) => {
    const response = await client.someAction(adminToken);
    await expectSuccess(response);
    
    const body = await response.json();
    expect(body.data).toBeDefined();
  });
});
```

### Using Test Data Builders

```typescript
import { userPayloads } from '../../config/test-data';

const newUser = userPayloads.createUser({
  name: 'Custom Name',
  role: 'admin'
});

const response = await client.createUser(adminToken, newUser);
```

## 🐛 Debugging

### Debug Single Test
```bash
npx playwright test tests/authentication/login.spec.ts --debug
```

### View Trace
```bash
npx playwright show-trace trace.zip
```

### Enable Debug Logs
```bash
DEBUG=pw:api npm test
```

## 🤝 Contributing

1. Write tests following existing patterns
2. Add schema validation for new endpoints
3. Update test-matrix.md for coverage
4. Ensure all tests pass before committing
5. Follow TypeScript and ESLint guidelines

## 📖 Additional Resources

- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [User Management API Docs](https://material.playwrightvn.com/api/user-management/swagger.html)
- [Playwright Vietnam Community](https://playwrightvn.com)

## 📄 License

MIT

## 🙏 Acknowledgments

- **Playwright Vietnam** for the test API
- **Playwright Team** for the testing framework
- **Contributors** to this project

---

**Happy Testing! 🎭**

