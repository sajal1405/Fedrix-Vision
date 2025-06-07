# Fedrix Vision – Fullstack Digital Marketing Suite
[![CI](https://github.com/your-org/fedrix-vision/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/fedrix-vision/actions/workflows/ci.yml)

An enterprise-grade platform built for managing digital agency tasks:
- 🔒 Supabase-backed auth, blog, kanban, calendar
- ⚡ Electron desktop with fullscreen and splash screen
- 🌌 Animated UI with GSAP transitions

---

## 🚀 Tech Stack

- React 18 + React Router
- Supabase (auth + database)
- Electron 29 (desktop app)
- React Native (mobile)
- Chart.js + GSAP

---

## 🛠 Setup

### 📦 Install
```bash
npm install
```

Copy `.env.example` to `.env`. The example file contains placeholder values:
```bash
cp .env.example .env
```
Open `.env` and replace the placeholders with your Supabase project URL and anon key.
The app expects the following variables:
- `REACT_APP_SUPABASE_URL` – your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` – the public anon key
- `REACT_APP_HF_API_URL` – optional HuggingFace inference endpoint used by the AI agent

### 🚀 Development

#### Web
Runs Create React App's `react-scripts` dev server on `http://localhost:3000`:
```bash
npm start
```
If you see "`react-scripts` is not recognized", ensure dependencies are installed with `npm install`.

#### Desktop
Electron loads the same dev server for the desktop app:
```bash
npm run electron
```


### Linting
Run ESLint to check code quality:

```bash
npm run lint
```


#### Mobile
Start the React Native packager inside the `mobile` folder:
```bash
npm run mobile
```

### Testing
Run all React tests once and exit:

```bash
npm test
```
The script runs `react-scripts test --watchAll=false` under the hood.

### 🤖 AI Agent
The Agent dashboard uses a public HuggingFace endpoint to generate draft social posts.
Set `REACT_APP_HF_API_URL` if you wish to point to a different model or self-hosted endpoint.


### Continuous Integration

A GitHub Actions workflow installs dependencies, lints the codebase and runs tests on every push and pull request.

