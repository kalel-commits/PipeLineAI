from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
from models.base import Base
import enum

class DatasetStatus(str, enum.Enum):
    uploaded = "uploaded"
    validated = "validated"
    processed = "processed"

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    upload_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    record_count = Column(Integer, default=0)
    status = Column(Enum(DatasetStatus), default=DatasetStatus.uploaded)
    user = relationship("User")
