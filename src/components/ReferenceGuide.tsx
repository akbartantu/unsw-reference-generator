import { Info, BookOpen } from 'lucide-react';
import type { ReferenceStyle, SourceType } from '@/lib/referencing/types';

interface ReferenceGuideProps {
  style: ReferenceStyle;
  sourceType: SourceType;
}

export function ReferenceGuide({ style, sourceType }: ReferenceGuideProps) {
  // Only show guide for Harvard style
  if (style !== 'harvard') {
    return null;
  }

  // Website guide
  if (sourceType === 'website') {
    return (
      <div className="mt-8 p-5 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              UNSW Harvard Format for Websites
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Verify your reference follows the correct structure according to UNSW guidelines:
            </p>
            
            {/* Structure */}
            <div className="mb-5 p-4 rounded-lg bg-background border border-border">
              <h4 className="font-semibold text-sm mb-3 text-foreground">Reference List Structure:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Author (the person or organisation responsible for the site)</li>
                <li>Year (date created or last updated)</li>
                <li>Page title (in italics)</li>
                <li>Name of sponsor of site (if available)</li>
                <li>Accessed day month year (the day you viewed the site)</li>
                <li>URL or Internet address (in pointed brackets)</li>
              </ol>
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-foreground">Example 1: One Author</h4>
                <div className="p-3 rounded bg-background border border-border text-sm font-mono text-muted-foreground">
                  Li, L 2014, <i>Chinese scroll painting H533</i>, Australian Museum, accessed 20 February 2016, &lt;https://australianmuseum.net.au/chinese-scroll-painting-h533&gt;.
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 text-foreground">Example 2: Organisation as Author</h4>
                <div className="p-3 rounded bg-background border border-border text-sm font-mono text-muted-foreground">
                  World Health Organisation 2013, <i>Financial crisis and global health</i>, The United Nations, accessed 1 August 2013, &lt;http://www.who.int/topics/financial_crisis/en/&gt;.
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 text-foreground">Example 3: No Author</h4>
                <div className="p-3 rounded bg-background border border-border text-sm font-mono text-muted-foreground">
                  <i>Land for sale on moon</i> 2007, accessed 19 June 2007, &lt;http://www.moonlandrealestate.com&gt;.
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>In-text citations:</strong> Use author/authoring body name(s) and the date: (Li 2004) or (World Health Organisation 2013). 
                If no author, use the page title: (Land for sale on moon 2007).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Journal article guide
  if (sourceType === 'journal') {
    return (
      <div className="mt-8 p-5 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              UNSW Harvard Format for Journal Articles
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Verify your reference follows the correct structure according to UNSW guidelines:
            </p>
            
            {/* Structure */}
            <div className="mb-5 p-4 rounded-lg bg-background border border-border">
              <h4 className="font-semibold text-sm mb-3 text-foreground">Reference List Structure:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Author's surname and initial</li>
                <li>Year of publication</li>
                <li>Title of the article (between single quotation marks with minimal capitalisation)</li>
                <li>Title of the journal (in italic font using maximum capitalisation)</li>
                <li>Volume number (vol.)</li>
                <li>Issue number (no.)</li>
                <li>Page range of the article (pp.)</li>
                <li>DOI (Digital Object Identifier), if available</li>
              </ol>
            </div>

            {/* Example */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2 text-foreground">Example:</h4>
              <div className="p-3 rounded bg-background border border-border text-sm font-mono text-muted-foreground">
                Kozulin, A 1993, 'Literature as a psychological tool', <i>Educational Psychologist</i>, vol. 28, no. 3, pp. 253-265, DOI:10.1207/s15326985ep2803_5.
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                <strong>In-text citations:</strong>
              </p>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside ml-2">
                <li><strong>One to three authors:</strong> Include all names: (Gerster & Basset 1987) or Gerster and Basset (1987)</li>
                <li><strong>More than three authors:</strong> Use first author et al.: (Leeder et al. 1996) or Leeder et al. (1996, p. 78)</li>
                <li><strong>With page number:</strong> (Kozulin 1993, p. 257) - for summarising, paraphrasing, or direct quoting</li>
                <li><strong>Main idea only:</strong> (Kozulin 1993) - no page number needed</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                <strong>Note:</strong> In the reference list, <em>all</em> authors are listed (no et al.), even when there are more than three authors.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI guide
  if (sourceType === 'ai') {
    return (
      <div className="mt-8 p-5 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              UNSW Harvard Format for Generative AI Tools
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              When quoting, paraphrasing or summarising an AI tool's output, you must include the company name and date. 
              Reference: <a href="https://www.unsw.edu.au/student/managing-your-studies/academic-skills-support/toolkit/referencing/harvard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">UNSW Harvard Referencing Guide</a>
            </p>
            
            {/* Structure */}
            <div className="mb-5 p-4 rounded-lg bg-background border border-border">
              <h4 className="font-semibold text-sm mb-3 text-foreground">Reference List Structure:</h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Company name</li>
                <li>Year</li>
                <li>Product Name (in italics)</li>
                <li>Type of AI model (in square brackets)</li>
                <li>Retrieved Month Day, Year</li>
                <li>URL</li>
              </ol>
            </div>

            {/* Example */}
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2 text-foreground">Example:</h4>
              <div className="p-3 rounded bg-background border border-border text-sm font-mono text-muted-foreground">
                OpenAI. 2023, <i>ChatGPT</i>, [Large language model], Retrieved October 19, 2023, from https://chat.openai.com/chat.
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                <strong>In-text citations:</strong>
              </p>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside ml-2">
                <li><strong>Quoting:</strong> ChatGPT highlights that "zombies [...] are often seen as a manifestation of cultural anxieties" (OpenAI 2023).</li>
                <li><strong>Paraphrasing:</strong> ChatGPT indicates that zombies are metaphorically used to represent societal issues (OpenAI 2023).</li>
                <li><strong>Summarising:</strong> A synthesis of discussions on ChatGPT suggests that zombies are portrayed as reflections of human characteristics (OpenAI 2023).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

