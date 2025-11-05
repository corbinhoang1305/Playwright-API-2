# README Badge Template

Copy các đoạn code dưới đây và paste vào file `README.md` chính của project.

---

## 🎯 Option 1: Simple Badges

```markdown
## CI/CD Status

[![Playwright Tests](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml)
[![Daily Tests](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml/badge.svg)](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml)
```

**Thay thế:**
- `<USERNAME>` → GitHub username của bạn
- `<REPO>` → Tên repository

---

## 🎨 Option 2: Badges with Branch

```markdown
## CI/CD Status

[![CI/CD Pipeline](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml)
[![Daily Tests](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml/badge.svg?branch=main)](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

---

## 🚀 Option 3: Full Status Section

```markdown
## 🎯 CI/CD & Testing Status

| Type | Status | Description |
|------|--------|-------------|
| **CI/CD Pipeline** | [![CI/CD](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml) | Auto tests on push & PR |
| **Daily Tests** | [![Daily](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml/badge.svg)](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml) | Scheduled 9:00 AM GMT+7 |
| **Test Reports** | [![Allure Report](https://img.shields.io/badge/Allure-Report-green)](https://<USERNAME>.github.io/<REPO>/) | View detailed reports |
| **License** | [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) | MIT License |

### 📊 Quick Links

- 📈 [View Test Reports](https://<USERNAME>.github.io/<REPO>/)
- 🔄 [CI/CD Workflows](https://github.com/<USERNAME>/<REPO>/actions)
- 📝 [CI/CD Documentation](.github/CICD_SETUP_GUIDE.md)
```

---

## 💎 Option 4: Beautiful Hero Section

```markdown
<div align="center">

# 🎭 Playwright API Testing Project

### Automated API Testing with CI/CD Pipeline

[![CI/CD Tests](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml)
[![Daily Tests](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml/badge.svg)](https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml)
[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[📊 View Reports](https://<USERNAME>.github.io/<REPO>/) • 
[📖 Documentation](.github/CICD_SETUP_GUIDE.md) • 
[🔄 Workflows](https://github.com/<USERNAME>/<REPO>/actions)

---

</div>
```

---

## 🎪 Option 5: Complete Project Header

```markdown
<div align="center">

# 🎭 Your Project Name

<p align="center">
  <strong>Comprehensive API Testing Suite with Playwright & TypeScript</strong>
</p>

<p align="center">
  <a href="https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml">
    <img src="https://github.com/<USERNAME>/<REPO>/actions/workflows/ci.yml/badge.svg" alt="CI/CD Tests">
  </a>
  <a href="https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml">
    <img src="https://github.com/<USERNAME>/<REPO>/actions/workflows/scheduled-tests.yml/badge.svg" alt="Daily Tests">
  </a>
  <a href="https://<USERNAME>.github.io/<REPO>/">
    <img src="https://img.shields.io/badge/Allure-Report-green" alt="Allure Report">
  </a>
  <a href="https://playwright.dev/">
    <img src="https://img.shields.io/badge/Playwright-1.40+-45ba4b?logo=playwright" alt="Playwright">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.3+-007ACC?logo=typescript" alt="TypeScript">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="https://<USERNAME>.github.io/<REPO>/">View Reports</a>
</p>

---

</div>

## ✨ Features

- ✅ **Automated CI/CD** - Tests run on every push
- ⏰ **Daily Scheduled Tests** - Auto run at 9:00 AM GMT+7
- 📊 **Allure Reports** - Beautiful test reports on GitHub Pages
- 🔐 **Secure** - GitHub Secrets for credentials
- 🚀 **Fast** - Parallel execution on multiple Node versions
- 📝 **TypeScript** - Type-safe test code
- 🎯 **Comprehensive** - CRUD, Authentication, Permissions tests

## 🏃 Quick Start

\`\`\`bash
# Clone repository
git clone https://github.com/<USERNAME>/<REPO>.git
cd <REPO>

# Install dependencies
npm install

# Setup environment
cp env.example .env

# Run tests
npm test

# View report
npm run report
\`\`\`

## 📚 Documentation

- [🚀 CI/CD Setup Guide](.github/CICD_SETUP_GUIDE.md)
- [📋 Workflows Documentation](.github/workflows/README.md)
- [📊 Test Reports](https://<USERNAME>.github.io/<REPO>/)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ using Playwright & TypeScript
</div>
```

---

## 🎨 Custom Badge Colors

You can customize badge colors by adding `?style=` and `&color=`:

```markdown
![Custom Badge](https://img.shields.io/badge/Custom-Badge-blue?style=for-the-badge&logo=github)
```

**Styles:**
- `flat` (default)
- `flat-square`
- `for-the-badge`
- `plastic`
- `social`

**Colors:**
- `brightgreen`, `green`, `yellowgreen`, `yellow`, `orange`, `red`
- `lightgrey`, `blue`, `blueviolet`, `ff69b4`
- Hex colors: `ff6900`

---

## 📸 Example Result

After adding badges, your README will look like:

![CI/CD Tests](https://img.shields.io/badge/CI/CD-passing-brightgreen)
![Daily Tests](https://img.shields.io/badge/Daily-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)

---

## 🔗 Useful Badge Resources

- [Shields.io](https://shields.io/) - Custom badge generator
- [Simple Icons](https://simpleicons.org/) - Brand logos for badges
- [GitHub Badges](https://github.com/badges/shields) - Badge library

---

## 💡 Tips

1. **Keep it clean** - Don't add too many badges
2. **Relevant only** - Only add badges that add value
3. **Update regularly** - Remove outdated badges
4. **Group logically** - Status, Tech Stack, License, etc.

---

**Choose your style and update your README! 🎉**

