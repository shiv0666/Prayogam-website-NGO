# Prayogam Foundation Website (MERN)

Professional MERN website template for Prayogam Foundation with a public-facing NGO website, secure admin panel, and deployable API.

## Core Features
- Branded public website: Home, About, Mission, Programs, Contact
- Responsive and polished UI with consistent design system
- Admin dashboard with JWT authentication and role checks
- Content management for programs, announcements, events, and pages
- Contact form persistence in MongoDB
- Production-aware backend security defaults (Helmet, CORS allow-list, proxy support)

## Tech Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT

## Prerequisites
- Node.js 18+
- MongoDB Atlas or self-hosted MongoDB

## Local Development
1. Install dependencies
   - Root: `npm install`
   - Server: `npm --prefix server install`
   - Client: `npm --prefix client install`

2. Configure environment variables
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`

3. Seed admin and starter content
   - `npm --prefix server run seed`
   - Optional: `npm --prefix server run seed:content`
   - Optional: `npm --prefix server run seed:events`

4. Run the app
   - Both services from root: `npm run dev`
   - Or separately:
     - API: `npm --prefix server run dev`
     - Web: `npm --prefix client run dev`

## Environment Variables

### Server (`server/.env`)
- `NODE_ENV` (development/production)
- `PORT` (example: 5000)
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (example: 7d)
- `CORS_ORIGIN` (comma-separated origins)
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`

### Client (`client/.env`)
- `VITE_API_URL` (example: `http://localhost:5000/api`)

## AWS Deployment (Recommended)

### Option A: Frontend on S3 + CloudFront, API on EC2
1. Build frontend: `npm --prefix client run build`
2. Upload `client/dist` to S3 bucket configured for static hosting
3. Put CloudFront in front of S3 and attach your domain (SSL via ACM)
4. Deploy API to EC2 (or Elastic Beanstalk) and run `npm --prefix server start`
5. Set `VITE_API_URL` to your API domain, then rebuild frontend
6. Set `CORS_ORIGIN` to include your CloudFront/custom frontend URL

### Option B: Frontend on AWS Amplify, API on EC2/Beanstalk
1. Connect repository to Amplify and set build command `npm --prefix client run build`
2. Set publish directory to `client/dist`
3. Deploy API separately (EC2/Beanstalk)
4. Configure Amplify environment variable `VITE_API_URL`
5. Configure API `CORS_ORIGIN` with your Amplify domain and custom domain

## Production Run Commands
- Build frontend: `npm --prefix client run build`
- Start API: `npm --prefix server start`

## Admin Login
- URL: `/admin/login`
- Use seeded credentials from `server/.env`

## Operational Notes
- Keep secrets only in server environment variables
- Use HTTPS for frontend and API in production
- Back up MongoDB regularly and restrict DB network access
