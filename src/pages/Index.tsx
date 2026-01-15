import { useState } from 'react';
import { ReferenceForm } from '@/components/ReferenceForm';
import { ReferenceOutput } from '@/components/ReferenceOutput';
import { ReferenceGuide } from '@/components/ReferenceGuide';
import { generateReference } from '@/lib/referencing/formatters';
import type { ReferenceOutput as ReferenceOutputType, ReferenceStyle, Source, SourceType } from '@/lib/referencing/types';
import { BookText, ExternalLink, Info } from 'lucide-react';

const styleNames: Record<ReferenceStyle, string> = {
  apa7: 'APA 7th Edition',
  harvard: 'Harvard (UNSW)'
};

const Index = () => {
  const [output, setOutput] = useState<ReferenceOutputType | null>(null);
  const [currentStyle, setCurrentStyle] = useState<ReferenceStyle>('apa7');
  const [currentSourceType, setCurrentSourceType] = useState<SourceType>('book');

  const handleGenerate = (style: ReferenceStyle, source: Source) => {
    const result = generateReference(style, source);
    setOutput(result);
    setCurrentStyle(style);
    setCurrentSourceType(source.type); // Track source type for guide display
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <BookText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">UNSW Reference Generator</h1>
              <p className="text-xs text-muted-foreground">Generate accurate citations for your academic work</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Verified UNSW Requirements</p>
              <p className="text-muted-foreground">
                This tool follows UNSW Library's official referencing guides. Always verify with your course convenor for specific requirements.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <a 
                  href="https://unsw.edu.au/student/managing-your-studies/academic-skills-support/toolkit/referencing/apa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  APA 7th Guide <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="https://unsw.edu.au/student/managing-your-studies/academic-skills-support/toolkit/referencing/harvard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Harvard Guide <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="form-section">
            <h2 className="text-lg font-display font-semibold mb-6">Source Details</h2>
            <ReferenceForm onGenerate={handleGenerate} />
          </div>

          {/* Output Section */}
          <div>
            <h2 className="text-lg font-display font-semibold mb-6">Generated Reference</h2>
            <ReferenceOutput output={output} styleName={styleNames[currentStyle]} />
            <ReferenceGuide style={currentStyle} sourceType={currentSourceType} />
          </div>
        </div>

        {/* Limitations & Notes */}
        <section className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
          <h3 className="font-display font-semibold text-base mb-4">Supported Source Types & Limitations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">✓ Books</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Print and e-books</li>
                <li>• Single and multiple authors</li>
                <li>• Editions supported</li>
                <li>• DOI/URL optional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">✓ Journal Articles</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Print and online journals</li>
                <li>• Volume, issue, pages</li>
                <li>• DOI preferred over URL</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">✓ Websites</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Individual or org authors</li>
                <li>• Access date required</li>
                <li>• "n.d." for missing dates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">✓ Generative AI</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• ChatGPT, Claude, etc.</li>
                <li>• Company & product name</li>
                <li>• Retrieved date required</li>
                <li>• UNSW Harvard format</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border">
            <strong>Note:</strong> IEEE and Vancouver styles are not included as UNSW's official toolkit focuses on APA and Harvard. 
            For other styles, consult your faculty's specific guidelines.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for UNSW students. Not an official UNSW tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
