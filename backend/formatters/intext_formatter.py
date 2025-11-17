def format_intext_journal(authors, year):
    """
    UNSW In-text rules:
    - 1 author: (Surname Year)
    - 2 authors: (Surname1 & Surname2 Year)
    - 3 authors: (Surname1, Surname2 & Surname3 Year)
    - 4+ authors: (Surname1 et al. Year)
    """

    # Convert input authors into clean list
    clean_authors = [a.strip() for a in authors if a.strip()]
    
    surnames = [name.split()[-1] for name in clean_authors]
    author_count = len(surnames)

    if author_count == 0:
        return f"({year})"

    if author_count == 1:
        return f"({surnames[0]} {year})"

    if author_count == 2:
        return f"({surnames[0]} & {surnames[1]} {year})"

    if author_count == 3:
        return f"({surnames[0]}, {surnames[1]} & {surnames[2]} {year})"

    # 4+ authors
    return f"({surnames[0]} et al. {year})"

def format_intext_media(author, newspaper_title, year):
    """
    UNSW Online Media In-text:
    - With author: (Surname Year)
    - No author: (NewspaperTitle Year)
    """

    if author:
        surname = author.split()[-1]
        return f"({surname} {year})"

    # No author case — use newspaper title
    return f"({newspaper_title} {year})"
