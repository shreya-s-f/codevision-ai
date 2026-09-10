import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(100), default="Developer")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    repositories = relationship("Repository", back_populates="owner")

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    language = Column(String(100), default="Python")
    stars = Column(Integer, default=0)
    score = Column(Integer, default=85)
    open_issues = Column(Integer, default=0)
    last_scan = Column(String(100), default="Just now")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="repositories")
    findings = relationship("ReviewFinding", back_populates="repository", cascade="all, delete-orphan")

class ReviewFinding(Base):
    __tablename__ = "review_findings"

    id = Column(String(50), primary_key=True, index=True)
    repo_id = Column(String(50), ForeignKey("repositories.id"), nullable=True)
    title = Column(String(255), nullable=False)
    file = Column(String(255), nullable=False)
    line = Column(Integer, default=1)
    severity = Column(String(50), nullable=False)  # critical, high, medium, low
    type = Column(String(50), nullable=False)      # security, bug, quality, performance
    description = Column(Text, nullable=False)
    suggestion = Column(Text, nullable=False)
    before_code = Column(Text, default="")
    after_code = Column(Text, default="")
    status = Column(String(50), default="open")     # open, fixed, validated
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    repository = relationship("Repository", back_populates="findings")

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), default="Direct Snippet Scan")
    language = Column(String(50), default="Python")
    code = Column(Text, nullable=False)
    score = Column(Integer, default=100)
    findings_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
