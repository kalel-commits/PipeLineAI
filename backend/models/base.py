from sqlalchemy.ext.declarative import declarative_base

# Single shared Base for all models — prevents NoReferencedTableError on ForeignKeys
Base = declarative_base()
