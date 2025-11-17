// =========================
// API BASE URL (Render URL)
// =========================
const API_BASE = "https://unsw-reference-generator.onrender.com";

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
});

// =========================
// GENERATE ONLINE MEDIA
// =========================
document.getElementById("generateOnline").addEventListener("click", async () => {

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
