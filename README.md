# Fedrix Vision – Fullstack Digital Marketing Suite

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

Copy the provided environment file and add your Supabase credentials:
```bash
cp .env.example .env
```
The app expects the following variables:
- `VITE_SUPABASE_URL` – your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` – the public anon key

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
