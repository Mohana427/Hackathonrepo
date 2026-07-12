from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import allocation, booking, maintenance, auth, asset
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
app.include_router(asset.router)
app.include_router(allocation.router)
app.include_router(booking.router)
app.include_router(maintenance.router)


@app.on_event("startup")
def seed_data():
    from app.database import SessionLocal
    from app.models.stubs import Asset, AssetStatus, AssetCondition, Employee, Department
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

        if db.query(Employee).count() == 0:
            employees = [
                Employee(name="John Doe"),
                Employee(name="Jane Smith"),
                Employee(name="Bob Wilson"),
            ]
            db.add_all(employees)
            db.commit()

        if db.query(Department).count() == 0:
            departments = [
                Department(name="Engineering"),
                Department(name="Marketing"),
                Department(name="HR"),
            ]
            db.add_all(departments)
            db.commit()

        if db.query(Asset).count() == 0:
            assets = [
                Asset(name="MacBook Pro 16\"", tag="AF-0001", category="Electronics",
                      serial_number="SN-1001", location="HQ-01", condition=AssetCondition.GOOD,
                      is_bookable=False, status=AssetStatus.AVAILABLE, acquisition_cost=2499.00),
                Asset(name="Dell Monitor 27\"", tag="AF-0002", category="Electronics",
                      serial_number="SN-1002", location="HQ-02", condition=AssetCondition.NEW,
                      is_bookable=True, status=AssetStatus.AVAILABLE, acquisition_cost=450.00),
                Asset(name="Conference Room Projector", tag="AF-0003", category="AV",
                      serial_number="SN-1003", location="Room A", condition=AssetCondition.FAIR,
                      is_bookable=True, status=AssetStatus.ALLOCATED, acquisition_cost=1200.00),
                Asset(name="Standing Desk", tag="AF-0004", category="Furniture",
                      serial_number="SN-1004", location="HQ-03", condition=AssetCondition.GOOD,
                      is_bookable=False, status=AssetStatus.AVAILABLE, acquisition_cost=600.00),
                Asset(name="Wireless Mouse", tag="AF-0005", category="Electronics",
                      serial_number="SN-1005", location="Storage A", condition=AssetCondition.GOOD,
                      is_bookable=True, status=AssetStatus.UNDER_MAINTENANCE, acquisition_cost=79.00),
            ]
            db.add_all(assets)
            db.commit()
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "AssetFlow API is running"}
