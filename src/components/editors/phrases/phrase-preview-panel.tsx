

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { serializeCustomPhrases } from '@/lib/phrases/serializer';
import type { CustomPhrase } from '@/types/phrases';

interface PhrasePreviewPanelProps {
  header: string;
  entries: CustomPhrase[];
}

export function PhrasePreviewPanel({ header, entries }: PhrasePreviewPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const previewText = useMemo(
    () => serializeCustomPhrases({ header, entries }),
    [header, entries]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-md border border-r-0 border-neon-cyan/30 bg-card px-1.5 py-3 text-xs text-neon-cyan hover:bg-neon-cyan/10 neon-glow-cyan"
        title="显示文件预览"
      >
        {'<'}
      </button>
    );
  }

  return (
    <div className="flex h-full w-80 flex-col border-l border-neon-cyan/20 bg-card">
      <div className="flex items-center justify-between border-b border-neon-cyan/20 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse"></span>
          <span className="font-mono text-sm font-medium text-neon-cyan">TXT 预览</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-neon-cyan/80 hover:text-neon-cyan hover:bg-neon-cyan/10"
            onClick={handleCopy}
          >
            {copied ? '已复制' : '复制'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setIsOpen(false)}
          >
            隐藏
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto bg-background/50">
        <pre
          className={cn(
            'p-3 text-xs leading-relaxed font-mono',
            'neon-text-green'
          )}
        >
          <code>{previewText}</code>
        </pre>
      </div>
    </div>
  );
}
