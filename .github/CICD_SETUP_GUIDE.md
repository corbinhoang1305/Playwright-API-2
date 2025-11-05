# 🚀 Hướng Dẫn Setup CI/CD - GitHub Actions

## Tóm Tắt Nhanh

Dự án đã được setup 2 workflows tự động:

1. **CI/CD Pipeline** - Chạy mỗi khi push code
2. **Daily Tests** - Chạy vào 9:00 AM GMT+7 hàng ngày

---

## ⚡ Quick Start - 5 Phút Setup

### Bước 1: Push Code Lên GitHub

```bash
git add .
git commit -m "Add GitHub Actions CI/CD workflows"
git push origin main
```

### Bước 2: Enable GitHub Actions

1. Vào repository trên GitHub
2. Click tab **Actions**
3. Nếu xuất hiện nút "I understand my workflows, go ahead and enable them", click vào đó

✅ **Xong!** Workflows đã sẵn sàng chạy.

---

## 🔐 Setup Secrets (Tùy Chọn - Khuyến Nghị)

### Tại Sao Cần Secrets?

- Bảo mật thông tin đăng nhập
- Tránh để lộ password trong logs
- Best practice cho production

### Cách Thêm Secrets

1. Vào repository → **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Thêm từng secret sau:

#### Danh Sách Secrets

| Tên Secret | Giá Trị | Bắt Buộc? |
|-----------|---------|-----------|
| `BASE_URL` | URL API của bạn | ❌ Không* |
| `ADMIN_EMAIL` | Email admin | ❌ Không* |
| `ADMIN_PASSWORD` | Password admin | ✅ Nên có |
| `USER_EMAIL` | Email user thường | ❌ Không* |
| `USER_PASSWORD` | Password user | ✅ Nên có |

*\*Nếu không có, sẽ dùng giá trị mặc định từ `env.example`*

#### Ví Dụ Thêm Secret

```
Name: ADMIN_PASSWORD
Secret: YourStrongPassword123!
```

---

## 📊 Enable GitHub Pages (Cho Allure Report)

### Bước 1: Chờ Workflow Chạy Lần Đầu

Workflow cần chạy ít nhất 1 lần để tạo branch `gh-pages`

### Bước 2: Enable Pages

1. Vào **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: Chọn `gh-pages` → `/ (root)`
4. Click **Save**

### Bước 3: Xem Report

Sau 1-2 phút, report có tại:
```
https://<your-username>.github.io/<repo-name>/
```

---

## 🎯 Test Workflows

### Test Manual Run

1. Vào tab **Actions**
2. Chọn workflow **Playwright API Tests CI/CD**
3. Click **Run workflow**
4. Chọn branch `main`
5. Click **Run workflow**

### Kiểm Tra Results

1. Đợi workflow chạy xong (≈ 2-3 phút)
2. Click vào workflow run
3. Xem **Summary** tab
4. Download **Artifacts** nếu cần

---

## 📅 Verify Daily Schedule

Workflow schedule sẽ tự động chạy vào **9:00 AM GMT+7** hàng ngày.

### Test Schedule (Không Đợi Đến 9 Giờ Sáng)

1. Vào tab **Actions**
2. Chọn **Daily Scheduled Tests**
3. Click **Run workflow** → **Run workflow**
4. Xem kết quả

### Kiểm Tra Lần Chạy Tiếp Theo

1. Vào tab **Actions**
2. Chọn **Daily Scheduled Tests**
3. Xem phần "This workflow has a workflow_dispatch event trigger."
4. Lần chạy schedule tiếp theo sẽ hiển thị ở đây

---

## 🔔 Setup Notifications

### Email Notifications

GitHub tự động gửi email khi workflow fails:

1. Vào **Settings** (personal settings, không phải repo)
2. **Notifications**
3. Đảm bảo **Actions** được enable

### Tắt Notifications Cho Success

Nếu không muốn nhận email khi test pass:

1. Vào **Settings** (personal)
2. **Notifications** → **Actions**
3. Uncheck "Send notifications for failed workflows only"

---

## 🎨 Thêm Badges Vào README

Copy và paste vào file `README.md` chính:

```markdown
# Your Project Name

[![Playwright Tests](https://github.com/<username>/<repo>/actions/workflows/ci.yml/badge.svg)](https://github.com/<username>/<repo>/actions/workflows/ci.yml)
[![Daily Tests](https://github.com/<username>/<repo>/actions/workflows/scheduled-tests.yml/badge.svg)](https://github.com/<username>/<repo>/actions/workflows/scheduled-tests.yml)

[Xem Allure Report](https://<username>.github.io/<repo>/)
```

