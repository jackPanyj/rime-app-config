

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useYamlSync } from '@/hooks/use-yaml-sync';
import { cn } from '@/lib/utils';

export function YamlPreviewPanel() {
  const yamlString = useYamlSync();
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yamlString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-md border border-r-0 border-neon-cyan/30 bg-card px-1.5 py-3 text-xs text-neon-cyan hover:bg-neon-cyan/10 neon-glow-cyan"
        title="显示 YAML 预览"
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
          <span className="font-mono text-sm font-medium text-neon-cyan">YAML 预览</span>
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
      <ScrollArea className="flex-1 bg-background/50">
        <pre
          className={cn(
            'p-3 text-xs leading-relaxed font-mono',
            'neon-text-green'
          )}
        >
          <code>{yamlString || 'patch: {}\n'}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
