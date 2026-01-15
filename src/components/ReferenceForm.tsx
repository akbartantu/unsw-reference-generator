import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, User, Loader2, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchDOIMetadata, fetchURLMetadata, validateDOI, validateURL } from '@/lib/api/metadata';
import type { Author, Source, ReferenceStyle, SourceType } from '@/lib/referencing/types';

interface ReferenceFormProps {
  onGenerate: (style: ReferenceStyle, source: Source) => void;
}

export function ReferenceForm({ onGenerate }: ReferenceFormProps) {
  const [style, setStyle] = useState<ReferenceStyle>('apa7');
  const [sourceType, setSourceType] = useState<SourceType>('book');
  const [authors, setAuthors] = useState<Author[]>([{ firstName: '', lastName: '' }]);
  const [organisationAuthor, setOrganisationAuthor] = useState('');
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  
  // Book fields
  const [publisher, setPublisher] = useState('');
  const [location, setLocation] = useState('');
  const [edition, setEdition] = useState('');
  const [doi, setDoi] = useState('');
  const [url, setUrl] = useState('');
  
  // Journal fields
  const [journalName, setJournalName] = useState('');
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  
  // Website fields
  const [siteName, setSiteName] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [accessDate, setAccessDate] = useState('');
  
  // AI fields
  const [company, setCompany] = useState('');
  const [productName, setProductName] = useState('');
  const [modelType, setModelType] = useState('');
  const [retrievedDate, setRetrievedDate] = useState('');
  const [aiUrl, setAiUrl] = useState('');
  
  // Auto-fill states
  const [doiInput, setDoiInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingDOI, setIsFetchingDOI] = useState(false);
  const [isFetchingURL, setIsFetchingURL] = useState(false);

  const addAuthor = () => {
    setAuthors([...authors, { firstName: '', lastName: '' }]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, field: 'firstName' | 'lastName', value: string) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  // Auto-fill from DOI (Journal Articles)
  const handleFetchDOI = async () => {
    if (!doiInput.trim()) {
      toast.error('Please enter a DOI');
      return;
    }

    if (!validateDOI(doiInput)) {
      toast.error('Invalid DOI format. Please enter a valid DOI (e.g., 10.1000/xyz123 or https://doi.org/10.1000/xyz123)');
      return;
    }

    setIsFetchingDOI(true);
    try {
      const result = await fetchDOIMetadata(doiInput);
      
      if (result.success && result.data) {
        // Populate form fields
        if (result.data.authors.length > 0) {
          setAuthors(result.data.authors);
        }
        setYear(result.data.year || '');
        setTitle(result.data.title || '');
        setJournalName(result.data.journalName || '');
        setVolume(result.data.volume || '');
        setIssue(result.data.issue || '');
        setPages(result.data.pages || '');
        setDoi(result.data.doi || '');
        setUrl(result.data.url || '');
        
        toast.success('Metadata fetched successfully! Please review and edit fields as needed.');
      } else {
        toast.error(result.error || 'Failed to fetch DOI metadata');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Error fetching DOI:', error);
    } finally {
      setIsFetchingDOI(false);
    }
  };

  // Auto-fill from URL (Websites)
  const handleFetchURL = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!validateURL(urlInput)) {
      toast.error('Invalid URL format. Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsFetchingURL(true);
    try {
      const result = await fetchURLMetadata(urlInput);
      
      if (result.success && result.data) {
        // Populate form fields
        if (result.data.authors.length > 0) {
          setAuthors(result.data.authors);
        }
        setOrganisationAuthor(result.data.organisationAuthor || '');
        setYear(result.data.year || '');
        setTitle(result.data.title || '');
        setSiteName(result.data.siteName || '');
        setSponsor(result.data.sponsor || '');
        setUrl(result.data.url || '');
        
        // Set access date to today if not provided
        if (!accessDate) {
          const today = new Date();
          const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
          setAccessDate(today.toLocaleDateString('en-AU', options));
        }
        
        toast.success('Metadata fetched successfully! Please review and edit fields as needed.');
      } else {
        toast.error(result.error || 'Failed to fetch URL metadata');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Error fetching URL:', error);
    } finally {
      setIsFetchingURL(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredAuthors = authors.filter(a => a.firstName || a.lastName);
    
    let source: Source;
    
    switch (sourceType) {
      case 'book':
        source = {
          type: 'book',
          authors: filteredAuthors,
          year,
          title,
          publisher,
          location,
          edition,
          doi,
          url
        };
        break;
      case 'journal':
        source = {
          type: 'journal',
          authors: filteredAuthors,
          year,
          title,
          journalName,
          volume,
          issue,
          pages,
          doi,
          url
        };
        break;
      case 'website':
        source = {
          type: 'website',
          authors: filteredAuthors,
          organisationAuthor,
          year,
          title,
          siteName,
          sponsor: sponsor || undefined,
          accessDate,
          url
        };
        break;
      case 'ai':
        source = {
          type: 'ai',
          company,
          year,
          productName,
          modelType,
          retrievedDate,
          url: aiUrl
        };
        break;
    }
    
    onGenerate(style, source);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Style & Source Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="style" className="text-sm font-medium">Referencing Style</Label>
          <Select value={style} onValueChange={(v) => setStyle(v as ReferenceStyle)}>
            <SelectTrigger id="style" className="bg-background">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apa7">APA 7th Edition</SelectItem>
              <SelectItem value="harvard">Harvard (UNSW)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sourceType" className="text-sm font-medium">Source Type</Label>
          <Select value={sourceType} onValueChange={(v) => setSourceType(v as SourceType)}>
            <SelectTrigger id="sourceType" className="bg-background">
              <SelectValue placeholder="Select source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="journal">Journal Article</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="ai">Generative AI</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Auto-fill from DOI (Journal) - Moved before Authors */}
      {sourceType === 'journal' && (
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Download className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Auto-fill from DOI</Label>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter DOI (e.g., 10.1000/xyz123 or https://doi.org/10.1000/xyz123)"
              value={doiInput}
              onChange={(e) => setDoiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFetchDOI();
                }
              }}
              className="bg-background flex-1"
              disabled={isFetchingDOI}
            />
            <Button
              type="button"
              onClick={handleFetchDOI}
              disabled={isFetchingDOI || !doiInput.trim()}
              className="shrink-0"
            >
              {isFetchingDOI ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Fetch Details
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enter a DOI to automatically populate fields. You can edit any field after fetching.
          </p>
        </div>
      )}

      {/* Auto-fill from URL (Website) - Moved before Authors */}
      {sourceType === 'website' && (
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Download className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Auto-fill from URL</Label>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter article URL (e.g., https://example.com/article)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFetchURL();
                }
              }}
              className="bg-background flex-1"
              disabled={isFetchingURL}
            />
            <Button
              type="button"
              onClick={handleFetchURL}
              disabled={isFetchingURL || !urlInput.trim()}
              className="shrink-0"
            >
              {isFetchingURL ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Fetch Details
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enter a webpage URL to automatically populate fields. You can edit any field after fetching.
          </p>
        </div>
      )}

      {/* Authors Section (not shown for AI sources) */}
      {sourceType !== 'ai' && (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Authors
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addAuthor} className="h-8">
            <Plus className="h-3 w-3 mr-1" />
            Add Author
          </Button>
        </div>
        
        <div className="space-y-2">
          {authors.map((author, index) => (
            <div key={index} className="flex gap-2 items-start animate-fade-in">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  placeholder="First name"
                  value={author.firstName}
                  onChange={(e) => updateAuthor(index, 'firstName', e.target.value)}
                  className="bg-background"
                />
                <Input
                  placeholder="Last name"
                  value={author.lastName}
                  onChange={(e) => updateAuthor(index, 'lastName', e.target.value)}
                  className="bg-background"
                />
              </div>
              {authors.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAuthor(index)}
                  className="h-10 w-10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {sourceType === 'website' && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="orgAuthor" className="text-xs text-muted-foreground">Or Organisation as Author</Label>
            <Input
              id="orgAuthor"
              placeholder="e.g., Department of Health"
              value={organisationAuthor}
              onChange={(e) => setOrganisationAuthor(e.target.value)}
              className="bg-background"
            />
          </div>
        )}
      </div>
      )}

      {/* Common Fields (not shown for AI sources) */}
      {sourceType !== 'ai' && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium">Year</Label>
          <Input
            id="year"
            placeholder="e.g., 2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Leave blank for "n.d." (no date)</p>
        </div>
        
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title" className="text-sm font-medium">Title</Label>
          <Input
            id="title"
            placeholder="Enter the full title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background"
            required
          />
        </div>
      </div>
      )}

      {/* Book-specific Fields */}
      {sourceType === 'book' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="publisher" className="text-sm font-medium">Publisher</Label>
            <Input
              id="publisher"
              placeholder="e.g., Oxford University Press"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="bg-background"
              required
            />
          </div>
          
          {style === 'harvard' && (
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Place of Publication</Label>
              <Input
                id="location"
                placeholder="e.g., Melbourne"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="edition" className="text-sm font-medium">Edition (optional)</Label>
            <Input
              id="edition"
              placeholder="e.g., 2nd"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doi" className="text-sm font-medium">DOI (preferred) or URL</Label>
            <Input
              id="doi"
              placeholder="e.g., 10.1000/xyz123"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
      )}

      {/* Journal-specific Fields */}
      {sourceType === 'journal' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="journalName" className="text-sm font-medium">Journal Name</Label>
              <Input
                id="journalName"
                placeholder="e.g., Educational Psychology"
                value={journalName}
                onChange={(e) => setJournalName(e.target.value)}
                className="bg-background"
                required
              />
            </div>
          
          <div className="space-y-2">
            <Label htmlFor="volume" className="text-sm font-medium">Volume</Label>
            <Input
              id="volume"
              placeholder="e.g., 28"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issue" className="text-sm font-medium">Issue (optional)</Label>
            <Input
              id="issue"
              placeholder="e.g., 3"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pages" className="text-sm font-medium">Pages</Label>
            <Input
              id="pages"
              placeholder="e.g., 253-265"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="journalDoi" className="text-sm font-medium">DOI</Label>
            <Input
              id="journalDoi"
              placeholder="e.g., 10.1207/s15326985ep2803_5"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
        </div>
      )}

      {/* Website-specific Fields */}
      {sourceType === 'website' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-sm font-medium">Website/Site Name</Label>
              <Input
                id="siteName"
                placeholder="e.g., UNSW Sydney"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sponsor" className="text-sm font-medium">Sponsor (optional)</Label>
              <Input
                id="sponsor"
                placeholder="e.g., Australian Government"
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">Name of sponsor of site</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessDate" className="text-sm font-medium">Access Date</Label>
              <Input
                id="accessDate"
                placeholder="e.g., 27 December 2024"
                value={accessDate}
                onChange={(e) => setAccessDate(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="websiteUrl" className="text-sm font-medium">URL</Label>
              <Input
                id="websiteUrl"
                placeholder="https://example.com/page"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-background"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* AI-specific Fields */}
      {sourceType === 'ai' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
              <Input
                id="company"
                placeholder="e.g., OpenAI"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-background"
                required
              />
              <p className="text-xs text-muted-foreground">The company that created the AI tool</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aiYear" className="text-sm font-medium">Year</Label>
              <Input
                id="aiYear"
                placeholder="e.g., 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-background"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g., ChatGPT"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="bg-background"
                required
              />
              <p className="text-xs text-muted-foreground">Name of the AI product</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modelType" className="text-sm font-medium">Type of AI Model</Label>
              <Input
                id="modelType"
                placeholder="e.g., Large language model"
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="bg-background"
                required
              />
              <p className="text-xs text-muted-foreground">The type of AI model (e.g., Large language model, Image generator)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retrievedDate" className="text-sm font-medium">Retrieved Date</Label>
              <Input
                id="retrievedDate"
                placeholder="e.g., October 19, 2023"
                value={retrievedDate}
                onChange={(e) => setRetrievedDate(e.target.value)}
                className="bg-background"
                required
              />
              <p className="text-xs text-muted-foreground">Format: Month Day, Year (e.g., October 19, 2023)</p>
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="aiUrl" className="text-sm font-medium">URL</Label>
              <Input
                id="aiUrl"
                placeholder="https://chat.openai.com/chat"
                value={aiUrl}
                onChange={(e) => setAiUrl(e.target.value)}
                className="bg-background"
                required
              />
              <p className="text-xs text-muted-foreground">URL where the AI tool can be accessed</p>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full font-semibold h-11">
        Generate Reference
      </Button>
    </form>
  );
}
