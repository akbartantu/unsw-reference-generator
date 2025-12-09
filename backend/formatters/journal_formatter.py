def minimal_capitalisation(text: str) -> str:
    """Convert title to minimal capitalisation."""
    text = text.strip()
    if not text:
        return text

    words = text.split()
    # First word capitalised, rest lowercase
    return " ".join([words[0].capitalize()] + [w.lower() for w in words[1:]])

def format_authors(authors):
    """
    Convert list like:
        ["Ullah I.", "Raza B.", "Malik A."]

    Into UNSW Harvard:
        "Ullah, I, Raza, B, Malik, A & Kim, S"
    """
    formatted = []

    for full in authors:
        parts = full.replace(".", "").split()

        if len(parts) == 1:
            # Only surname provided
            surname = parts[0]
            initial = ""
        else:
            surname = parts[0]
            initial = parts[1][0]  # First letter only

        formatted.append(f"{surname}, {initial}")

    # Join authors with commas, last author with "&"
    if len(formatted) > 1:
        return ", ".join(formatted[:-1]) + " & " + formatted[-1]
    else:
        return formatted[0]


def format_journal_article(authors, year, article_title, journal_title, volume, issue, pages, doi=None):
    """
    Create full UNSW Harvard journal reference.
    """

    # Format author list
    author_str = format_authors(authors)

    # Minimal caps for article title
    article_title = minimal_capitalisation(article_title)

    # Journal must be italic + max capitalisation
    journal_str = f"<i>{journal_title.title()}</i>"

    # Pages formatting (UNSW uses pp.)
    pages = pages.replace("–", "-").replace("—", "-")

    # Build reference
    reference = (
        f"{author_str} {year}, "
        f"'{article_title}', "
        f"{journal_str}, "
        f"vol. {volume}, "
        f"no. {issue}, "
        f"pp. {pages}"
    )

    if doi:
        reference += f", DOI:{doi}."

    else:
        reference += "."

    return reference