Thay `<username>` và `<repo>` bằng thông tin repo của bạn.

---

## 🎬 Demo Workflow Flow

### Khi Push Code:

```
1. Bạn push code
   ↓
2. GitHub Actions detect push
   ↓
3. Start workflow "CI/CD Pipeline"
   ↓
4. Install dependencies
   ↓
5. Run tests trên Node 18 & 20 (parallel)
   ↓
6. Generate reports
   ↓
7. Upload artifacts & deploy Allure report
   ↓
8. Bạn nhận notification (nếu fail)
```

### Khi Daily Schedule:

```
1. 9:00 AM GMT+7
   ↓
2. GitHub Actions trigger tự động
   ↓
3. Run full test suite
   ↓
4. Generate reports
   ↓
5. Nếu FAIL → Tạo GitHub Issue tự động
   ↓
6. Upload daily report với timestamp
```

---

## ✅ Checklist Setup

- [ ] Push code lên GitHub
- [ ] Enable GitHub Actions
- [ ] Thêm Secrets (khuyến nghị)
- [ ] Test manual run workflow
- [ ] Enable GitHub Pages
- [ ] Verify Allure report
- [ ] Test daily schedule workflow
- [ ] Setup email notifications
- [ ] Thêm badges vào README
- [ ] Đọc kỹ troubleshooting guide

---

## 🐛 Troubleshooting

### ❌ Workflow Không Chạy

**Nguyên nhân:**
- Actions chưa được enable
- Workflow file có lỗi syntax

**Giải pháp:**
1. Enable Actions trong repository settings
2. Check syntax YAML online: [YAML Validator](https://www.yamllint.com/)

### ❌ Tests Fail Trên CI Nhưng Pass Local

**Nguyên nhân:**
- Environment variables khác
- Node version khác
- Dependencies không đồng bộ

**Giải pháp:**
```bash
# Test với CI mode local
CI=true npm run test:ci

# Check Node version
node --version  # Nên dùng 18 hoặc 20

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### ❌ Allure Report 404

**Nguyên nhân:**
- GitHub Pages chưa enable
- Branch gh-pages chưa tồn tại
- Đang chờ deploy

**Giải pháp:**
1. Đảm bảo workflow đã chạy thành công
2. Đợi 2-3 phút sau khi enable Pages
3. Clear browser cache và thử lại

### ❌ Secrets Không Hoạt Động

**Nguyên nhân:**
- Tên secret bị sai
- Typo trong workflow file
- Scope không đúng

**Giải pháp:**
1. Kiểm tra lại tên secrets (case-sensitive)
2. Verify workflow file syntax
3. Đảm bảo secrets ở repo level, không phải organization

---

## 📈 Monitoring

### Xem Workflow History

```
Actions → Select workflow → View all runs
```

### Download Reports

```
Workflow run → Scroll to Artifacts → Download
```

### Xem Issues Tự Động

```
Issues → Filter by labels: test-failure, automated
```

---

## 🎓 Next Steps

Sau khi setup xong:

1. **Monitor test results** trong vài ngày đầu
2. **Review Allure reports** để hiểu test trends
3. **Tune performance** nếu tests chạy quá lâu
4. **Add more test cases** và commit
5. **Share report links** với team

---

## 📚 Resources

- [Main Workflows README](./.workflows/README.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Playwright CI Docs](https://playwright.dev/docs/ci)
- [Allure Report](https://docs.qameta.io/allure/)

---

## 💡 Tips & Best Practices

### 1. Keep Tests Fast
```typescript
// Good - Run parallel
test.describe.configure({ mode: 'parallel' });

// Bad - Too many retries
test.describe.configure({ retries: 5 }); // Quá nhiều!
```

### 2. Use Test Tags
```typescript
test('important feature @smoke', async () => {
  // Critical test
});
```

Chạy chỉ smoke tests:
```bash
npx playwright test --grep @smoke
```

### 3. Clean Test Data
```typescript
test.afterEach(async ({ request }) => {
  // Cleanup sau mỗi test
  await request.delete('/cleanup');
});
```

### 4. Monitor Flaky Tests
- Check Allure report "Flaky Tests" section
- Fix hoặc quarantine tests không ổn định

### 5. Keep Workflows Updated
```bash
# Update Playwright regularly
npm update @playwright/test
npx playwright install
```

---

## 🆘 Need Help?

- **Issue với workflow**: Tạo issue với label `ci-cd`
- **Test failures**: Check workflow logs và artifacts
- **Questions**: Review [Workflows README](./workflows/README.md)

---

**Happy Testing! 🎉**

*Last Updated: November 2025*

