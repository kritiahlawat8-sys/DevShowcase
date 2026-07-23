# DevShowcase

A multi-tenant portfolio CMS built with Next.js, where candidates can manage their profile and projects through an authenticated dashboard, sync their GitHub and LeetCode activity, and get a live, publicly accessible portfolio page rendered in one of four distinct animated themes.

---

## Features

### Implemented
- Authentication with NextAuth.js (JWT strategy, credentials login, bcrypt password hashing)
- Role-Based Access Control (candidate vs admin, backend-level)
- Multi-tenant architecture using unique `tenantID` per user
- Profile management (name, bio, GitHub username, LeetCode username)
- Full Projects CRUD (create, read, update, delete)
- GitHub & LeetCode sync (fetches and caches repo/stats data on demand)
- Public portfolio API (no auth required) at `/api/portfolio/[tenant]`
- Dynamic public portfolio page at `/[tenant]`
- Four animated portfolio themes: Minimalist, Dashboard/Metrics, Cyberpunk, Interactive 3D
- Live theme switching from the dashboard with instant preview

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes (Node.js)
- **Database:** MongoDB Atlas with Mongoose
- **Auth:** NextAuth.js (Credentials Provider, JWT)
- **Deployment:** Vercel

---

## How to Run This Project Locally

### Prerequisites
- Node.js v18 or later installed
- A MongoDB Atlas account (free tier works)
- Git installed

### Step 1: Clone the repository
```bash
git clone https://github.com/kritiahlawat8-sys/DevShowcase.git
cd devshowcase
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up environment variables
Create a file named `.env.local` in the root of the project and add:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

- Get `MONGODB_URI` from your MongoDB Atlas dashboard → Connect → Drivers. Make sure your current IP is whitelisted under Network Access.
- Generate `NEXTAUTH_SECRET` by running: `openssl rand -base64 32`
- Keep `NEXTAUTH_URL` as `http://localhost:3000` for local development.

### Step 4: Run the development server
```bash
npm run dev
```

### Step 5: Open the app
Go to `http://localhost:3000` in your browser.

### Step 6: Create an account
Navigate to the signup page, create a candidate account, and you'll be redirected to `/dashboard`.

---

## Project Structure

​```
src/
├── app/
│ ├── api/
│ │ ├── profile/route.js
│ │ ├── projects/route.js
│ │ ├── portfolio/[tenant]/route.js
│ │ └── sync/
│ │ ├── github/route.js
│ │ └── leetcode/route.js
│ ├── dashboard/page.js
│ └── [tenant]/page.js
├── components/
│ ├── portfolioHeader.jsx
│ ├── projectCard.jsx
│ └── themes/
│ ├── MinimalistTheme.jsx
│ ├── DashboardTheme.jsx
│ ├── CyberpunkTheme.jsx
│ └── ThreeDTheme.jsx
└── lib/
├── db.js
├── authOptions.js
└── models/
├── user.js
└── project.js

​```
---

# 📷 Screenshots

### Login Page
<img width="221" height="168" alt="image" src="https://github.com/user-attachments/assets/53f60e82-52af-45fc-867c-213eaa34a340" />

### Dashboard
<img width="869" height="690" alt="image" src="https://github.com/user-attachments/assets/47646e7e-65b8-49a2-801a-05cab85346ba" />

### GitHub & LeetCode Sync
<img width="811" height="690" alt="image" src="https://github.com/user-attachments/assets/d48eac79-46ce-4787-b927-ae4120620842" />

### Portfolio Themes

**Minimalist**
<img width="1087" height="821" alt="image" src="https://github.com/user-attachments/assets/9249121b-dbd9-4700-8a65-c50e637a76e4" />

**Dashboard/Metrics**
<img width="1166" height="757" alt="image" src="https://github.com/user-attachments/assets/ee414293-7c52-44b3-bcb7-d3f00f383371" />

**Cyberpunk/Terminal**
<img width="1081" height="798" alt="image" src="https://github.com/user-attachments/assets/738d3344-decb-4bc3-8f55-9670ad9decdc" />

**Interactive 3D**
<img width="1091" height="812" alt="image" src="https://github.com/user-attachments/assets/e8b47563-cea5-4b04-97f9-4a51895b0f08" />

---

## Author
Kriti Ahlawat 
Submitted to: Mr Sourav Singh
