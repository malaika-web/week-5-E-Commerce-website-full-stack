# NovaCart MERN E-Commerce

A full-stack MERN e-commerce project built from a Stitch frontend UI design.

## Structure
- `backend/` — Express API, MongoDB connection, routes, models, auth
- `frontend/` — React + Vite frontend with Tailwind CSS using the provided NovaCart UI

## Setup
1. Install backend dependencies:
   ```powershell
   cd "d:\e - commerce\backend"
   npm install
   ```
2. Install frontend dependencies:
   ```powershell
   cd "d:\e - commerce\frontend"
   npm install
   ```
3. Copy `.env.example` to `.env` in `backend/` and configure values, including `STRIPE_SECRET_KEY`.
4. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.
5. Seed sample data (optional):
   ```powershell
   cd "d:\e - commerce\backend"
   npm run seed
   ```
6. Start backend and frontend together from the project root:
   ```powershell
   cd "d:\e - commerce"
   npm run dev
   ```

   Or start them separately:
   ```powershell
   cd "d:\e - commerce\backend"
   npm run dev
   ```
   ```powershell
   cd "d:\e - commerce\frontend"
   npm run dev
   ```

## API Endpoints
See `backend/README.md` for full endpoint descriptions.
