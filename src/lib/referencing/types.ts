export type ReferenceStyle = 'apa7' | 'harvard';

export type SourceType = 'book' | 'journal' | 'website' | 'ai';

export interface Author {
  firstName: string;
  lastName: string;
}

export interface BookSource {
  type: 'book';
  authors: Author[];
  year: string;
  title: string;
  edition?: string;
  publisher: string;
  location?: string; // Required for Harvard
  doi?: string;
  url?: string;
}

export interface JournalSource {
  type: 'journal';
  authors: Author[];
  year: string;
  title: string;
  journalName: string;
  volume: string;
  issue?: string;
  pages: string;
  doi?: string;
  url?: string;
}

export interface WebsiteSource {
  type: 'website';
  authors: Author[];
  organisationAuthor?: string;
  year: string;
  title: string; // Page title (used as author if no author provided)
  siteName: string; // Site name (in italics)
  sponsor?: string; // Sponsor of site (optional)
  accessDate: string;
  url: string;
}

export interface AISource {
  type: 'ai';
  company: string; // Company name (e.g., OpenAI)
  year: string;
  productName: string; // Product name (e.g., ChatGPT) - in italics
  modelType: string; // Type of AI model (e.g., Large language model) - in square brackets
  retrievedDate: string; // Retrieved Month Day, Year (e.g., October 19, 2023)
  url: string;
}

export type Source = BookSource | JournalSource | WebsiteSource | AISource;

export interface ReferenceOutput {
  referenceList: string;
  inTextParenthetical: string;
  inTextNarrative: string;
}
