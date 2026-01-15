import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3001;
const CACHE_TTL = 3600; // 1 hour cache

// Initialize cache
const cache = new NodeCache({ stdTTL: CACHE_TTL });

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting: 50 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Helper: Extract DOI from string
function extractDOI(input) {
  // Remove common DOI URL prefixes
  const cleaned = input
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:/i, '')
    .trim();
  
  // Basic DOI validation: should start with 10.
  if (/^10\.\d{4,}\/.+/.test(cleaned)) {
    return cleaned;
  }
  
  return null;
}

// Helper: Validate URL
function isValidURL(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Helper: Parse authors from Crossref format
function parseAuthors(authors) {
  if (!authors || !Array.isArray(authors)) return [];
  
  return authors.map(author => {
    const given = author.given || '';
    const family = author.family || '';
    // Split given names if multiple
    const firstName = given.split(' ')[0] || '';
    const lastName = family || '';
    return { firstName, lastName };
  }).filter(a => a.firstName || a.lastName);
}

// Helper: Extract year from date parts
function extractYear(dateParts) {
  if (!dateParts || !Array.isArray(dateParts) || dateParts.length === 0) return '';
  
  // Try published-print first, then published-online
  const datePart = dateParts[0];
  if (datePart && datePart.length > 0) {
    return String(datePart[0]);
  }
  
  return '';
}

// Helper: Extract pages from Crossref
function extractPages(page) {
  if (!page) return '';
  
  if (typeof page === 'string') {
    return page;
  }
  
  // Handle page ranges like "253-265"
  if (page.includes('-')) {
    return page;
  }
  
  return page;
}

// Fetch metadata from Crossref by DOI
async function fetchCrossrefMetadata(doi) {
  try {
    const response = await axios.get(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: {
        'User-Agent': 'UNSW-Reference-Generator/1.0 (https://github.com/unsw-reference-generator)',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    const data = response.data?.message;
    if (!data) {
      throw new Error('Invalid response from Crossref');
    }
    
    // Map Crossref fields to our format
    const authors = parseAuthors(data.author || []);
    const year = extractYear(data['published-print']?.['date-parts']) || 
                 extractYear(data['published-online']?.['date-parts']) || '';
    const title = (data.title && data.title[0]) || '';
    const journalName = (data['container-title'] && data['container-title'][0]) || '';
    const volume = data.volume || '';
    const issue = data.issue || '';
    const pages = extractPages(data.page) || '';
    const doiValue = data.DOI || doi;
    
    return {
      success: true,
      data: {
        authors,
        year,
        title,
        journalName,
        volume,
        issue,
        pages,
        doi: doiValue,
        url: data.URL || `https://doi.org/${doiValue}`
      }
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, error: 'DOI not found. Please check the DOI and try again.' };
    }
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: 'Request timeout. Please try again.' };
    }
    return { success: false, error: `Failed to fetch DOI metadata: ${error.message}` };
  }
}

