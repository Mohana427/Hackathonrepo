from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import allocation, booking, maintenance, auth
from app.models import stubs, allocation as alloc_model, booking as book_model, maintenance as maint_model
from app.models.user import User, UserRole
from app.routers.auth import hash_password

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AssetFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(allocation.router)
app.include_router(booking.router)
app.include_router(maintenance.router)


@app.on_event("startup")
def seed_users():
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            users = [
                User(name="Admin Manager", email="admin@assetflow.dev",
                     hashed_password=hash_password("admin123"), role=UserRole.ASSET_MANAGER),
                User(name="Dept Head", email="dept@assetflow.dev",
                     hashed_password=hash_password("dept123"), role=UserRole.DEPARTMENT_HEAD),
                User(name="John Employee", email="john@assetflow.dev",
                     hashed_password=hash_password("john123"), role=UserRole.EMPLOYEE),
                User(name="Jane Tech", email="jane@assetflow.dev",
                     hashed_password=hash_password("jane123"), role=UserRole.TECHNICIAN),
            ]
            db.add_all(users)
            db.commit()
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "AssetFlow API is running"}
