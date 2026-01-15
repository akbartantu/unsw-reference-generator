import requests
from fastapi import HTTPException

def fetch_journal_by_doi(doi: str):
    url = f"https://api.crossref.org/works/{doi}"

    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="DOI not found")

    data = response.json().get("message", {})

    # Build author list
    authors_list = []
    for a in data.get("author", []):
        family = a.get("family", "")
        given = a.get("given", "")
        initial = f"{given[0]}." if given else ""
        authors_list.append(f"{family} {initial}")

    return {
        "authors": authors_list,
        "year": data["issued"]["date-parts"][0][0],
        "article_title": data.get("title", [""])[0],
        "journal_title": data.get("container-title", [""])[0],
        "volume": data.get("volume"),
        "issue": data.get("issue"),
        "pages": data.get("page"),
        "doi": data.get("DOI")
    }
