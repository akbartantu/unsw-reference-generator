import type { Author, Source, ReferenceOutput, ReferenceStyle } from './types';

// Helper: Format authors for APA 7th
function formatAuthorsAPA(authors: Author[]): string {
  if (authors.length === 0) return '';
  
  if (authors.length === 1) {
    const a = authors[0];
    return `${a.lastName}, ${a.firstName.charAt(0).toUpperCase()}.`;
  }
  
  if (authors.length === 2) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0).toUpperCase()}., & ${authors[1].lastName}, ${authors[1].firstName.charAt(0).toUpperCase()}.`;
  }
  
  // 3+ authors: list all with & before last (APA 7 changed this from et al. in reference list)
  if (authors.length <= 20) {
    const formatted = authors.map((a, i) => {
      const base = `${a.lastName}, ${a.firstName.charAt(0).toUpperCase()}.`;
      if (i === authors.length - 1) return `& ${base}`;
      return base;
    });
    return formatted.join(', ').replace(', &', ', &');
  }
  
  // 21+ authors: first 19, ellipsis, last author
  const first19 = authors.slice(0, 19).map(a => `${a.lastName}, ${a.firstName.charAt(0).toUpperCase()}.`);
  const last = authors[authors.length - 1];
  return `${first19.join(', ')}, . . . ${last.lastName}, ${last.firstName.charAt(0).toUpperCase()}.`;
}

// Helper: Format authors for Harvard (UNSW variant)
// Note: In reference list, ALL authors are listed (no et al.)
// In-text citations use et al. for 4+ authors (handled separately)
function formatAuthorsHarvard(authors: Author[]): string {
  if (authors.length === 0) return '';
  
  if (authors.length === 1) {
    const a = authors[0];
    return `${a.lastName}, ${a.firstName.charAt(0).toUpperCase()}`;
  }
  
  if (authors.length === 2) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0).toUpperCase()} & ${authors[1].lastName}, ${authors[1].firstName.charAt(0).toUpperCase()}`;
  }
  
  if (authors.length === 3) {
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0).toUpperCase()}, ${authors[1].lastName}, ${authors[1].firstName.charAt(0).toUpperCase()} & ${authors[2].lastName}, ${authors[2].firstName.charAt(0).toUpperCase()}`;
  }
  
  // 4+ authors: List ALL authors with commas, & before the last one
  // Example: "Leeder, SR, Dobson, AJ, Gibbers, RW, Patel, NK, Matthews, PS, Williams DW & Mariot, DL"
  const formatted = authors.map((author, index) => {
    const formattedAuthor = `${author.lastName}, ${author.firstName.charAt(0).toUpperCase()}`;
    if (index === authors.length - 1) {
      // Last author: use & before it
      return `& ${formattedAuthor}`;
    }
    return formattedAuthor;
  });
  
  return formatted.join(', ');
}

// Helper: Convert to sentence case (APA)
function toSentenceCase(str: string): string {
  if (!str) return '';
  // Keep first letter uppercase, rest lowercase except after colon
  const result = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  // Handle subtitle after colon
  return result.replace(/: ([a-z])/g, (_, letter) => `: ${letter.toUpperCase()}`);
}

// Helper: Convert to title case (maximum capitalisation for journal names)
function toTitleCase(str: string): string {
  if (!str) return '';
  // Capitalize first letter of each word, except small words (a, an, the, and, but, or, for, nor, on, at, to, from, by, in, of, etc.)
  const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'the', 'to', 'with'];
  const words = str.toLowerCase().split(/\s+/);
  return words.map((word, index) => {
    // Always capitalize first word, and words not in smallWords list
    if (index === 0 || !smallWords.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ');
}

// Helper: Format in-text citation for APA
function formatInTextAPA(authors: Author[], year: string, orgAuthor?: string): { parenthetical: string; narrative: string } {
  const yearStr = year || 'n.d.';
  
  if (orgAuthor) {
    return {
      parenthetical: `(${orgAuthor}, ${yearStr})`,
      narrative: `${orgAuthor} (${yearStr})`
    };
  }
  
  if (authors.length === 0) {
    return { parenthetical: `(${yearStr})`, narrative: `(${yearStr})` };
  }
  
  if (authors.length === 1) {
    return {
      parenthetical: `(${authors[0].lastName}, ${yearStr})`,
      narrative: `${authors[0].lastName} (${yearStr})`
    };
  }
  
  if (authors.length === 2) {
    return {
      parenthetical: `(${authors[0].lastName} & ${authors[1].lastName}, ${yearStr})`,
      narrative: `${authors[0].lastName} and ${authors[1].lastName} (${yearStr})`
    };
  }
  
  // 3+ authors: first author et al.
  return {
    parenthetical: `(${authors[0].lastName} et al., ${yearStr})`,
    narrative: `${authors[0].lastName} et al. (${yearStr})`
  };
}

// Helper: Format in-text citation for Harvard
function formatInTextHarvard(authors: Author[], year: string, orgAuthor?: string): { parenthetical: string; narrative: string } {
  const yearStr = year || 'n.d.';
  
  if (orgAuthor) {
    return {
      parenthetical: `(${orgAuthor} ${yearStr})`,
      narrative: `${orgAuthor} (${yearStr})`
    };
  }
  
  if (authors.length === 0) {
    return { parenthetical: `(${yearStr})`, narrative: `(${yearStr})` };
  }
  
  if (authors.length === 1) {
    return {
      parenthetical: `(${authors[0].lastName} ${yearStr})`,
      narrative: `${authors[0].lastName} (${yearStr})`
    };
  }
  
  if (authors.length === 2) {
    return {
      parenthetical: `(${authors[0].lastName} & ${authors[1].lastName} ${yearStr})`,
      narrative: `${authors[0].lastName} and ${authors[1].lastName} (${yearStr})`
    };
  }
  
  if (authors.length === 3) {
    return {
      parenthetical: `(${authors[0].lastName}, ${authors[1].lastName} & ${authors[2].lastName} ${yearStr})`,
      narrative: `${authors[0].lastName}, ${authors[1].lastName} and ${authors[2].lastName} (${yearStr})`
    };
  }
  
  // 4+ authors: Use first author et al. (UNSW Harvard rule)
  // Note: Reference list still lists ALL authors (handled in formatAuthorsHarvard)
  return {
    parenthetical: `(${authors[0].lastName} et al. ${yearStr})`,
    narrative: `${authors[0].lastName} et al. (${yearStr})`
  };
}

// APA 7th Formatters
export function formatAPA7(source: Source): ReferenceOutput {
  // Handle AI sources separately (no authors)
  if (source.type === 'ai') {
    const company = source.company;
    const year = source.year ? `(${source.year})` : '(n.d.)';
    const productName = `<i>${source.productName}</i>`;
    const modelType = `[${source.modelType}]`;
    const retrieved = `Retrieved ${source.retrievedDate}, from ${source.url}`;
    
    const inTextYear = source.year || 'n.d.';
    const inText = {
      parenthetical: `(${company} ${inTextYear})`,
      narrative: `${company} (${inTextYear})`
    };
    
    return {
      referenceList: `${company} ${year}. ${productName} ${modelType}. ${retrieved}`,
      inTextParenthetical: inText.parenthetical,
      inTextNarrative: inText.narrative
    };
  }
  
  const inText = formatInTextAPA(
    source.authors,
    source.year,
    source.type === 'website' ? source.organisationAuthor : undefined
  );
  
  switch (source.type) {
    case 'book': {
      const authors = formatAuthorsAPA(source.authors);
      const year = source.year ? `(${source.year})` : '(n.d.)';
      const title = `<i>${toSentenceCase(source.title)}</i>`;
      const edition = source.edition ? ` (${source.edition} ed.)` : '';
      const publisher = source.publisher;
      const location = source.doi ? ` https://doi.org/${source.doi}` : (source.url ? ` ${source.url}` : '');
      
      return {
        referenceList: `${authors} ${year}. ${title}${edition}. ${publisher}.${location}`,
        inTextParenthetical: inText.parenthetical,
        inTextNarrative: inText.narrative
      };
    }
    
    case 'journal': {
      const authors = formatAuthorsAPA(source.authors);
      const year = source.year ? `(${source.year})` : '(n.d.)';
      const title = toSentenceCase(source.title);
      const journal = `<i>${source.journalName}</i>`;
      const volume = source.volume ? `, <i>${source.volume}</i>` : '';
      const issue = source.issue ? `(${source.issue})` : '';
      const pages = source.pages ? `, ${source.pages}` : '';
      const doi = source.doi ? ` https://doi.org/${source.doi}` : (source.url ? ` ${source.url}` : '');
      
      return {
        referenceList: `${authors} ${year}. ${title}. ${journal}${volume}${issue}${pages}.${doi}`,
        inTextParenthetical: inText.parenthetical,
        inTextNarrative: inText.narrative
      };
    }
    
    case 'website': {
      const author = source.organisationAuthor || formatAuthorsAPA(source.authors);
      const year = source.year ? `(${source.year})` : '(n.d.)';
      const title = `<i>${toSentenceCase(source.title)}</i>`;
      const siteName = source.siteName !== author ? `. ${source.siteName}` : '';
      const retrieved = `Retrieved ${source.accessDate}, from ${source.url}`;
      
      return {
        referenceList: `${author} ${year}. ${title}${siteName}. ${retrieved}`,
        inTextParenthetical: inText.parenthetical,
        inTextNarrative: inText.narrative
      };
    }
  }
}

