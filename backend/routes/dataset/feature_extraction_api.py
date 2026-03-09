from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from db import SessionLocal
from utils.jwt_auth import require_role
from models.dataset import Dataset, DatasetStatus
from services.feature_extraction.feature_extraction_service import extract_and_save_features
from services.audit_log_service import log_action
import os

router = APIRouter(prefix="/datasets", tags=["feature-extraction"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{dataset_id}/extract-features")
def extract_features(
    dataset_id: int,
    token_data=Depends(require_role("Developer", "Analyst", "Admin")),
    db: Session = Depends(get_db),
    request: Request = None,
):
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id,
        Dataset.user_id == token_data.user_id,
    ).first()

    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    # Accept both validated and processed so user can re-run extraction
    if dataset.status not in (DatasetStatus.processed, DatasetStatus.validated):
        raise HTTPException(
            status_code=400,
            detail=f"Dataset status is '{dataset.status}'. Run preprocessing first.",
        )

    try:
        features_path = extract_and_save_features(
            db, dataset, token_data.user_id,
            request.client.host if request else None,
        )
        # ── CRITICAL: update file_path so train/evaluate can find the features ──
        dataset.file_path = features_path
        dataset.status = DatasetStatus.processed
        db.commit()

        log_action(
            db, token_data.user_id,
            f"features_extracted:{dataset_id}",
            request.client.host if request else None,
            token_data.role,
            "success",
        )
        return {
            "dataset_id": dataset.id,
            "features_path": features_path,
            "status": dataset.status,
        }

    except Exception as e:
        import traceback
        print("Feature extraction error:", traceback.format_exc())
        log_action(
            db, token_data.user_id,
            f"feature_extraction_failed:{dataset_id}",
            request.client.host if request else None,
            token_data.role,
            "failure",
        )
        raise HTTPException(status_code=400, detail=f"Feature extraction failed: {str(e)}")
