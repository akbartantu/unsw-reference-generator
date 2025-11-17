def minimal_capitalisation(title):
    title = title.strip()
    if not title:
        return title
    
    title = title.lower()
    return title[0].upper() + title[1:]

def format_journal_article(
    authors, year, article_title, journal_title,
    volume, issue, pages, doi=None
):
    # Format authors
    formatted_authors = []
    for author in authors:
        parts = author.split()
        surname = parts[-1]
        initials = ''.join([p[0].upper() + '.' for p in parts[:-1]])
        formatted_authors.append(f"{surname}, {initials[:-1]}")

    if len(formatted_authors) > 1:
        authors_str = ', '.join(formatted_authors[:-1]) + " & " + formatted_authors[-1]
    else:
        authors_str = formatted_authors[0]

    # Minimal capitalisation
    article_title = minimal_capitalisation(article_title)

    # Maximum Capitalisation + italic for journal title
    journal_title = f"<i>{journal_title.title()}</i>"

    reference = (
        f"{authors_str} {year}, "
        f"'{article_title}', "
        f"{journal_title}, "
        f"vol. {volume}, "
        f"no. {issue}, "
        f"pp. {pages}"
    )

    if doi:
        reference += f", DOI:{doi}"

    reference += "."

    return reference