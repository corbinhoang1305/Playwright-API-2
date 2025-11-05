# GitHub Actions CI/CD Workflows

## 📋 Overview

Dự án này sử dụng GitHub Actions để tự động chạy API tests với Playwright trong các tình huống sau:

## 🔄 Workflows

### 1. **CI/CD Pipeline** (`ci.yml`)

**Trigger:**
- ✅ Khi push code lên các nhánh: `main`, `develop`, `feature/**`, `bugfix/**`
- ✅ Khi tạo Pull Request vào `main` hoặc `develop`
- ✅ Có thể chạy thủ công qua GitHub UI (workflow_dispatch)

**Chức năng:**
- Chạy tests trên nhiều phiên bản Node.js (18, 20)
- Tự động tạo và upload Playwright HTML report
- Tạo Allure report và deploy lên GitHub Pages
- Lưu trữ test results và artifacts trong 30 ngày

### 2. **Daily Scheduled Tests** (`scheduled-tests.yml`)

**Trigger:**
- ⏰ Tự động chạy vào **9:00 AM GMT+7** mỗi ngày (2:00 AM UTC)
- ✅ Có thể chạy thủ công qua GitHub UI

**Chức năng:**
- Chạy full test suite hàng ngày
- Tạo test summary report
- Tự động tạo GitHub Issue nếu tests fail
- Upload daily reports với timestamp

## ⚙️ Setup Instructions

### Bước 1: Enable GitHub Actions

1. Vào repository trên GitHub
2. Click vào tab **Actions**
3. Enable workflows nếu chưa được bật

### Bước 2: Cấu hình Secrets (Tùy chọn)

Để bảo mật thông tin nhạy cảm, thêm các secrets sau vào repository:

1. Vào **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Thêm các secrets sau:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `BASE_URL` | API base URL | `https://material.playwrightvn.com/api/user-management/v1` |
| `ADMIN_EMAIL` | Admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin password | `your-password` |
| `USER_EMAIL` | Regular user email | `john@example.com` |
| `USER_PASSWORD` | Regular user password | `your-password` |

**Lưu ý:** Nếu không cấu hình secrets, workflow sẽ sử dụng giá trị mặc định từ `env.example`.

### Bước 3: Enable GitHub Pages (Cho Allure Report)

1. Vào **Settings** → **Pages**
2. Chọn **Source**: Deploy from a branch
3. Chọn **Branch**: `gh-pages` / `root`
4. Click **Save**

Sau khi workflow chạy xong, Allure report sẽ có tại: `https://<username>.github.io/<repository>/`

## 🚀 Cách Sử Dụng

### Chạy Tests Tự Động

Tests sẽ tự động chạy khi:
- Bạn push code lên GitHub
- Tạo Pull Request
- Đến 9:00 AM GMT+7 hàng ngày

### Chạy Tests Thủ Công

1. Vào tab **Actions** trên GitHub
2. Chọn workflow muốn chạy:
   - **Playwright API Tests CI/CD** - chạy full test suite
   - **Daily Scheduled Tests** - chạy daily test
3. Click **Run workflow**
4. Chọn branch và click **Run workflow**

### Xem Test Reports

#### Playwright HTML Report

1. Vào tab **Actions**
2. Click vào workflow run muốn xem
3. Scroll xuống **Artifacts** section
4. Download `playwright-report` hoặc `daily-playwright-report`
5. Giải nén và mở file `index.html`

#### Allure Report (GitHub Pages)

Sau khi workflow hoàn thành:
- Truy cập: `https://<username>.github.io/<repository>/`
- Xem report online, không cần download

#### Test Summary

1. Vào workflow run
2. Xem **Summary** tab
3. Test summary sẽ hiển thị ở đây

## 🔔 Notifications

### Automatic Issue Creation

Khi **Daily Scheduled Tests** fail:
- Tự động tạo GitHub Issue với label `test-failure`, `automated`, `daily-test`
- Issue bao gồm:
  - Thời gian test fail
  - Link đến workflow run
  - Link download reports
  - Checklist các bước cần làm

### Email Notifications

GitHub sẽ tự động gửi email khi:
- Workflow fails
- Có issue mới được tạo
- Workflow hoàn thành (có thể tắt trong settings)

## 📊 Test Matrix

Workflow chạy tests trên:
- **OS**: Ubuntu Latest
- **Node.js**: 18.x, 20.x
- **Parallel**: 2 workers (trên CI)
- **Retry**: 1 lần (chỉ trên CI)

## 🛠️ Customization

### Thay Đổi Thời Gian Schedule

Edit file `.github/workflows/scheduled-tests.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # 9:00 AM GMT+7
```

Cron format: `minute hour day month day-of-week`

**Ví dụ:**
- `0 2 * * *` - 9:00 AM GMT+7 (2:00 AM UTC) mỗi ngày
- `0 1 * * *` - 8:00 AM GMT+7 (1:00 AM UTC) mỗi ngày
- `0 2 * * 1` - 9:00 AM GMT+7 mỗi thứ 2
- `0 2 1 * *` - 9:00 AM GMT+7 ngày 1 hàng tháng

### Thay Đổi Branches Trigger

Edit file `.github/workflows/ci.yml`:

```yaml
on:
  push:
    branches:
      - main
      - develop
      - 'feature/**'  # Thêm hoặc bớt branches
```

### Thay Đổi Node.js Versions

Edit file `.github/workflows/ci.yml`:

```yaml
strategy:
  matrix:
    node-version: [18, 20]  # Thêm hoặc bớt versions
```

## 📝 Best Practices

1. **Luôn review test results** sau mỗi lần chạy
2. **Fix failing tests ngay lập tức** để tránh block CI/CD
3. **Sử dụng secrets** cho thông tin nhạy cảm
4. **Review Allure reports** để track test trends
5. **Xử lý issues tự động** từ daily tests kịp thời

## 🐛 Troubleshooting

### Tests Fail Trên CI Nhưng Pass Ở Local

- Check environment variables
- Check Node.js version
- Review CI logs trong workflow run

### Allure Report Không Deploy

- Kiểm tra GitHub Pages đã enable chưa
- Kiểm tra branch `gh-pages` đã được tạo chưa
- Review workflow logs

### Secrets Không Hoạt Động

- Verify secrets đã được add đúng tên
- Secrets chỉ available cho branches được protect
- Check syntax trong workflow file

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [Cron Expression Generator](https://crontab.guru/)

## 🤝 Support

Nếu gặp vấn đề, hãy:
1. Check workflow logs trên GitHub Actions
2. Review test reports
3. Tạo issue mới với tag `ci-cd`

