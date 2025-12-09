def format_intext_journal(authors, year):
    """
    UNSW In-text rules:
    - 1 author: (Surname Year)
    - 2 authors: (Surname1 & Surname2 Year)
    - 3 authors: (Surname1, Surname2 & Surname3 Year)
    - 4+ authors: (Surname1 et al. Year)
    """

    # Extract surname (always the first part)
    surnames = [a.split()[0].replace(",", "") for a in authors]

    count = len(surnames)

    if count == 1:
        return f"({surnames[0]} {year})"

    elif count == 2:
        return f"({surnames[0]} & {surnames[1]} {year})"

    elif count == 3:
        return f"({surnames[0]}, {surnames[1]} & {surnames[2]} {year})"

    else:
        # 4 or more authors
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

def format_intext_ai(company, year):
    # In-text citation only uses Company + Year
    return f"({company} {year})"