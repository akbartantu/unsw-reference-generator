from pydantic import BaseModel
from typing import Optional

class OnlineMediaArticle(BaseModel):
    author: Optional[str] = None
    year: str
    article_title: str
    newspaper_title: str
    publication_date: str       # e.g. "25 February" or "9 August 2013"
    page_number: Optional[str] = None
    accessed_date: str          # "25 January 2014"
    database_name: Optional[str] = None
    url: Optional[str] = None