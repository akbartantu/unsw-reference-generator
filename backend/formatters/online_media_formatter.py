def minimal_capitalisation(text):
    text = text.strip()
    if not text:
        return text
    text = text.lower()
    return text[0].upper() + text[1:]


def format_online_media(
    author, year, article_title, newspaper_title,
    publication_date, page_number=None,
    accessed_date=None, database_name=None, url=None
):

    # Article title minimal caps
    article_title = minimal_capitalisation(article_title)

    # Newspaper italic + max caps
    newspaper_title = f"<i>{newspaper_title.title()}</i>"

    # Optional fields
    page_str = f", {page_number}" if page_number else ""
    db_str = f" from {database_name}" if database_name else ""
    url_str = f", &lt;{url}&gt;" if url else ""

    # ===============================================
    # CASE 1: WITH AUTHOR
    # ===============================================
    if author not in (None, "", " "):
        # Format author → "Coorey, P"
        parts = author.split()
        surname = parts[-1]
        initials = ''.join([p[0].upper() + '.' for p in parts[:-1]])
        author_str = f"{surname}, {initials[:-1]}"

        # Remove year from publication_date IF user includes it
        # (User might enter "10 Aug 2014", but UNSW wants just "10 Aug")
        pub_parts = publication_date.split()
        if len(pub_parts) == 3:  # day, month, year
            publication_date = f"{pub_parts[0]} {pub_parts[1]}"  # remove year

        reference = (
            f"{author_str} {year}, "
            f"'{article_title}', "
            f"{newspaper_title}, "
            f"{publication_date}{page_str}, "
            f"accessed {accessed_date}{db_str}{url_str}."
        )
        return reference

    # ===============================================
    # CASE 2: NO AUTHOR
    # ===============================================

    # Publication date MUST contain the year here
    # So we trust the user's full date (e.g., "10 Aug 2014")

    reference = (
        f"'{article_title}', "
        f"{newspaper_title}, "
        f"{publication_date}{page_str}, "
        f"accessed {accessed_date}{db_str}{url_str}."
    )
    return reference

# def format_intext_media(author, newspaper_title, year):
#     """
#     UNSW Online Media In-text:
#     - With author: (Surname Year)
#     - No author: (NewspaperTitle Year)
#     """

#     if author:
#         surname = author.split()[-1]
#         return f"({surname} {year})"

#     # No author case — use newspaper title
#     return f"({newspaper_title} {year})"
