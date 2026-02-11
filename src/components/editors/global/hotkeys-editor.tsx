

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SWITCHER_HOTKEYS } from '@/lib/constants';

interface HotkeysEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const HOTKEY_LABELS: Record<string, string> = {
  'F4': 'F4',
  'Control+grave': 'Ctrl + `',
  'Control+Shift+grave': 'Ctrl + Shift + `',
  'Alt+grave': 'Alt + `',
};

export function HotkeysEditor({ value, onChange }: HotkeysEditorProps) {
  const toggle = (hotkey: string) => {
    if (value.includes(hotkey)) {
      onChange(value.filter((h) => h !== hotkey));
    } else {
      onChange([...value, hotkey]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">方案选单快捷键</CardTitle>
        <CardDescription>呼出方案切换菜单的快捷键</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {SWITCHER_HOTKEYS.map((hotkey) => (
          <div key={hotkey} className="flex items-center gap-3">
            <Checkbox
              id={`hotkey-${hotkey}`}
              checked={value.includes(hotkey)}
              onCheckedChange={() => toggle(hotkey)}
            />
            <Label htmlFor={`hotkey-${hotkey}`} className="text-sm font-normal">
              {HOTKEY_LABELS[hotkey] || hotkey}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
