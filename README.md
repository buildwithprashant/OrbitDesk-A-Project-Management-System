# OrbitDesk - Team Task Manager

A production-ready full-stack team task manager built with React, Vite, Tailwind CSS, Express, MongoDB, Mongoose, JWT authentication, bcrypt password hashing, Zod validation, and role-based access control.

## Features

- JWT signup/login with persistent localStorage sessions
- Three roles: User, Manager, and Admin
- Admin full control, user deactivation, destructive deletes, workspace analytics
- Manager project/task creation, editing, assignment, team member management, and analytics
- User assigned project/task visibility, task status updates, and comments
- MongoDB relationships for users, projects, tasks, comments, and task activity
- Dashboard metrics for total projects, tasks, completed tasks, overdue tasks, progress chart, and recent activity
- Responsive premium SaaS UI with sidebar, mobile navigation, skeleton loaders, toasts, empty states, modals, badges, and animated route transitions
- Secure Express defaults: Helmet, CORS, rate limiting, Mongo sanitization, centralized errors, async handlers, validation middleware

## Folder Structure

```txt
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   |-- utils
|   |   `-- validators
|   |-- .env.example
|   `-- package.json
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- context
|   |   |-- hooks
|   |   |-- pages
|   |   |-- routes
|   |   `-- utils
|   |-- .env.example
|   `-- package.json
`-- package.json
```

## API Routes

Authentication:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

Users:

- `GET /api/users`
- `PATCH /api/users/me`
- `DELETE /api/users/:id` admin only

Projects:

- `GET /api/projects`
- `POST /api/projects` manager/admin only
- `GET /api/projects/:id`
- `PATCH /api/projects/:id` manager/admin only
- `DELETE /api/projects/:id` admin only
- `PATCH /api/projects/:id/members` manager/admin only
- `DELETE /api/projects/:id/members/:userId` manager/admin only
- `GET /api/projects/analytics/summary`

Tasks:

- `GET /api/tasks`
- `POST /api/tasks` manager/admin only
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id` manager/admin only
- `DELETE /api/tasks/:id` admin only
- `PATCH /api/tasks/:id/status`

Comments:

- `POST /api/comments`
- `DELETE /api/comments/:id`

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create backend env:

```bash
cp backend/.env.example backend/.env
```

3. Create frontend env:

```bash
cp frontend/.env.example frontend/.env
```

4. Update `backend/.env` with your MongoDB connection string and JWT secret.

5. Run both apps:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:5001` in this local setup.

## Deployment

MongoDB Atlas:

- Create a free Atlas cluster.
- Add a database user.
- Allow your backend host IP or `0.0.0.0/0` for assessment/demo deployments.
- Copy the connection URI into `MONGO_URI`.

Backend on Render or Railway:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `NODE_ENV=production`, `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`

Frontend on Vercel or Netlify:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend-domain.com/api`

## Assessment Notes

Create accounts as `admin`, `manager`, and `user` from the signup page to test all RBAC flows. Managers can create and assign work, admins can also delete work and deactivate users, and users can update assigned tasks and comment.
