

import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SCHEMA_SWITCH_NAMES } from '@/lib/constants';

interface SchemaSwitchItem {
  name: string;
  states?: string[];
  reset?: number;
}

interface SwitchesEditorProps {
  switches: SchemaSwitchItem[];
  values: Record<string, number>;
  onChange: (name: string, reset: number) => void;
}

export function SwitchesEditor({ switches, values, onChange }: SwitchesEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">功能开关</CardTitle>
        <CardDescription>设置各功能的默认状态</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {switches
          .filter((s) => s.name !== 'ascii_mode') // ascii_mode is handled by switch key
          .map((sw) => {
            const currentReset = values[sw.name] ?? sw.reset ?? 0;
            const isOn = currentReset === 1;
            const label = SCHEMA_SWITCH_NAMES[sw.name] || sw.name;
            const states = sw.states || ['关', '开'];
            return (
              <div key={sw.name} className="flex items-center justify-between">
                <div>
                  <Label>{label}</Label>
                  <p className="text-xs text-muted-foreground">
                    {states[0]} / {states[1]}
                  </p>
                </div>
                <Switch
                  checked={isOn}
                  onCheckedChange={(checked) =>
                    onChange(sw.name, checked ? 1 : 0)
                  }
                />
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
