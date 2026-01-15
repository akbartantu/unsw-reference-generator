// =========================
// API BASE URL (Render URL)
// =========================
const API_BASE = "https://unsw-reference-generator.onrender.com";
// const API_BASE = "http://127.0.0.1:8000";

function showLoading() {
    document.getElementById("spinner").classList.remove("hidden");
}

function hideLoading() {
    document.getElementById("spinner").classList.add("hidden");
}

// =========================
// TAB SWITCHING
// =========================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

// =========================
// GENERATE JOURNAL
// =========================
document.getElementById("generateBtn").addEventListener("click", async () => {
    showLoading();

    try {
        const payload = {
            authors: document.getElementById("authors").value.split(",").map(a => a.trim()),
            year: document.getElementById("year").value,
            article_title: document.getElementById("article_title").value,
            journal_title: document.getElementById("journal_title").value,
            volume: document.getElementById("volume").value,
            issue: document.getElementById("issue").value,
            pages: document.getElementById("pages").value,
            doi: document.getElementById("doi").value
        };

        const response = await fetch(`${API_BASE}/generate/journal`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        document.getElementById("output").innerHTML = data.reference;
        document.getElementById("intext").innerHTML = data.intext;

    } catch (error) {
        alert("Failed to generate journal reference.");
    } finally {
        hideLoading();
    }
});

// =========================
// GENERATE ONLINE MEDIA
// =========================
document.getElementById("generateOnline").addEventListener("click", async () => {
    showLoading();

    try {
        const payload = {
            author: document.getElementById("o_author").value.trim() || null,
            year: document.getElementById("o_year").value,
            article_title: document.getElementById("o_article_title").value,
            newspaper_title: document.getElementById("o_newspaper").value,
            publication_date: document.getElementById("o_pub_date").value,
            page_number: document.getElementById("o_page").value || null,
            accessed_date: document.getElementById("o_accessed").value,
            database_name: document.getElementById("o_database").value || null,
            url: document.getElementById("o_url").value.trim() || null
        };

        const response = await fetch(`${API_BASE}/generate/online-media`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        document.getElementById("output").innerHTML = data.reference;
        document.getElementById("intext").innerHTML = data.intext;

    } catch (err) {
        alert("Failed to generate online media reference.");
    } finally {
        hideLoading();
    }
});

// =========================
// GENERATE AI REFERENCE
// =========================
document.getElementById("generateAI").addEventListener("click", async () => {
    showLoading();

    try {
        const payload = {
            company: document.getElementById("ai_company").value,
            year: document.getElementById("ai_year").value,
            product_name: document.getElementById("ai_product").value,
            model_type: document.getElementById("ai_model").value,
            retrieved_date: document.getElementById("ai_retrieved").value,
            url: document.getElementById("ai_url").value
        };

        const response = await fetch(`${API_BASE}/generate/ai`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        document.getElementById("output").innerHTML = data.reference;
        document.getElementById("intext").innerHTML = data.intext;

    } catch (error) {
        alert("Failed to generate AI reference.");
    } finally {
        hideLoading();
    }
});

// =========================
// COPY BUTTON
// =========================
document.getElementById("copyBtn").addEventListener("click", () => {
    const html = document.getElementById("output").innerHTML;

    // Remove ALL HTML tags (e.g. <i>)
    const cleanText = html.replace(/<[^>]*>/g, "");

    navigator.clipboard.writeText(cleanText)
        .then(() => {
            alert("Reference copied!");
        })
        .catch(err => {
            console.error("Copy failed:", err);
        });
});

// =========================
// GENERATE JOURNAL FROM ONLINE LINK
// =========================
document.getElementById("fetchJournal").addEventListener("click", async () => {

    let doiInput = document.getElementById("doi_search").value.trim();

    if (!doiInput) {
        alert("Please enter a DOI or link.");
        return;
    }

    // Extract DOI from URL
    const match = doiInput.match(/(10\.\d{4,9}\/[-._;()\/:A-Z0-9]+)/i);
    if (match) doiInput = match[1];

    showLoading(); // <-- Start spinner

    try {
        const response = await fetch(`${API_BASE}/fetch/journal?doi=${doiInput}`);
        const data = await response.json();

        if (data.detail) {
            alert("DOI not found.");
            return;
        }

        // Autofill form fields
        document.getElementById("authors").value = data.authors.join(", ");
        document.getElementById("year").value = data.year;
        document.getElementById("article_title").value = data.article_title;
        document.getElementById("journal_title").value = data.journal_title;
        document.getElementById("volume").value = data.volume || "";
        document.getElementById("issue").value = data.issue || "";
        document.getElementById("pages").value = data.pages || "";
        document.getElementById("doi").value = data.doi || "";

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch journal metadata.");
    } finally {
        hideLoading(); // <-- Stop spinner
    }
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Testing spinner...");
    showLoading();
    setTimeout(hideLoading, 2000);
});
