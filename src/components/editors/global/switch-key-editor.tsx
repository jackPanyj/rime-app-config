

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  SWITCH_KEY_OPTIONS,
  CAPS_LOCK_OPTIONS,
  SWITCH_KEY_NAMES,
} from '@/lib/constants';

interface SwitchKeyEditorProps {
  switchKeys: Record<string, string>;
  capsLock: boolean;
  onSwitchKeyChange: (key: string, value: string) => void;
  onCapsLockChange: (value: boolean) => void;
}

export function SwitchKeyEditor({
  switchKeys,
  capsLock,
  onSwitchKeyChange,
  onCapsLockChange,
}: SwitchKeyEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">中英文切换键</CardTitle>
        <CardDescription>
          设置各修饰键在输入过程中按下时的行为
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Caps Lock toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label>大写锁定键行为</Label>
            <p className="text-xs text-muted-foreground">
              true = 切换大写，false = 切换中英
            </p>
          </div>
          <Switch checked={capsLock} onCheckedChange={onCapsLockChange} />
        </div>

        {/* Switch keys */}
        {Object.entries(SWITCH_KEY_NAMES).map(([key, label]) => {
          const options = key === 'Caps_Lock' ? CAPS_LOCK_OPTIONS : SWITCH_KEY_OPTIONS;
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <Label className="min-w-[100px]">{label}</Label>
              <Select
                value={switchKeys[key] || 'noop'}
                onValueChange={(v) => onSwitchKeyChange(key, v)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
