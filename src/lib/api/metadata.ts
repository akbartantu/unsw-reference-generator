/**
 * API service for fetching metadata from DOI and URLs
 * Uses backend proxy to handle CORS
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface DOIMetadata {
  authors: Array<{ firstName: string; lastName: string }>;
  year: string;
  title: string;
  journalName: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  url: string;
}

export interface URLMetadata {
  title: string;
  authors: Array<{ firstName: string; lastName: string }>;
  organisationAuthor: string;
  year: string;
  siteName: string;
  sponsor?: string;
  url: string;
  doi?: string;
}

export interface MetadataResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch metadata from a DOI
 */
export async function fetchDOIMetadata(doi: string): Promise<MetadataResponse<DOIMetadata>> {
  try {
    const response = await fetch(`${API_BASE_URL}/fetch/doi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doi }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch DOI metadata' }));
      return { success: false, error: error.error || 'Failed to fetch DOI metadata' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Cannot connect to server. Please ensure the backend server is running on port 3001.',
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Fetch metadata from a URL
 */
export async function fetchURLMetadata(url: string): Promise<MetadataResponse<URLMetadata>> {
  try {
    const response = await fetch(`${API_BASE_URL}/fetch/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch URL metadata' }));
      return { success: false, error: error.error || 'Failed to fetch URL metadata' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Cannot connect to server. Please ensure the backend server is running on port 3001.',
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Validate DOI format
 */
export function validateDOI(doi: string): boolean {
  // Remove common prefixes
  const cleaned = doi
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:/i, '')
    .trim();
  
  // DOI format: 10.xxxx/...
  return /^10\.\d{4,}\/.+/.test(cleaned);
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