// Extract metadata from webpage HTML
function extractWebMetadata(html, url) {
  const $ = cheerio.load(html);
  const metadata = {
    title: '',
    authors: [],
    organisationAuthor: '',
    year: '',
    siteName: '',
    url: url
  };
  
  // FIRST: Special handling for known organizations (do this BEFORE other extraction)
  // This prevents incorrect extraction from page content
  if (url.includes('who.int')) {
    metadata.organisationAuthor = 'World Health Organization';
    metadata.siteName = 'World Health Organization';
  }
  
  // Extract title (priority: og:title > citation_title > title tag)
  metadata.title = $('meta[property="og:title"]').attr('content') ||
                   $('meta[name="citation_title"]').attr('content') ||
                   $('title').text().trim() ||
                   '';
  
  // Extract site name (only if not already set by special handling)
  if (!metadata.siteName) {
    metadata.siteName = $('meta[property="og:site_name"]').attr('content') ||
                        $('meta[name="citation_journal_title"]').attr('content') ||
                        '';
    
    // If no meta tag, try to extract from page title or header
    if (!metadata.siteName) {
      // Check for organization name in title or header
      const titleText = $('title').text() || '';
      const headerText = $('header, [role="banner"]').first().text() || '';
      
      // Common organization patterns in titles
      if (titleText.includes('WHO') || titleText.includes('World Health Organization')) {
        metadata.siteName = 'World Health Organization';
      } else if (headerText.includes('World Health Organization')) {
        metadata.siteName = 'World Health Organization';
      } else {
        // Fallback to hostname
        const hostname = new URL(url).hostname.replace('www.', '');
        // Capitalize first letter of each word for better presentation
        metadata.siteName = hostname.split('.').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
    }
  }
  
  // Extract authors
  const citationAuthors = $('meta[name^="citation_author"]').map((_, el) => {
    const name = $(el).attr('content') || '';
    if (name) {
      const parts = name.trim().split(/\s+/);
      const lastName = parts[parts.length - 1] || '';
      const firstName = parts.slice(0, -1).join(' ') || '';
      return { firstName, lastName };
    }
    return null;
  }).get().filter(a => a);
  
  if (citationAuthors.length > 0) {
    metadata.authors = citationAuthors;
  } else {
    // Try schema.org
    const schemaScripts = $('script[type="application/ld+json"]');
    schemaScripts.each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type'] === 'Article' || json['@type'] === 'NewsArticle') {
          if (json.author) {
            const authors = Array.isArray(json.author) ? json.author : [json.author];
            metadata.authors = authors.map((author) => {
              if (typeof author === 'string') {
                const parts = author.split(/\s+/);
                return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] || '' };
              }
              if (author.name) {
                const parts = author.name.split(/\s+/);
                return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] || '' };
              }
              return null;
            }).filter(a => a);
          }
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    });
  }
  
  // Extract organisation author - try multiple sources (only if not already set by special handling)
  if (!metadata.organisationAuthor) {
    metadata.organisationAuthor = $('meta[name="citation_publisher"]').attr('content') ||
                                  $('meta[property="og:site_name"]').attr('content') ||
                                  $('meta[property="article:publisher"]').attr('content') ||
                                  '';
  }
  
  // If no meta tag, try to extract from visible text (common organization patterns)
  if (!metadata.organisationAuthor) {
    // Look for organization in common locations
    const orgSelectors = [
      'header [class*="logo"]',
      'header [class*="brand"]',
      '[class*="organization"]',
      '[class*="publisher"]',
      'article [class*="author"]',
      'article [class*="byline"]'
    ];
    
    for (const selector of orgSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        // Common organization patterns - filter out single words and common non-org words
        const excludeWords = ['global', 'local', 'national', 'international', 'regional', 'departmental', 'update'];
        const textLower = text.toLowerCase();
        
        // Skip if it's just a single word that's in the exclude list
        if (excludeWords.some(word => textLower === word)) {
          continue;
        }
        
        // Common organization patterns - must be reasonable length and not just a location
        if (text && text.length > 3 && text.length < 100) {
          // Prefer text that contains organization keywords
          const orgKeywords = ['organization', 'organisation', 'institute', 'institution', 'foundation', 'association', 'society', 'ministry', 'department', 'government', 'health', 'university', 'college'];
          const hasOrgKeyword = orgKeywords.some(keyword => textLower.includes(keyword));
          
          // If it has org keywords or is longer than 10 chars (likely a real org name), use it
          if (hasOrgKeyword || text.length > 10) {
            metadata.organisationAuthor = text;
            break;
          }
        }
      }
    }
    
    // Also check schema.org for publisher/organization
    const schemaScripts = $('script[type="application/ld+json"]');
    schemaScripts.each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json.publisher) {
          if (typeof json.publisher === 'string') {
            metadata.organisationAuthor = json.publisher;
          } else if (json.publisher.name) {
            metadata.organisationAuthor = json.publisher.name;
          }
        }
        if (!metadata.organisationAuthor && json['@type'] === 'Organization' && json.name) {
          metadata.organisationAuthor = json.name;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    });
    
    // Fallback: extract from site name if it looks like an organization
    if (!metadata.organisationAuthor && metadata.siteName) {
      // If site name contains organization-like words, use it
      const orgKeywords = ['organization', 'organisation', 'institute', 'institution', 'foundation', 'association', 'society', 'ministry', 'department', 'government'];
      const siteNameLower = metadata.siteName.toLowerCase();
      if (orgKeywords.some(keyword => siteNameLower.includes(keyword))) {
        metadata.organisationAuthor = metadata.siteName;
      }
    }
  }
  
  // Extract year/date - try multiple sources
  let dateStr = $('meta[name="citation_publication_date"]').attr('content') ||
                $('meta[property="article:published_time"]').attr('content') ||
                $('meta[name="DC.date"]').attr('content') ||
                $('meta[property="article:published"]').attr('content') ||
                $('time[datetime]').attr('datetime') ||
                $('time[pubdate]').attr('datetime') ||
                '';
  
  // If no meta tag date, try to find date in visible text (common patterns)
  if (!dateStr) {
    // Look for date patterns in common locations
    const datePatterns = [
      /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/i,
      /\b(\d{4}-\d{2}-\d{2})\b/,
      /\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/i
    ];
    
    // Check common date locations (more comprehensive)
    const dateSelectors = [
      'time',
      '[class*="date"]',
      '[class*="published"]',
      '[class*="publish"]',
      'article time',
      '.article-date',
      '.published-date',
      '[class*="meta"]',
      '[class*="info"]',
      'article header',
      'article [class*="header"]',
      'main [class*="date"]',
      'main [class*="published"]'
    ];
    
    for (const selector of dateSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text() || element.attr('datetime') || element.attr('content');
        if (text) {
          for (const pattern of datePatterns) {
            const match = text.match(pattern);
            if (match) {
              dateStr = match[1];
              break;
            }
          }
          if (dateStr) break;
        }
      }
    }
    
    // If still no date, search the entire article/main content area more broadly
    if (!dateStr) {
      const mainContent = $('article, main, [role="main"], .content, .article-content').first();
      if (mainContent.length) {
        const contentText = mainContent.text();
        // Look for date patterns in the first 500 characters (usually near the top)
        const preview = contentText.substring(0, 500);
        for (const pattern of datePatterns) {
          const match = preview.match(pattern);
          if (match) {
            dateStr = match[1];
            break;
          }
        }
      }
    }
    
    // Last resort: search entire page body for date patterns (but limit to first 2000 chars)
    if (!dateStr) {
      const bodyText = $('body').text().substring(0, 2000);
      for (const pattern of datePatterns) {
        const match = bodyText.match(pattern);
        if (match) {
          dateStr = match[1];
          break;
        }
      }
    }
  }
  
  if (dateStr) {
    // Try parsing as Date object first
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      metadata.year = String(date.getFullYear());
    } else {
      // Try to extract year from string (handles formats like "22 December 2025")
      const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        metadata.year = yearMatch[0];
      } else {
        // Try parsing date strings like "22 December 2025"
        const dateMatch = dateStr.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
        if (dateMatch) {
          metadata.year = dateMatch[3];
        }
      }
    }
  }
  
  // Check for DOI on page and enrich if found
  const doiOnPage = $('meta[name="citation_doi"]').attr('content') ||
                    $('meta[name="DC.identifier"]').attr('content')?.match(/10\.\d{4,}\/.+/)?.[0] ||
                    '';
  
  return { metadata, doiOnPage };
}

