# Restaurant Finder — Node.js Backend

A REST API built with Express + PostgreSQL, ready to deploy on Railway.

---

## Deploy to Railway (Step by Step)

### Step 1 — Create a GitHub repo

1. Go to https://github.com/new
2. Create a new **private** repository called `restaurant-finder-backend`
3. Don't initialize with README (we'll push our own files)

### Step 2 — Push this backend to GitHub

Open a terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/restaurant-finder-backend.git
git push -u origin main
```

### Step 3 — Create a Railway project

1. Go to https://railway.app and sign in (or sign up — it's free)
2. Click **"New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your `restaurant-finder-backend` repo
5. Railway will detect it's a Node.js app and deploy automatically

### Step 4 — Add a PostgreSQL database

1. Inside your Railway project, click **"+ New"**
2. Choose **"Database" → "PostgreSQL"**
3. Railway will automatically add a `DATABASE_URL` environment variable to your project

### Step 5 — Add environment variables

1. Click on your **backend service** (not the database)
2. Go to **"Variables"** tab
3. Add this variable:

| Key | Value |
|-----|-------|
| `JWT_SECRET` | any long random string, e.g. `myS3cr3tK3y_restaurant_2024_xyz` |

> `DATABASE_URL` and `PORT` are set automatically by Railway — don't add them.

### Step 6 — Get your backend URL

1. Click on your backend service
2. Go to **"Settings"** tab
3. Under **"Domains"**, click **"Generate Domain"**
4. Copy the URL — it looks like: `https://restaurant-finder-backend-production.up.railway.app`

### Step 7 — Update your Flutter app

Open `lib/core/api/api_endpoints.dart` in your Flutter project and replace:

```dart
static const String _base =
    'https://restaurant-finder-app-production.up.railway.app';
```

with your actual Railway URL:

```dart
static const String _base =
    'https://restaurant-finder-backend-production.up.railway.app';
```

Then run:
```bash
flutter pub get
flutter run
```

---

## API Endpoints

All endpoints except `/health` require `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Sign up |
| POST | `/auth/login` | ❌ | Login |
| GET | `/restaurants` | ✅ | All restaurants |
| GET | `/restaurants/:id` | ✅ | Single restaurant |
| GET | `/restaurants/:id/products` | ✅ | Products of a restaurant |
| GET | `/search/products` | ✅ | All product names (for dropdown) |
| GET | `/search?name=Cappuccino` | ✅ | Restaurants serving a product |
| GET | `/health` | ❌ | Health check |

---

## Local development (optional)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Fill in your local PostgreSQL DATABASE_URL and a JWT_SECRET

# 3. Run
npm run dev
```
