# Traveloop

Traveloop is a modern, full-stack travel itinerary builder and budget tracker. It allows users to plan trips, organize stops and activities, manage a packing checklist, keep track of notes, and monitor trip expenses.

The application is split into two parts:
- **Backend**: FastAPI + SQLAlchemy (PostgreSQL)
- **Frontend**: Next.js 15 + Tailwind CSS + TanStack Query

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL** (Ensure the service is running and you have created a database for the project)

---

## 🛠️ Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**
   - **Windows:**
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory (if not already present) with the following content. Update the `DATABASE_URL` with your local PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@localhost/traveloop
   SECRET_KEY=your_super_secret_jwt_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

5. **Run Database Migrations**
   Initialize your database schema:
   ```bash
   alembic upgrade head
   ```

6. **Seed Demo Data (Optional)**
   Populate the database with a test user and a demo trip:
   ```bash
   python seed.py
   ```
   *Note: The demo user credentials are `demo@traveloop.com` / `demo1234`.*

7. **Start the Backend Server**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`. You can view the interactive API docs at `http://127.0.0.1:8000/docs`.

---

## 💻 Frontend Setup

1. **Navigate to the frontend directory**
   Open a **new** terminal window and run:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the `frontend` directory with the API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## Collaboration Workflow
- Ensure you have the backend API running simultaneously with the frontend development server.
- The `PLANNING.md` at the root contains the data models and MVP feature list.
- Use the `.agents` folder for reference on coding conventions for this specific project.

### Pulling Latest Database Changes

When new database columns (like the `is_admin` flag) or tables are added by other collaborators, your friends will need to update their local databases. Have them run:

```bash
git pull origin main
cd backend
# Make sure virtual environment is activated
alembic upgrade head
# Seed the city database (only needed once)
python seed_cities.py
```

If they want the `demo@traveloop.com` user to have admin privileges locally, they can just re-run the seed script:
```bash
python seed.py
```
