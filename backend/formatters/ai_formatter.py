def format_ai_reference(company, year, product_name, model_type, retrieved_date, url):
    product_italic = f"<i>{product_name}</i>"

    reference = (
        f"{company}. {year}, {product_italic}, "
        f"[{model_type}], Retrieved {retrieved_date}, from {url}."
    )

    return reference