// Fetch webpage metadata
async function fetchWebMetadata(url) {
  const cacheKey = `web:${url}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
    });
    
    if (response.status >= 400) {
      return { success: false, error: `Failed to fetch webpage (HTTP ${response.status})` };
    }
    
    const { metadata, doiOnPage } = extractWebMetadata(response.data, url);
    
    // If DOI found, try to enrich with Crossref
    if (doiOnPage) {
      const doiResult = await fetchCrossrefMetadata(doiOnPage);
      if (doiResult.success) {
        // Merge Crossref data (prefer Crossref for journal articles)
        metadata.authors = doiResult.data.authors.length > 0 ? doiResult.data.authors : metadata.authors;
        metadata.year = doiResult.data.year || metadata.year;
        metadata.title = doiResult.data.title || metadata.title;
        metadata.doi = doiOnPage;
      }
    }
    
    const result = { success: true, data: metadata };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return { success: false, error: 'Could not connect to the website. Please check the URL.' };
    }
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: 'Request timeout. The website may be slow or unavailable.' };
    }
    if (error.response?.status === 403) {
      return { success: false, error: 'Access denied. The website may block automated requests.' };
    }
    return { success: false, error: `Failed to fetch webpage: ${error.message}` };
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fetch DOI metadata
app.post('/api/fetch/doi', async (req, res) => {
  const { doi } = req.body;
  
  if (!doi || typeof doi !== 'string') {
    return res.status(400).json({ success: false, error: 'DOI is required' });
  }
  
  const extractedDOI = extractDOI(doi);
  if (!extractedDOI) {
    return res.status(400).json({ success: false, error: 'Invalid DOI format. Please enter a valid DOI (e.g., 10.1000/xyz123)' });
  }
  
  // Check cache
  const cacheKey = `doi:${extractedDOI}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  const result = await fetchCrossrefMetadata(extractedDOI);
  
  // Cache successful results
  if (result.success) {
    cache.set(cacheKey, result);
  }
  
  res.json(result);
});

// Fetch URL metadata
app.post('/api/fetch/url', async (req, res) => {
  const { url } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }
  
  if (!isValidURL(url)) {
    return res.status(400).json({ success: false, error: 'Invalid URL format. Please enter a valid URL (e.g., https://example.com)' });
  }
  
  const result = await fetchWebMetadata(url);
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Reference Generator Backend running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST /api/fetch/doi - Fetch metadata by DOI`);
  console.log(`   POST /api/fetch/url - Fetch metadata by URL`);
  console.log(`   GET  /api/health - Health check`);
});

