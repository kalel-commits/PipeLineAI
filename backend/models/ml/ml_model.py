from sqlalchemy import Column, Integer, String, DateTime, Float, Enum, ForeignKey, JSON, func, Boolean
from sqlalchemy.orm import relationship
from models.base import Base
import enum

class MLAlgorithm(str, enum.Enum):
    logistic_regression = "LogisticRegression"
    random_forest = "RandomForest"
    decision_tree = "DecisionTree"
    ensemble = "VotingEnsemble"

class MLModel(Base):
    __tablename__ = "ml_models"
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    algorithm = Column(Enum(MLAlgorithm), nullable=False)
    version = Column(String(32), nullable=False)
    metrics = Column(JSON, nullable=False)
    model_path = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    trained_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    dataset = relationship("Dataset")
    user = relationship("User")
