from pydantic import BaseModel
from typing import List, Optional

class JournalArticle(BaseModel):
    authors: List[str]
    year: str
    article_title: str
    journal_title: str
    volume: str
    issue: str
    pages: str
    doi: Optional[str] = None