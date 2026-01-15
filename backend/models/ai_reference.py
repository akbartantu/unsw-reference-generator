from pydantic import BaseModel

class AIReference(BaseModel):
    company: str
    year: str
    product_name: str
    model_type: str
    retrieved_date: str
    url: str