<p align="center">
  <img src="./logo.png" alt="Last Minute Learner Logo" width="169" />
</p>

<h1 align="center">
  <a href="https://last-minute-learner.vercel.app/" target="_blank">Last Minute Learner</a>
</h1>

A study companion web app that turns uploaded documents and topic prompts into AI-generated learning materials, including reviewers, flashcards, and quizzes.

## Project Information
- Final Project for: Application Development
- Developed By: Abainza, Francis Rafael A., Barruga, Jucel P., and Buenaflor, Alexa Jane V.
- Course & Section: BSIT 3-2
- Submitted To: Prof. Florence Sangrenes

## How It Works
1. Upload Content – Upload a PDF, Word document, or PowerPoint presentation, or simply enter a topic using text or voice input.
2. AI Analysis – The AI analyzes and understands the provided content or topic.
3. Automatic Reviewer Generation – The system automatically generates study materials, including reviewers, flashcards, and quizzes.

## AI Voice Assistant
- Users can create, open, and delete reviewers using voice commands, providing a hands-free and more convenient study experience.
## Features

- User authentication with Clerk in the Next.js frontend
- Upload or describe study content to generate learning resources
- Store and manage generated reviewers, flashcards, and quizzes per user
- Backend API built with Flask + SQLAlchemy
- PostgreSQL-compatible database support via `DATABASE_URL`
- CORS-enabled server-to-server auth with a shared secret

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Auth: Clerk for user sign-in and session handling
- Backend: Flask, Flask-SQLAlchemy, Flask-CORS
- Database: PostgreSQL-compatible database (Neon or any supported provider)
- Deployment: `gunicorn` + Flask backend

## Repository Structure

- `frontend/` - Next.js app and UI components
- `backend/` - Flask API, models, and request handling

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+ (or compatible)
- PostgreSQL-compatible database
- Clerk application with frontend integration configured

### Environment Variables

#### Backend (`backend/.env`)

Create a `.env` file in `backend/` with:

```env
DATABASE_URL=<your-database-url>
INTERNAL_SERVICE_SECRET=<shared-service-secret>
```

- `DATABASE_URL`: PostgreSQL connection string for SQLAlchemy.
- `INTERNAL_SERVICE_SECRET`: shared secret used for server-to-server auth between the frontend and backend.

#### Frontend

Create a `.env.local` file in `frontend/` with the values your app needs. The current app source expects at least:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
AI_GATEWAY_API_KEY=<your-ai-gateway-api-key>
FLASK_API_URL=http://localhost:5000
INTERNAL_SERVICE_SECRET=<shared-service-secret>
```

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key used in the frontend.
- `CLERK_SECRET_KEY`: Clerk secret key for server-side Clerk API calls or backend routes.
- `AI_GATEWAY_API_KEY`: API key for the AI gateway or provider used by your app.
- `FLASK_API_URL`: URL of the Flask backend service.
- `INTERNAL_SERVICE_SECRET`: shared secret used by the frontend when calling the backend.

Also configure any additional Clerk values required by your Clerk project and the frontend deployment.

## Run Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend starts on `http://127.0.0.1:5000` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:3000`.

## API Endpoints

The backend exposes authenticated routes under `/reviewers`:

- `POST /reviewers` - create a new reviewer
- `GET /reviewers` - list reviewers for the authenticated user
- `GET /reviewers/:id` - get a single reviewer
- `DELETE /reviewers/:id` - delete a reviewer

### Required request headers

- `X-Service-Secret`: shared internal secret
- `X-User-Id`: authenticated user ID from Clerk

## Production

A `Procfile` is included for deployment environments that support `gunicorn`. Example entry:

```procfile
web: gunicorn app:app
```

Make sure your production environment provides the required environment variables and a PostgreSQL-compatible database.

## Notes

- The backend creates database tables automatically on startup.
- This project assumes Clerk handles user authentication in the frontend and forwards the authenticated user ID to the backend.
- Adjust CORS and service auth settings for your deployment environment.
