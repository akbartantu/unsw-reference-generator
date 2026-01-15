# UNSW Reference Generator

A web-based reference generator for UNSW Sydney students that supports manual entry and automatic metadata fetching from DOIs and URLs. Generates citations in **APA 7th Edition** and **Harvard (UNSW)** styles.

## ✨ Features

- 📝 **Manual Entry** - Full control over all citation fields
- 🔄 **Auto-fill from DOI** - Automatically fetch journal article metadata via Crossref API
- 🌐 **Auto-fill from URL** - Extract metadata from webpages using HTML parsing
- 📚 **Multiple Source Types** - Books, Journal Articles, Websites
- 🎨 **Two Referencing Styles** - APA 7th Edition and Harvard (UNSW)
- ✅ **Verified UNSW Guidelines** - Based on official UNSW Library referencing guides
- 📋 **Complete Citations** - Reference list entries + in-text citations (parenthetical & narrative)
- 📖 **Reference Guides** - Visual guides showing correct format structure with examples
- 🔒 **Robust Error Handling** - Clear error messages and manual fallback
- 📋 **Copy to Clipboard** - Easy copying of generated references

## 🎯 Verified UNSW Requirements

This tool follows UNSW Library's official referencing guidelines:

- **APA 7th Edition**: [UNSW APA 7th Guide](https://www.unsw.edu.au/student/managing-your-studies/academic-skills-support/toolkit/referencing/apa)
- **Harvard (UNSW)**: [UNSW Harvard Guide](https://www.unsw.edu.au/student/managing-your-studies/academic-skills-support/toolkit/referencing/harvard)

### Supported Source Types

1. **Books** - Print and e-books with single/multiple authors, editions, DOI/URL
2. **Journal Articles** - Print and online journals with volume, issue, pages, DOI
3. **Websites/Online Articles** - Individual or organizational authors, access dates, sponsor information

### Key Formatting Rules

- **Harvard (UNSW)**: All authors listed in reference list (no "et al."), journal names use Title Case
- **APA 7th**: Follows APA 7th Edition guidelines with proper capitalization and formatting
- **In-text Citations**: Supports both parenthetical and narrative citation formats

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Two terminal windows

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reference-generator
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configure environment** (optional)
   
   Create a `.env` file in the root directory:
   ```bash
   VITE_API_URL=http://localhost:3001
   ```

### Running Locally

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
```

Backend runs on `http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

Frontend runs on `http://localhost:8080`

Open your browser to `http://localhost:8080` to use the application.

## 📖 How to Use

### Manual Entry

1. Select your referencing style (APA 7th or Harvard)
2. Choose source type (Book, Journal Article, or Website)
3. Fill in the required fields
4. Click "Generate Reference"

### Auto-fill from DOI (Journal Articles)

1. Select "Journal Article" as source type
2. In the "Auto-fill from DOI" section, enter a DOI:
   - Format: `10.1000/xyz123` or `https://doi.org/10.1000/xyz123`
3. Click "Fetch Details"
4. Review and edit the auto-populated fields
5. Click "Generate Reference"

**Example DOIs to test:**
- `10.1038/nature12373`
- `10.1207/s15326985ep2803_5`

### Auto-fill from URL (Websites)

1. Select "Website" as source type
2. In the "Auto-fill from URL" section, enter the article URL
3. Click "Fetch Details"
4. Review and edit the auto-populated fields
5. Set access date if needed (defaults to today)
6. Click "Generate Reference"

**Example URLs to test:**
- `https://www.who.int/news/item/22-12-2025-who-global-summit-charts-a-bold-future-for-traditional-medicine`
- `https://www.nature.com/articles/s41586-020-2649-2`

### Reference Guides

When generating Harvard references, a reference guide appears below the output showing:
- The correct structure/order of information
- Examples for different scenarios (one author, organization, no author)
- In-text citation rules

Use this guide to verify your reference matches UNSW guidelines.

## 🏗️ Project Structure

```
reference-generator/
├── server/                      # Backend proxy server
│   ├── server.js               # Express server (CORS, rate limiting, caching)
│   └── package.json            # Backend dependencies
├── src/
│   ├── components/
│   │   ├── ReferenceForm.tsx   # Main form with auto-fill UI
│   │   ├── ReferenceOutput.tsx # Citation output display
│   │   └── ReferenceGuide.tsx  # Reference format guide component
│   ├── lib/
│   │   ├── api/
│   │   │   └── metadata.ts     # API service functions
│   │   └── referencing/
│   │       ├── formatters.ts   # Citation formatters (APA/Harvard)
│   │       └── types.ts        # TypeScript types
│   └── pages/
│       └── Index.tsx           # Main page
├── server/                    # Backend proxy server
│   ├── server.js            # Express server with CORS, rate limiting
│   └── package.json         # Backend dependencies
├── SETUP.md                  # Detailed setup instructions
├── HOW_TO_RUN.md            # Simple step-by-step guide
├── TROUBLESHOOTING.md       # Error documentation
├── PROJECT_SUMMARY.md        # Project summary (Scrum)
└── package.json             # Frontend dependencies
```

## 🔧 API Endpoints

The backend provides:

- `POST /api/fetch/doi` - Fetch metadata by DOI
  ```json
  { "doi": "10.1000/xyz123" }
  ```

- `POST /api/fetch/url` - Fetch metadata by URL
  ```json
  { "url": "https://example.com/article" }
  ```

- `GET /api/health` - Health check

## 📊 Metadata Fetching Strategy

### DOI Fetching (Journal Articles)

- **Source**: Crossref REST API (`https://api.crossref.org/works/{doi}`)
- **Caching**: 1 hour cache for successful requests
- **Rate Limiting**: 50 requests per 15 minutes per IP
- **Field Mapping**:
  - Authors → `author` array
  - Year → `published-print` or `published-online`
  - Title → `title[0]`
  - Journal → `container-title[0]`
  - Volume, Issue, Pages → Direct mapping
  - DOI, URL → From response

### URL Fetching (Websites)

- **Sources**: HTML meta tags, Schema.org JSON-LD, Open Graph
- **Priority**: `og:title` > `citation_title` > `<title>` tag
- **Authors**: `citation_author` meta tags or Schema.org
- **Enrichment**: If DOI found on page, fetches via Crossref
- **Caching**: 1 hour cache for successful requests

## 🧪 Test Cases

### DOI Test Cases

1. **Standard Journal Article**
   - DOI: `10.1038/nature12373`
   - Expected: All fields populated (authors, year, title, journal, volume, pages)

2. **DOI with URL Format**
   - DOI: `https://doi.org/10.1371/journal.pone.0123456`
   - Expected: DOI extracted correctly, metadata fetched

3. **Recent Article**
   - DOI: `10.1126/science.abc1234`
   - Expected: Current year in year field

### URL Test Cases

1. **Academic Article**
   - URL: `https://www.nature.com/articles/s41586-020-2649-2`
   - Expected: Title, authors, year, site name extracted

2. **News Article**
   - URL: `https://www.bbc.com/news/science-environment-12345678`
   - Expected: Title, date, site name extracted

3. **Blog Post**
   - URL: `https://example.com/blog/article`
   - Expected: Basic metadata (title, site name, URL)

## ⚠️ Limitations

1. **DOI Fetching**:
   - Requires valid DOI format
   - Depends on Crossref API availability
   - Some older DOIs may have incomplete metadata
   - Rate limited (50 requests/15 min per IP)

2. **URL Fetching**:
   - Requires accessible URLs (no paywalls/auth)
   - Some sites block automated requests
   - Metadata quality varies by website
   - Access date must be set manually

3. **General**:
   - Backend server required for auto-fill
   - Always verify fetched data for accuracy
   - Manual entry available as fallback

## 🐛 Troubleshooting

For detailed troubleshooting guide with solutions to common errors, see **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**.

### Quick Fixes

**Backend Not Starting:**
- Check if port 3001 is available
- Verify Node.js version (18+)
- Ensure `server/package.json` dependencies installed

**Auto-fill Not Working:**
- Ensure backend server is running
- Check browser console for errors
- Verify `.env` file has correct `VITE_API_URL`
- Check network tab for API failures

**CORS Errors:**
- Backend handles CORS automatically
- If errors persist, check backend CORS config

**URL Not Showing in Reference:**
- This has been fixed - URL brackets are HTML-encoded for proper display
- Clear browser cache if issue persists

## 📦 Deployment

### Frontend (Static)

```bash
npm run build
```

Deploy `dist/` folder to Vercel, Netlify, GitHub Pages, etc.

**Important**: Update `VITE_API_URL` in `.env` before building.

### Backend

Deploy `server/` directory to Heroku, Railway, Render, AWS EC2, etc.

Set environment variable `PORT` (defaults to 3001).

## 📚 Documentation

This project includes comprehensive documentation:

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions and configuration
- **[HOW_TO_RUN.md](./HOW_TO_RUN.md)** - Simple step-by-step guide (beginner-friendly)
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for getting started
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common errors and solutions
- **[TEST_CASES.md](./TEST_CASES.md)** - Test scenarios and expected outputs
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview and Scrum summary
- **[DELIVERABLES.md](./DELIVERABLES.md)** - Complete deliverables documentation

## 🤝 Contributing

When adding features:
1. Follow existing code style
2. Add error handling
3. Update documentation
4. Test with multiple DOIs/URLs
5. Verify output matches UNSW guidelines
6. Update relevant documentation files

## 📊 Project Status

✅ **Version:** 1.0.0  
✅ **Status:** Production Ready  
✅ **Last Updated:** December 2024

### Recent Updates
- ✅ Auto-fill from DOI and URL
- ✅ Reference format guides
- ✅ Enhanced error handling
- ✅ UNSW Harvard format compliance
- ✅ Comprehensive documentation

## 📄 License

Built for UNSW students. Not an official UNSW tool.

## 🔗 References

- [UNSW APA 7th Edition Guide](https://www.unsw.edu.au/student/managing-your-studies/academic-skills-support/toolkit/referencing/apa)
- [UNSW Harvard Referencing Guide](https://www.unsw.edu.au/student/managing-your-studies/academic-skills-support/toolkit/referencing/harvard)
- [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)

---

**Note**: Always verify generated citations with your course convenor for specific requirements.
