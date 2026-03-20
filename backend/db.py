from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Resolve DB path local to the backend directory
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_DB_PATH = os.path.join(_BASE_DIR, "db")
os.makedirs(_DB_PATH, exist_ok=True)
_DEFAULT_DB = os.path.join(_DB_PATH, "dev.db").replace("\\", "/")

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{_DEFAULT_DB}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
