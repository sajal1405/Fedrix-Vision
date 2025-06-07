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

Create your own `.env` file using the provided template. The repository does not
track this file, so you need to copy it manually:
```bash
cp .env.example .env
```
Open `.env` and replace the placeholders with your Supabase project URL and anon
key. The app expects the following variables:
- `REACT_APP_SUPABASE_URL` – your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` – the public anon key
- `REACT_APP_HF_API_URL` – optional HuggingFace inference endpoint used by the AI agent's `generateContent` function

Before launching the dashboard, run the migration that creates the `reminders` table to avoid `404` errors when fetching reminders:

```bash
psql < supabase/create_reminders_table.sql
```

### 🚀 Development

#### Web
Runs Create React App's `react-scripts` dev server on `http://localhost:3000`:
```bash
npm start
```
If you see "`react-scripts` is not recognized", ensure dependencies are installed with `npm install`.

#### Desktop
Electron loads the same dev server for the desktop app. The window URL can be
configured via the `DESKTOP_BASE_URL` variable in your `.env` file (defaults to
`http://localhost:3000`).

Run in development:
```bash
npm run electron
```

Create a production build and launch Electron against it:
```bash
npm run build
cd desktop && npm start
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
Then build the native app (choose the platform you need):
```bash
npx react-native run-android # or run-ios
```

### Testing
Run all React tests once and exit:

```bash
npm test
```
The script runs `react-scripts test --watchAll=false` under the hood.

### Database Migration
If you already have a Supabase project set up, add the new `type` column to the
`events` table before running the updated application:

```sql
alter table events add column type text not null default 'meeting';
```

With the [Supabase CLI](https://supabase.com/docs/guides/cli), you can run:

```bash
supabase db query "alter table events add column type text not null default 'meeting';"
```

### 🤖 AI Agent
The Agent dashboard uses a public HuggingFace endpoint to generate draft social posts.
Set `REACT_APP_HF_API_URL` if you wish to point to a different model or self-hosted endpoint. This value is read by the context when calling `generateContent`.

### Database
SQL for the analytics tables lives in `supabase/create_analytics_tables.sql`. Run the script in your Supabase project to create the `campaign_roi` and `page_visits` tables:

```bash
psql < supabase/create_analytics_tables.sql
```

SQL for the reminders table lives in `supabase/create_reminders_table.sql`. **Make sure to run this migration** or the app will return `404` errors when trying to fetch reminders:

```bash
psql < supabase/create_reminders_table.sql
```


### Database Setup
The application requires the following tables inside your Supabase database:

- `tasks` – no migration script included (create manually)
- `posts` – no migration script included (create manually)
- `scheduled_posts` – no migration script included (create manually)
- `reminders` – defined in `supabase/create_reminders_table.sql`
- `events` – no migration script included (create manually)
- `campaign_roi` – defined in `supabase/create_analytics_tables.sql`
- `page_visits` – defined in `supabase/create_analytics_tables.sql`
- `profiles` – no migration script included (create manually)

Apply the SQL files using the `psql` CLI. For example:

```bash
# Create analytics tables
psql < supabase/create_analytics_tables.sql

# Run your own scripts for the other tables, e.g.

psql < supabase/create_reminders_table.sql
```



### Continuous Integration

A GitHub Actions workflow installs dependencies, lints the codebase and runs tests on every push and pull request.

