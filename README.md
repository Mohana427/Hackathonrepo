# Hackathonrepo

## Project Overview
AssetFlow is a demo asset management system with three core workflows:
- **Allocation / Transfer** – assign assets to users or departments, with conflict detection to prevent double‑allocation.
- **Booking** – reserve assets for a time window. Overlap logic ensures back‑to‑back bookings are allowed but overlapping periods are rejected.
- **Maintenance** – request and approve maintenance, automatically toggling the asset status between `AVAILABLE` and `UNDER_MAINTENANCE`.

## Current Status
- **Backend** – Fully implemented with FastAPI. Includes JWT authentication, role-based access control, and SQLite database.
- **Frontend** – Fully implemented with React + TypeScript + Tailwind CSS. Integrated with real API via axios.
- **Integration** – Frontend communicates with backend via REST API with JWT token authentication.

## Running the Project

> **NOTE**: Requires Python 3.11+. Python 3.14 works with pydantic >= 2.13.

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd Hackathonrepo
   ```
2. **Setup backend**
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

3. **Setup frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Login**
   Use the demo accounts on the login page:
   - Admin: `admin@assetflow.dev` / `admin123`
   - Dept Head: `dept@assetflow.dev` / `dept123`
   - Employee: `john@assetflow.dev` / `john123`
   - Technician: `jane@assetflow.dev` / `jane123`

## API Endpoints

### Auth
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and receive JWT token
- `GET /auth/me` – Get current user info

### Allocations
- `POST /allocations` – Create allocation
- `POST /allocations/transfer-requests` – Create transfer request
- `PATCH /allocations/transfer-requests/{id}/approve` – Approve transfer
- `PATCH /allocations/{id}/return` – Return allocated asset
- `GET /allocations/overdue` – Get overdue allocations
- `GET /allocations/assets/{asset_id}/allocation-history` – Get allocation history
- `GET /allocations/transfer-requests` – List pending transfer requests

### Bookings
- `POST /bookings` – Create booking
- `GET /bookings?asset_id={id}` – List bookings for asset
- `PATCH /bookings/{id}/cancel` – Cancel booking

### Maintenance
- `POST /maintenance-requests` – Create maintenance request
- `PATCH /maintenance-requests/{id}/approve` – Approve request
- `PATCH /maintenance-requests/{id}/reject` – Reject request
- `PATCH /maintenance-requests/{id}/assign-technician` – Assign technician
- `PATCH /maintenance-requests/{id}/resolve` – Mark resolved
- `GET /maintenance-requests/assets/{asset_id}/maintenance-history` – Get history

## Development
- Run backend tests: `pytest` from the `backend` directory.
- UI components use Tailwind CSS.

## Contributing
- Follow the existing folder structure: modify only files under `backend/app/models/`, `backend/app/routers/`, `backend/app/schemas/` and the corresponding frontend `src/features/*` directories.
- Do **not** change authentication, asset registration, or dashboard code unless explicitly requested.
