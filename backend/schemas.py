from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

class UserBase(BaseModel):
    email: str
    full_name: str
    role: Optional[str] = "Developer"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class FindingResponse(BaseModel):
    id: str
    line: int
    severity: str  # critical, high, medium, low
    type: str      # security, bug, quality, performance
    title: str
    snippet: str
    description: Optional[str] = ""
    suggestion: str
    before_code: Optional[str] = ""
    after_code: Optional[str] = ""
    status: Optional[str] = "open"

class AnalyzeRequest(BaseModel):
    code: str
    filename: Optional[str] = "snippet.py"
    language: Optional[str] = "python"

class AnalyzeResponse(BaseModel):
    score: int
    total_findings: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    findings: List[FindingResponse]
    ai_summary: str
    recommended_test_cases: List[str]

class RepoCreate(BaseModel):
    url: str
    name: Optional[str] = None

class RepoOut(BaseModel):
    id: str
    name: str
    fullName: str
    language: str
    stars: int
    score: int
    openIssues: int
    lastScan: str

    class Config:
        from_attributes = True

class FixApplyRequest(BaseModel):
    issue_id: str
    action: Optional[str] = "apply"  # apply or validate

class PullRequestReview(BaseModel):
    pr_id: str
    repo_name: str
    pr_number: int
    title: str
    author: str
    status: str
    score: int
    diff: str
    issues_found: int
    comments_posted: int

class PRReviewRequest(BaseModel):
    repo_id: str
    pr_number: int
    post_comment: Optional[bool] = True

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    email: str
    reset_token: str
    new_password: str
