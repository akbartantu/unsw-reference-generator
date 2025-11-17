📚 UNSW Reference Generator — Project Documentation

A lightweight, web-based citation generator built with FastAPI and vanilla JavaScript.

🧩 Overview

The UNSW Reference Generator is a simple, fast, and accessible web tool designed to help students generate citations automatically using the official UNSW Harvard Referencing Style.

It requires:

No login

No account

Works directly in the browser

Runs on a lightweight Python backend

The tool currently supports:

✔ Journal Articles (Print)
✔ Online Media Articles

More reference types will be added (Books, Websites, Reports, etc.).

This project is perfect for students who need quick, accurate referencing without having to manually format citations.

🎯 Project Goals

Provide a free and simple UNSW-compliant citation generator

Keep all processing local — no login, no tracking (unless optional analytics added later)

Maintain clean separation between frontend and backend

Keep the codebase simple and beginner-friendly

Make referencing faster for real student workflows

🏗 Architecture

The app uses a minimal but structured architecture:
project/
│
├── backend/
│   ├── main.py                # FastAPI app + endpoints
│   ├── models/                # Pydantic models (input validation)
│   │   ├── journal.py
│   │   ├── online_media.py
│   └── formatters/            # All UNSW formatting logic
│       ├── journal_formatter.py
│       ├── online_media_formatter.py
│
├── frontend/
│   ├── index.html             # UI with tabs (Journal / Online Media)
│   ├── styles.css             # Basic styling
│   └── app.js                 # Fetch calls, tab logic, copy button
│
└── README.md (you are here)

⚙️ Tech Stack
Backend

Python 3

FastAPI (API endpoints)

Pydantic (data validation)

Uvicorn (ASGI server)

Frontend

HTML5

CSS (vanilla)

JavaScript (vanilla)

Why this stack?

FastAPI is extremely fast and perfect for lightweight tools

No framework required on frontend

Easy to deploy on Render / Railway later

🚀 Getting Started
1. Clone the Repository
git clone (https://github.com/bartan29/unsw-reference-generator.git)
cd unsw-reference-generator

2. Create Virtual Environment
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

3. Install Dependencies
pip install fastapi uvicorn
(If you use more libs, add them here.)

4. Run Backend
uvicorn backend.main:app --reload

Server runs on:

👉 http://127.0.0.1:8000

API docs (Swagger UI):

👉 http://127.0.0.1:8000/docs

5. Open Frontend
Just open:
frontend/index.html

(or run VS Code Live Server)

📌 Features
🔹 1. Journal Article (Print) — UNSW Format

Generates references like:
Kozulin, A 1993, 'Literature as a psychological tool', Educational Psychologist, vol. 28, no. 3, pp. 253–265, DOI:10.1207/s15326985ep2803_5.

🔹 2. Online Media Article — UNSW Format

Supports both author / no-author cases:

With author:
Coorey, P 2014, ‘Baby tapir wins hearts at zoo’, Irish Independent, 10 Aug, accessed 14 May 2012, <https://www.independent.ie/world-news/baby-tapir-wins-hearts-at-zoo/30495570.html>.

No author:
‘Baby tapir wins hearts at zoo’, Irish Independent, 10 Aug 2014, accessed 14 May 2012, <https://www.independent.ie/world-news/baby-tapir-wins-hearts-at-zoo/30495570.html>.

Includes rules for:

Handling missing author

Formatting page numbers

Trimming or keeping publication year

Escaped angle brackets for valid HTML rendering

🧠 Main Logic — How Formatting Works

Each reference type has an isolated formatter module:

Example:
backend/formatters/online_media_formatter.py

Responsibilities:

Clean and normalise input

Apply UNSW style rules

Decide which fields are optional

Distinguish author vs no-author logic

Escape HTML symbols

Return citation as a single formatted string

This makes the system easy to expand later.

🎨 Frontend Design
Components:

Tabs (Journal / Online Media)

Form fields

“Generate Reference” button

Output preview

Copy-to-clipboard button

Key features:

✔ No backend rendering — JS handles it
✔ Clean separation between form & output
✔ innerHTML is used to support italics
✔ Copy button strips HTML before copying

📦 Upcoming Features

Planned expansions:

Books (Print)

Websites

Reports

Thesis

Journal Article (Online)

Storage of reference history

Export to DOCX / PDF

Deploy to the web

🤝 Contributing

Future contributors can easily add a reference type by:

Creating a new Pydantic model

Adding a new formatter module

Creating a new API endpoint

Adding frontend form fields

Adding a tab for the new type

Simple and scalable.

📜 License

MIT License — free to use, modify, distribute.

✨ Author

Muhammad Akbar — UNSW Master of Commerce (Business Analytics & Cyber Security)

Building tools to make student life easier.