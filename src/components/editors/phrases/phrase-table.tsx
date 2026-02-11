

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Trash2 } from 'lucide-react';
import type { CustomPhrase } from '@/types/phrases';

interface PhraseTableProps {
  entries: CustomPhrase[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdd: (entry: CustomPhrase) => void;
  onUpdate: (id: string, updates: Partial<Omit<CustomPhrase, 'id'>>) => void;
  onRemove: (id: string) => void;
}

export function PhraseTable({
  entries,
  searchQuery,
  onSearchChange,
  onAdd,
  onUpdate,
  onRemove,
}: PhraseTableProps) {
  const [newPhrase, setNewPhrase] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const phraseInputRef = useRef<HTMLInputElement>(null);

  const filtered = searchQuery
    ? entries.filter(
        (e) =>
          e.phrase.includes(searchQuery) || e.code.includes(searchQuery)
      )
    : entries;

  const handleAdd = useCallback(() => {
    if (!newPhrase.trim() || !newCode.trim()) return;

    const entry: CustomPhrase = {
      id: crypto.randomUUID(),
      phrase: newPhrase.trim(),
      code: newCode.trim(),
    };
    const w = parseInt(newWeight, 10);
    if (!isNaN(w)) entry.weight = w;

    onAdd(entry);
    setNewPhrase('');
    setNewCode('');
    setNewWeight('');
    phraseInputRef.current?.focus();
  }, [newPhrase, newCode, newWeight, onAdd]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">自定义短语</CardTitle>
            <CardDescription>
              管理 custom_phrase.txt，共 {entries.length} 条短语
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索短语或编码..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Add form */}
        <div className="flex min-w-0 items-center gap-2 rounded-md border border-dashed px-3 py-2">
          <Input
            ref={phraseInputRef}
            placeholder="短语"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 flex-[2]"
          />
          <Input
            placeholder="编码"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 flex-[2]"
          />
          <Input
            placeholder="权重"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 w-20 flex-none"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={!newPhrase.trim() || !newCode.trim()}
            className="h-8 flex-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Entry list */}
        {filtered.length === 0 ? (
          <div className="rounded-md border border-dashed px-6 py-8 text-center text-sm text-muted-foreground">
            {searchQuery
              ? '没有匹配的短语'
              : '暂无自定义短语，在上方添加你的第一条短语'}
          </div>
        ) : (
          <div className="max-h-[calc(100vh-360px)] overflow-auto">
            <div className="space-y-1">
              {filtered.map((entry) => (
                <PhraseRow
                  key={entry.id}
                  entry={entry}
                  isEditing={editingId === entry.id}
                  onStartEdit={() => setEditingId(entry.id)}
                  onStopEdit={() => setEditingId(null)}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PhraseRowProps {
  entry: CustomPhrase;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onUpdate: (id: string, updates: Partial<Omit<CustomPhrase, 'id'>>) => void;
  onRemove: (id: string) => void;
}

function PhraseRow({ entry, isEditing, onStartEdit, onStopEdit, onUpdate, onRemove }: PhraseRowProps) {
  const [editPhrase, setEditPhrase] = useState(entry.phrase);
  const [editCode, setEditCode] = useState(entry.code);
  const [editWeight, setEditWeight] = useState(entry.weight != null ? String(entry.weight) : '');

  const commitEdit = () => {
    if (!editPhrase.trim() || !editCode.trim()) {
      // Revert on empty
      setEditPhrase(entry.phrase);
      setEditCode(entry.code);
      setEditWeight(entry.weight != null ? String(entry.weight) : '');
      onStopEdit();
      return;
    }

    const updates: Partial<Omit<CustomPhrase, 'id'>> = {
      phrase: editPhrase.trim(),
      code: editCode.trim(),
    };
    const w = parseInt(editWeight, 10);
    updates.weight = isNaN(w) ? undefined : w;

    onUpdate(entry.id, updates);
    onStopEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      setEditPhrase(entry.phrase);
      setEditCode(entry.code);
      setEditWeight(entry.weight != null ? String(entry.weight) : '');
      onStopEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="flex min-w-0 items-center gap-2 rounded-md border border-neon-cyan/30 px-3 py-2 bg-neon-cyan/5">
        <Input
          value={editPhrase}
          onChange={(e) => setEditPhrase(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          className="h-7 flex-[2] text-sm"
          autoFocus
        />
        <Input
          value={editCode}
          onChange={(e) => setEditCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          className="h-7 flex-[2] text-sm"
        />
        <Input
          value={editWeight}
          onChange={(e) => setEditWeight(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          className="h-7 w-20 flex-none text-sm"
          placeholder="权重"
        />
        <div className="w-8 flex-none" />
      </div>
    );
  }

  return (
    <div
      className="flex min-w-0 items-center gap-3 rounded-md border px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onStartEdit}
    >
      <span className="min-w-0 flex-[2] truncate text-sm">{entry.phrase}</span>
      <span className="min-w-0 flex-[2] truncate text-sm font-mono text-muted-foreground">
        {entry.code}
      </span>
      <span className="w-20 flex-none text-right text-xs text-muted-foreground font-mono">
        {entry.weight != null ? entry.weight : ''}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-8 flex-none p-0 text-muted-foreground hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(entry.id);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
