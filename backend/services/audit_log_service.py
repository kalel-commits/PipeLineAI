from sqlalchemy.orm import Session
from models.audit_log import AuditLog
from datetime import datetime

def log_action(db: Session, user_id: int, action: str, ip_address: str = None, role: str = None, status: str = "success"):
    log = AuditLog(
        user_id=user_id,
        action=action,
        ip_address=ip_address,
        timestamp=datetime.utcnow(),
        role=role,
        status=status
    )
    db.add(log)
    db.commit()
