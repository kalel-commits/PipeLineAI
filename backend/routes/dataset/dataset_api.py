from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Request
from sqlalchemy.orm import Session
from db import SessionLocal
from utils.jwt_auth import require_role, decode_access_token
from services.dataset.dataset_service import allowed_file, save_file, validate_schema, create_dataset_record, preprocess_data
from services.audit_log_service import log_action
from models.dataset import Dataset, DatasetStatus
from models.user import User
import pandas as pd
import os

router = APIRouter(prefix="/datasets", tags=["datasets"])

UPLOAD_DIR = os.getenv("UPLOAD_FOLDER", "./db/uploads")
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", 10))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/list")
def list_datasets(
    token_data=Depends(require_role("Developer", "Analyst", "Admin")),
    db: Session = Depends(get_db)
):
    datasets = db.query(Dataset).filter(Dataset.user_id == token_data.user_id).all()
    return {"datasets": [
        {
            "id": d.id,
            "filename": d.filename,
            "record_count": d.record_count,
            "status": d.status,
            "upload_timestamp": str(d.upload_timestamp)
        }
        for d in datasets
    ]}


@router.post("/upload")
def upload_dataset(
    file: UploadFile = File(...),
    token_data=Depends(require_role("Developer", "Analyst", "Admin")),
    db: Session = Depends(get_db),
    request: Request = None
):
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Only CSV and JSON files are allowed.")
    try:
        filename = f"{token_data.user_id}_{file.filename}"
        file_path = save_file(file, UPLOAD_DIR, filename)
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_json(file_path)
    except Exception:
        log_action(db, token_data.user_id, "upload_failed", request.client.host if request else None, token_data.role, "failure")
        raise HTTPException(status_code=400, detail="Invalid or corrupted file.")
    valid, msg = validate_schema(df)
    if not valid:
        log_action(db, token_data.user_id, "upload_failed_schema", request.client.host if request else None, token_data.role, "failure")
        raise HTTPException(status_code=400, detail=msg)
    dataset = create_dataset_record(db, token_data.user_id, file.filename, file_path, len(df), DatasetStatus.validated)
    log_action(db, token_data.user_id, "upload_success", request.client.host if request else None, token_data.role, "success")
    return {"dataset_id": dataset.id, "record_count": dataset.record_count, "status": dataset.status}


@router.post("/preprocess/{dataset_id}")
def preprocess_dataset(
    dataset_id: int,
    token_data=Depends(require_role("Developer", "Analyst", "Admin")),
    db: Session = Depends(get_db),
    request: Request = None
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == token_data.user_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    try:
        if dataset.filename.lower().endswith(".csv"):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_json(dataset.file_path)
        cleaned_df = preprocess_data(df)
        cleaned_path = dataset.file_path + ".cleaned.csv"
        cleaned_df.to_csv(cleaned_path, index=False)
        dataset.file_path = cleaned_path
        dataset.status = DatasetStatus.processed
        dataset.record_count = len(cleaned_df)
        db.commit()
        log_action(db, token_data.user_id, f"preprocess_success:{dataset_id}", request.client.host if request else None, token_data.role, "success")
        return {"dataset_id": dataset.id, "record_count": dataset.record_count, "status": dataset.status}
    except Exception as e:
        log_action(db, token_data.user_id, f"preprocess_failed:{dataset_id}", request.client.host if request else None, token_data.role, "failure")
        raise HTTPException(status_code=400, detail=f"Preprocessing failed: {str(e)}")
