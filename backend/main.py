from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import Vehicle, Driver
from schemas import VehicleCreate, DriverCreate, VehicleAssign

app = FastAPI(
    title="Fleet Management API",
    version="1.0"
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Fleet Management API is running!"}

@app.put("/vehicles/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    vehicle: VehicleCreate,
    db: Session = Depends(get_db)
):
    old_vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if old_vehicle is None:
     raise HTTPException(
        status_code=404,
        detail="Vehicle not found"
    )

    old_vehicle.vehicle_number = vehicle.vehicle_number
    old_vehicle.model = vehicle.model
    old_vehicle.vehicle_type = vehicle.vehicle_type
    old_vehicle.status = vehicle.status

    db.commit()
    db.refresh(old_vehicle)

    return old_vehicle

@app.get("/vehicles")
def get_vehicles(db: Session = Depends(get_db)):
    vehicles = db.query(Vehicle).all()

    result = []

    for vehicle in vehicles:
        result.append({
            "id": vehicle.id,
            "vehicle_number": vehicle.vehicle_number,
            "model": vehicle.model,
            "vehicle_type": vehicle.vehicle_type,
            "status": vehicle.status,
            "driver": vehicle.driver.name if vehicle.driver else None
        })

    return result




@app.post("/vehicles")
def add_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):

    new_vehicle = Vehicle(**vehicle.model_dump())

    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)

    return new_vehicle

@app.get("/drivers")
def get_drivers(db: Session = Depends(get_db)):
    drivers = db.query(Driver).all()

    result = []

    for driver in drivers:
        result.append({
            "id": driver.id,
            "name": driver.name,
            "phone": driver.phone,
            "license_number": driver.license_number,
            "status": driver.status,
            "vehicles": [
                vehicle.vehicle_number
                for vehicle in driver.vehicles
            ]
        })

    return result


@app.put("/drivers/{driver_id}")
def update_driver(
    driver_id: int,
    driver: DriverCreate,
    db: Session = Depends(get_db)
):
    existing_driver = db.query(Driver).filter(
        Driver.id == driver_id
    ).first()

    if existing_driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    existing_driver.name = driver.name
    existing_driver.phone = driver.phone
    existing_driver.license_number = driver.license_number
    existing_driver.status = driver.status

    db.commit()
    db.refresh(existing_driver)

    return existing_driver

@app.delete("/vehicles/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    db.delete(vehicle)
    db.commit()

    return {"message": "Vehicle deleted successfully"}
@app.post("/drivers")
def create_driver(driver: DriverCreate, db: Session = Depends(get_db)):
    new_driver = Driver(**driver.model_dump())

    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)

    return new_driver

@app.delete("/drivers/{driver_id}")
def delete_driver(driver_id: int, db: Session = Depends(get_db)):
    driver = db.query(Driver).filter(
        Driver.id == driver_id
    ).first()

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    db.delete(driver)
    db.commit()

    return {"message": "Driver deleted successfully"}

@app.put("/vehicles/{vehicle_id}/assign")
def assign_driver(
    vehicle_id: int,
    assignment: VehicleAssign,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    driver = db.query(Driver).filter(
        Driver.id == assignment.driver_id
    ).first()

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    vehicle.driver_id = assignment.driver_id

    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Driver assigned successfully",
        "vehicle_id": vehicle.id,
        "driver_id": vehicle.driver_id
    }