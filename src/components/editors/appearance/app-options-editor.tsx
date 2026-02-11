

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface AppOptionsEditorProps {
  options: Record<string, { ascii_mode?: boolean }>;
  onChange: (options: Record<string, { ascii_mode?: boolean }>) => void;
}

export function AppOptionsEditor({ options, onChange }: AppOptionsEditorProps) {
  const [newBundleId, setNewBundleId] = useState('');

  const entries = Object.entries(options).map(([bundleId, opt]) => ({
    bundleId,
    asciiMode: opt.ascii_mode ?? false,
  }));

  const handleToggle = (bundleId: string, asciiMode: boolean) => {
    onChange({ ...options, [bundleId]: { ascii_mode: asciiMode } });
  };

  const handleRemove = (bundleId: string) => {
    const newOptions = { ...options };
    delete newOptions[bundleId];
    onChange(newOptions);
  };

  const handleAdd = () => {
    if (!newBundleId.trim()) return;
    onChange({ ...options, [newBundleId.trim()]: { ascii_mode: true } });
    setNewBundleId('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">应用选项</CardTitle>
        <CardDescription>
          为特定应用设置默认英文模式（Bundle ID）
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.bundleId}
            className="flex items-center gap-3 rounded-md border px-3 py-2"
          >
            <span className="flex-1 text-sm font-mono">{entry.bundleId}</span>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">默认英文</Label>
              <Switch
                checked={entry.asciiMode}
                onCheckedChange={(checked) =>
                  handleToggle(entry.bundleId, checked)
                }
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
              onClick={() => handleRemove(entry.bundleId)}
            >
              删除
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="com.example.app"
            value={newBundleId}
            onChange={(e) => setNewBundleId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="font-mono"
          />
          <Button variant="outline" size="sm" onClick={handleAdd}>
            添加
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
