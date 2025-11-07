# 🚀 Quick Start - CI/CD GitHub Actions

## ⚡ 3 Lệnh Để Deploy CI/CD

```bash
# 1. Add files
git add .github/ CICD_SUMMARY.md QUICK_START_CICD.md

# 2. Commit
git commit -m "feat: Add GitHub Actions CI/CD workflows"

# 3. Push
git push origin main
```

✅ **Xong!** Workflows đã được deploy.

---

## 🎯 Những Gì Bạn Vừa Có

### ✅ Automatic Testing
- Chạy test mỗi khi push code
- Chạy test khi tạo Pull Request
- Test trên Node.js 18 & 20

### ⏰ Daily Scheduled Tests
- Tự động chạy **9:00 AM GMT+7** mỗi ngày
- Tạo GitHub Issue nếu test fail
- Daily test summary report

### 📊 Reports
- Playwright HTML Report
- Allure Report trên GitHub Pages
- Test artifacts (30 ngày)

### 🔔 Notifications
- Email khi workflow fails
- Auto-create issues cho daily failures

---

## 📁 Files Đã Được Tạo

```
📦 Your Project
│
├── 📁 .github/
│   ├── 📁 workflows/
│   │   ├── ci.yml                    # Main CI/CD pipeline
│   │   ├── scheduled-tests.yml       # Daily tests (9AM GMT+7)
│   │   └── README.md                 # Workflows documentation
│   │
│   ├── CICD_SETUP_GUIDE.md          # Chi tiết setup từng bước
│   ├── README_BADGE_TEMPLATE.md     # Badges cho README
│   └── DEPLOYMENT_CHECKLIST.md      # Checklist deploy
│
├── CICD_SUMMARY.md                  # Tóm tắt toàn bộ setup
└── QUICK_START_CICD.md             # File này - Quick start
```

---

## 🎬 Next Steps (5 Phút)

### 1️⃣ Enable GitHub Actions (1 phút)
```
GitHub → Your Repo → Actions tab → Enable workflows
```

### 2️⃣ Run Manual Test (2 phút)
```
Actions → "Playwright API Tests CI/CD" → Run workflow
```

### 3️⃣ Enable GitHub Pages (2 phút)
```
Settings → Pages → Source: gh-pages → Save
```

**Allure Report URL:**
```
https://<your-username>.github.io/<your-repo>/
```

---

## 🔐 Optional: Add Secrets

```
Settings → Secrets and variables → Actions → New repository secret
```

**Add these:**
- `ADMIN_PASSWORD` ← Recommended
- `USER_PASSWORD` ← Recommended  
- `BASE_URL` ← Optional
- `ADMIN_EMAIL` ← Optional
- `USER_EMAIL` ← Optional

---

## 📊 Verify It Works

### Check Workflow Status:
```
Actions tab → See workflow runs
```

### Download Report:
```
Workflow run → Artifacts → Download "playwright-report"
```

### View Online Report:
```
https://<username>.github.io/<repo>/
```

---

## 🎨 Add Badges to README

Copy this to your `README.md`:

```markdown
[![CI/CD](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml)
[![Daily Tests](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml/badge.svg)](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml)

📊 [View Test Reports](https://<USERNAME>.github.io/<REPO>/)
```

Replace `<USERNAME>` và `<REPO>`.

---

## 📅 What Runs When?

| Event | Workflow | When | Node Versions |
|-------|----------|------|---------------|
| **Push code** | CI/CD | Immediately | 18, 20 |
| **Pull Request** | CI/CD | On PR create/update | 18, 20 |
| **Daily** | Scheduled | 9:00 AM GMT+7 | 20 |
| **Manual** | Both | Anytime you click | Your choice |

---

## 🔄 Workflow Triggers

### Automatic:
```
✅ Push to: main, develop, feature/*, bugfix/*
✅ Pull Request to: main, develop
✅ Daily: 9:00 AM GMT+7 (2:00 AM UTC)
```

### Manual:
```
Actions → Select workflow → Run workflow → Run
```

---

## 📝 Test Commands