// Harvard (UNSW variant) Formatters
export function formatHarvard(source: Source): ReferenceOutput {
  // Handle AI sources separately (no authors)
  if (source.type === 'ai') {
    const company = source.company;
    const year = source.year || 'n.d.';
    const productName = `<i>${source.productName}</i>`;
    const modelType = `[${source.modelType}]`;
    const retrieved = `Retrieved ${source.retrievedDate}, from ${source.url}`;
    
    const inTextYear = source.year || 'n.d.';
    const inText = {
      parenthetical: `(${company} ${inTextYear})`,
      narrative: `${company} (${inTextYear})`
    };
    
    // Format: Company. Year, Product Name in italics, [Type of AI model], Retrieved Month Day, Year, from URL.
    return {
      referenceList: `${company}. ${year}, ${productName}, ${modelType}, ${retrieved}.`,
      inTextParenthetical: inText.parenthetical,
      inTextNarrative: inText.narrative
    };
  }
  
  // For websites, handle no author case (use page title)
  let inText: { parenthetical: string; narrative: string };
  if (source.type === 'website') {
    const hasAuthor = source.organisationAuthor || (source.authors.length > 0 && source.authors[0].lastName);
    if (!hasAuthor) {
      // No author: use page title for in-text citation
      const yearStr = source.year || 'n.d.';
      const pageTitle = source.title;
      inText = {
        parenthetical: `(${pageTitle} ${yearStr})`,
        narrative: `${pageTitle} (${yearStr})`
      };
    } else {
      inText = formatInTextHarvard(
        source.authors,
        source.year,
        source.organisationAuthor
      );
    }
  } else {
    inText = formatInTextHarvard(
      source.authors,
      source.year,
      undefined
    );
  }
  
  switch (source.type) {
    case 'book': {
      const authors = formatAuthorsHarvard(source.authors);
      const year = source.year || 'n.d.';
      // Harvard uses minimal capitalization (only first word and proper nouns)
      const title = `<i>${toSentenceCase(source.title)}</i>`;
      const edition = source.edition ? `, ${source.edition} edn` : '';
      const publisher = source.publisher;
      const location = source.location || '';
      
      return {
        referenceList: `${authors} ${year}, ${title}${edition}, ${publisher}, ${location}.`,
        inTextParenthetical: inText.parenthetical,
        inTextNarrative: inText.narrative
      };
    }
    
    case 'journal': {
      const authors = formatAuthorsHarvard(source.authors);
      const year = source.year || 'n.d.';
      // Article title: single quotation marks, minimal capitalisation
      const title = `'${toSentenceCase(source.title)}'`;
      // Journal name: italic font, maximum capitalisation (Title Case)
      const journal = `<i>${toTitleCase(source.journalName)}</i>`;
      const volume = source.volume ? `, vol. ${source.volume}` : '';
      const issue = source.issue ? `, no. ${source.issue}` : '';
      const pages = source.pages ? `, pp. ${source.pages}` : '';
      const doi = source.doi ? `, DOI:${source.doi}` : '';
      
      return {
        referenceList: `${authors} ${year}, ${title}, ${journal}${volume}${issue}${pages}${doi}.`,
        inTextParenthetical: inText.parenthetical,
        inTextNarrative: inText.narrative
      };
    }
    
    case 'website': {
      // Harvard format: Author Year, Page Title (in italics), Sponsor (if available), accessed Day Month Year, <URL>.
      // If no author: Page Title Year, accessed Day Month Year, <URL>.
      const hasAuthor = source.organisationAuthor || (source.authors.length > 0 && source.authors[0].lastName);
      const author = source.organisationAuthor || formatAuthorsHarvard(source.authors);
      const year = source.year || 'n.d.';
      const pageTitle = `<i>${toSentenceCase(source.title)}</i>`;
      const sponsor = source.sponsor ? `, ${source.sponsor}` : '';
      const accessed = `accessed ${source.accessDate}`;
      // URL must always be included in pointed brackets (required by UNSW guidelines)
      // HTML-encode angle brackets so they display correctly in dangerouslySetInnerHTML
      const url = source.url ? `&lt;${source.url}&gt;` : '&lt;URL&gt;';
      
      let referenceList: string;
      if (hasAuthor) {
        // Has author: Author Year, Page Title (in italics), Sponsor, accessed Date, <URL>.
        referenceList = `${author} ${year}, ${pageTitle}${sponsor}, ${accessed}, ${url}.`;
      } else {
        // No author: Page Title Year, accessed Date, <URL>.
        const pageTitlePlain = toSentenceCase(source.title);
        referenceList = `${pageTitlePlain} ${year}, ${accessed}, ${url}.`;
      }
      
      return {
        referenceList,
        inTextParenthetical: inText.parenthetical,
        inTextNarrative: inText.narrative
      };
    }
  }
}

export function generateReference(style: ReferenceStyle, source: Source): ReferenceOutput {
  switch (style) {
    case 'apa7':
      return formatAPA7(source);
    case 'harvard':
      return formatHarvard(source);
    default:
      return formatAPA7(source);
  }
}
