from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.models.journal import JournalArticle
from backend.models.online_media import OnlineMediaArticle
from backend.models.ai_reference import AIReference

from backend.formatters.journal_formatter import format_journal_article
from backend.formatters.online_media_formatter import format_online_media
from backend.formatters.ai_formatter import format_ai_reference

from backend.formatters.intext_formatter import (
    format_intext_journal,
    format_intext_media,
    format_intext_ai
)

from backend.services.fetch_journal import fetch_journal_by_doi

app = FastAPI()

# Allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate/journal")
def generate_journal(data: JournalArticle):
    reference = format_journal_article(
        authors=data.authors,
        year=data.year,
        article_title=data.article_title,
        journal_title=data.journal_title,
        volume=data.volume,
        issue=data.issue,
        pages=data.pages,
        doi=data.doi
    )
    intext = format_intext_journal(data.authors, data.year)
    return {"reference": reference, "intext": intext}

@app.post("/generate/online-media")
def generate_online_media(data: OnlineMediaArticle):
    print("RECEIVED URL:", data.url)     # <-- add this for debugging
    reference = format_online_media(
        author=data.author,
        year=data.year,
        article_title=data.article_title,
        newspaper_title=data.newspaper_title,
        publication_date=data.publication_date,
        page_number=data.page_number,
        accessed_date=data.accessed_date,
        database_name=data.database_name,
        url=data.url,
    )
    intext = format_intext_media(data.author, data.newspaper_title, data.year)
    return {"reference": reference, "intext": intext}

@app.post("/generate/ai")
def generate_ai(ref: AIReference):
    reference = format_ai_reference(
        ref.company,
        ref.year,
        ref.product_name,
        ref.model_type,
        ref.retrieved_date,
        ref.url
    )
    intext = format_intext_ai(ref.company, ref.year)
    return {"reference": reference, "intext": intext}

@app.get("/fetch/journal")
def fetch_journal(doi: str):
    return fetch_journal_by_doi(doi)
