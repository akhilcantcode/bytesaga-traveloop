from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import auth, trips, stops, activities, expenses, notes, packing


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tables are managed by Alembic
    yield


app = FastAPI(title="Traveloop API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers with v1 prefix
app.include_router(auth.router, prefix="/api/v1")
app.include_router(trips.router, prefix="/api/v1")
app.include_router(stops.router, prefix="/api/v1")
app.include_router(activities.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")
app.include_router(notes.router, prefix="/api/v1")
app.include_router(packing.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
