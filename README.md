# Bus Transit App

A full-stack bus transit system with real-time tracking, route planning, and AI-powered chatbot assistance.

## Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL (with JSON file storage fallback)
- JWT Authentication
- Google Places API integration

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aksh56511/bus.git
cd bus
```

2. Install all dependencies (root + frontend):
```bash
npm run install:all
```

### Running the Project

Start both backend and frontend with a single command:
```bash
npm run dev
```

This will start:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:5173

### Alternative: Run Separately

**Backend only:**
```bash
npm run backend
```

**Frontend only:**
```bash
npm run frontend
```

## Features

- 🚌 Real-time bus tracking
- 🗺️ Route planning and trip optimization
- 🏨 Find nearby places (lodges, hospitals, ATMs, restaurants)
- 🤖 AI travel assistant chatbot
- 🔐 User authentication
- 📱 Responsive design

## API Endpoints

- `GET /health` - Health check
- `GET /api/db-check` - Database connection status
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/buses` - List all buses
- `GET /api/trips` - List all trips
- `GET /api/places/nearby` - Search nearby places
- `GET /api/places/search` - General place search
- `POST /api/chatbot/query` - Chatbot queries

## Environment Variables

Create `backend/config/keys.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=transit
JWT_SECRET=your_secret_key
GOOGLE_API_KEY=your_google_api_key
```

## Project Structure

```
bus/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── data/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── main.tsx
│   └── package.json
└── package.json
```

## License

MIT