import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, BookOpen, MessageSquareQuote } from 'lucide-react';
import type { ReferenceOutput as ReferenceOutputType } from '@/lib/referencing/types';

interface ReferenceOutputProps {
  output: ReferenceOutputType | null;
  styleName: string;
}

export function ReferenceOutput({ output, styleName }: ReferenceOutputProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!output) {
    return (
      <div className="output-section">
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">Your reference will appear here</p>
          <p className="text-sm mt-1">Fill in the form and click "Generate Reference"</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string, field: string) => {
    // Strip HTML tags and decode HTML entities for clipboard
    let plainText = text.replace(/<\/?i>/g, '');
    // Decode HTML entities (like &lt; and &gt;) back to < and >
    plainText = plainText.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    await navigator.clipboard.writeText(plainText);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="output-section space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="text-sm font-medium text-muted-foreground">{styleName} Format</span>
      </div>
      
      {/* Reference List Entry */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Reference List Entry
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(output.referenceList, 'reference')}
            className="copy-button h-8"
          >
            {copiedField === 'reference' ? (
              <>
                <Check className="h-3 w-3 mr-1.5 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1.5" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div 
          className="citation-preview reference-output text-base"
          dangerouslySetInnerHTML={{ __html: output.referenceList }}
        />
      </div>

      {/* In-text Citations */}
      <div className="space-y-4">
        <label className="text-sm font-semibold flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-primary" />
          In-text Citations
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Parenthetical */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Parenthetical</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(output.inTextParenthetical, 'parenthetical')}
                className="copy-button h-7 px-2"
              >
                {copiedField === 'parenthetical' ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="citation-preview text-sm font-mono">
              {output.inTextParenthetical}
            </div>
          </div>
          
          {/* Narrative */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Narrative</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(output.inTextNarrative, 'narrative')}
                className="copy-button h-7 px-2"
              >
                {copiedField === 'narrative' ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="citation-preview text-sm font-mono">
              {output.inTextNarrative}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