### Local:
```bash
# Run all tests
npm test

# Run with CI config
npm run test:ci

# Run with browser
npm run test:headed

# Debug mode
npm run test:debug

# View report
npm run report
```

### CI/CD runs:
```bash
npm run test:ci
```

---

## 🎯 Success Indicators

After push, you should see:

✅ Workflow starts in Actions tab  
✅ Tests run and pass  
✅ Green checkmark appears  
✅ Reports are generated  
✅ Allure deployed to Pages  
✅ Badges show "passing"  

---

## 🐛 Quick Troubleshooting

### ❌ Workflow không chạy?
→ Enable Actions in Settings

### ❌ Tests fail trên CI?
→ Check logs in workflow run

### ❌ GitHub Pages 404?
→ Wait 2-3 minutes, clear cache

### ❌ Badges không hiện?
→ Check username/repo name

---

## 📚 Full Documentation

Cần chi tiết hơn? Đọc:

- 📖 **Setup Guide:** `.github/CICD_SETUP_GUIDE.md`  
  *Hướng dẫn từng bước chi tiết*

- 📋 **Workflows README:** `.github/workflows/README.md`  
  *Chi tiết về mỗi workflow*

- ✅ **Deployment Checklist:** `.github/DEPLOYMENT_CHECKLIST.md`  
  *Checklist hoàn chỉnh với từng step*

- 📊 **Summary:** `CICD_SUMMARY.md`  
  *Tổng quan về toàn bộ setup*

- 🎨 **Badge Templates:** `.github/README_BADGE_TEMPLATE.md`  
  *5 options để thêm badges vào README*

---

## 🎯 Common Use Cases

### Case 1: Test trước khi merge PR
```
1. Create branch: git checkout -b feature/new-test
2. Write code and commit
3. Push: git push origin feature/new-test
4. Create PR on GitHub
5. Wait for CI/CD to run
6. Check results → Merge if pass
```

### Case 2: Check daily test results
```
1. Vào Actions → Daily Scheduled Tests
2. Click vào run gần nhất
3. Check Summary và Artifacts
4. Download reports nếu cần
```

### Case 3: Debug test failures
```
1. Workflow run → Click failed job
2. Expand failed step
3. Read error logs
4. Download test-results artifact
5. Run locally: npm run test:debug
```

---

## 💡 Pro Tips

### 1. Monitor First Few Runs
```
Watch first 2-3 workflow runs carefully
Fix any issues immediately
```

### 2. Check Daily at 9:30 AM
```
Review daily test results
Check for new failures
Handle auto-created issues
```

### 3. Keep Tests Fast
```
Current: ~2-3 minutes
Target: < 5 minutes
Optimize if longer
```

### 4. Use Allure Trends
```
Check test execution trends
Identify flaky tests
Track performance over time
```

### 5. Review Weekly
```
Every week, review:
- Pass/fail rate
- Flaky tests
- Slow tests
- Coverage gaps
```

---

## 🎊 You're Ready!

### What Happens Next:

1. **Bạn push code** → Tests run automatically ✅
2. **9:00 AM mỗi ngày** → Tests run automatically ⏰
3. **Tests fail** → You get notified 📧
4. **Reports** → Always available online 📊

---

## 🚀 Deploy Now!

```bash
git add .
git commit -m "feat: Add GitHub Actions CI/CD"
git push origin main
```

**Sau đó:**
1. Vào Actions tab
2. Enable workflows
3. Run manual test
4. Enable GitHub Pages
5. ✅ Done!

---

## 📞 Need Help?

Stuck? Check:

1. **Logs:** Actions → Workflow run → Job → Step logs
2. **Docs:** Files trong `.github/` folder
3. **Issues:** Create issue với label `ci-cd`

---

<div align="center">

## 🎉 Happy Testing!

**Questions?** Read [CICD_SETUP_GUIDE.md](.github/CICD_SETUP_GUIDE.md)

**Issues?** Check [DEPLOYMENT_CHECKLIST.md](.github/DEPLOYMENT_CHECKLIST.md)

---

*Setup time: 5 minutes | Maintenance: Minimal | Value: Priceless* 💎

</div>




