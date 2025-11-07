# Test Coverage Matrix

## Overview
This document outlines the test coverage for the User Management API, including role-based access control scenarios and feature coverage.

## Endpoints

|     Endpoint   | Method | Authentication | Admin | User      | Anonymous  |
|----------------|--------|----------------|-------|-----------|------------|
| `/login.php`   | POST   | No             | ✅    | ✅       | ✅        |
| `/users.php`   | GET    | Yes            | ✅    | ✅       | ❌        |
| `/users.php`   | POST   | Yes            | ✅    | ❌ (403) | ❌ (401)  |
| `/users.php`   | PUT    | Yes            | ✅    | ❌ (403) | ❌ (401)  |
| `/users.php`   | DELETE | Yes            | ✅    | ❌ (403) | ❌ (401)  |
| `/profile.php` | GET    | Yes            | ✅    | ✅       | ❌        |
| `/profile.php` | PUT    | Yes            | ✅    | ✅       | ❌        |
| `/reset.php`   | POST   | No             | ✅    | ✅       | ✅        |

## Test Suites

### 1. Authentication Tests (`tests/authentication/login.spec.ts`)

#### Positive Scenarios
- ✅ Login with valid admin credentials
- ✅ Login with valid user credentials
- ✅ Verify JWT token structure
- ✅ Verify token expiration information

#### Negative Scenarios
- ✅ Login with invalid password
- ✅ Login with non-existent email
- ✅ Login with missing email
- ✅ Login with missing password
- ✅ Login with invalid email format

#### Coverage: 9 tests

---

### 2. User List Tests (`tests/users/users.list.spec.ts`)

#### Positive Scenarios
- ✅ List users with admin token
- ✅ List users with user token
- ✅ Verify user structure and fields
- ✅ Verify both roles exist after reset

#### Negative Scenarios
- ✅ List without authentication token
- ✅ List with invalid token
- ✅ List with malformed token

#### Coverage: 7 tests

---

### 3. User CRUD Tests (`tests/users/users.crud.spec.ts`)

#### Create User
**Positive:**
- ✅ Create user with valid data as admin
- ✅ Create admin user when role specified

**Negative:**
- ✅ Create with missing required field
- ✅ Create with invalid email
- ✅ Create with duplicate email

#### Update User
**Positive:**
- ✅ Update user with valid data as admin

**Negative:**
- ✅ Update non-existent user
- ✅ Update with invalid email

#### Delete User
**Positive:**
- ✅ Delete user as admin
- ✅ Verify user actually deleted

**Negative:**
- ✅ Delete non-existent user
- ✅ Delete self (admin cannot delete self)

#### Coverage: 12 tests

---

### 4. Permission Tests (`tests/users/users.permissions.spec.ts`)

#### User Role Restrictions
- ✅ User can list users
- ✅ User cannot create users (403)
- ✅ User cannot update users (403)
- ✅ User cannot delete users (403)

#### Admin Role Privileges
- ✅ Admin can create users
- ✅ Admin can update users
- ✅ Admin can delete users
- ✅ Admin can create another admin

#### Cross-Role Scenarios
- ✅ User cannot elevate own role
- ✅ Admin can change user role

#### Coverage: 10 tests

---

### 5. Profile Tests (`tests/profile/profile.spec.ts`)

#### Get Profile
**Positive:**
- ✅ Get profile with admin token
- ✅ Get profile with user token
- ✅ Verify all required fields

**Negative:**
- ✅ Get profile without token
- ✅ Get profile with invalid token

#### Update Profile
**Positive:**
- ✅ Update profile name
- ✅ Update profile facebook
- ✅ Update profile avatar
- ✅ Update profile hobbies
- ✅ Update multiple fields at once
- ✅ Verify changes persist

**Negative:**
- ✅ Cannot update email via profile
- ✅ Cannot update role via profile
- ✅ Update without token

#### Security
- ✅ Only returns own profile data
- ✅ Cannot update another user's profile

#### Coverage: 16 tests

---

### 6. Database Reset Tests (`tests/database/reset.spec.ts`)

#### Positive Scenarios
- ✅ Reset database successfully
- ✅ Return sample data information
- ✅ Return account information
- ✅ Login works after reset
- ✅ Default users restored
- ✅ Custom users cleared
- ✅ Multiple resets work
- ✅ Consistent user count after reset
- ✅ No authentication required

#### Coverage: 9 tests

---

### 7. Smoke Tests (`tests/smoke/smoke.spec.ts`)

#### Critical Paths
- ✅ Login and list users
- ✅ Complete user CRUD workflow
- ✅ Profile management workflow
- ✅ Role-based access control
- ✅ Authentication flow
- ✅ Database reset functionality
- ✅ API accessibility
- ✅ JSON response format
- ✅ Response time validation

#### Coverage: 10 tests

---

## Total Test Coverage

| Category | Test Count |
|----------|-----------|
| Authentication | 9 |
| User List | 7 |
| User CRUD | 12 |
| Permissions | 10 |
| Profile | 16 |
| Database | 9 |
| Smoke | 10 |
| **TOTAL** | **73** |

## Test Data Management

### Test Accounts
- **Admin:** `admin@example.com` / `password`
- **User:** `john@example.com` / `password`

### Data Reset Strategy
- Database reset before each test suite that modifies data
- Smoke tests use pre-reset state for speed
- Random data generation for unique test cases

## Negative Testing Coverage

| Status Code | Scenario | Covered |
|-------------|----------|---------|
| 400 Bad Request | Missing fields, invalid data | ✅ |
| 401 Unauthorized | Missing/invalid token | ✅ |
| 403 Forbidden | Insufficient permissions | ✅ |
| 404 Not Found | Non-existent resources | ✅ |

## Security Testing

- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Self-deletion prevention
- ✅ Profile isolation (users can't see others)
- ✅ Email/role immutability in profile updates
- ✅ Password protection in responses

## Schema Validation

- ✅ Login response schema
- ✅ User object schema
- ✅ Error response structure

## Performance Testing

- ✅ Basic response time checks in smoke tests
- ⚠️ Load testing not included (consider k6/Artillery)

## Future Enhancements

### Recommended Additions
1. **Token Expiration Tests**
   - Test with expired tokens
   - Test token refresh mechanism

2. **Rate Limiting Tests**
   - Verify rate limits if implemented
   - Test throttling behavior

3. **Input Validation**
   - SQL injection attempts
   - XSS payload testing
   - Large payload handling

4. **Concurrency Tests**
   - Simultaneous updates
   - Race condition scenarios

5. **Integration Tests**
   - Multi-step business workflows
   - Complex permission scenarios

6. **Performance Benchmarks**
   - Load testing with multiple concurrent users
   - Response time under stress

## Running Tests

### All Tests
```bash
npm test
```

### Specific Suite
```bash
npx playwright test tests/authentication/
npx playwright test tests/users/
npx playwright test tests/profile/
```

### Smoke Tests Only
```bash
npx playwright test tests/smoke/
```

### With Debug
```bash
npx playwright test --debug
```

### CI Mode
```bash
npm run test:ci
```

## Test Reports

- **HTML Report:** `playwright-report/index.html`
- **Allure Report:** Generate with `npm run allure:generate`
- **Console Output:** Real-time during execution

