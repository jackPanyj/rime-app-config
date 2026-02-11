

import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FUZZY_PINYIN_GROUPS } from '@/lib/constants';

interface FuzzyPinyinEditorProps {
  /** The full algebra array from the base schema */
  baseAlgebra: string[];
  /** Currently enabled fuzzy rules (derive strings) */
  enabledRules: Set<string>;
  /** Toggle a fuzzy rule pair on/off */
  onToggle: (derive: string, reverse: string, enabled: boolean) => void;
}

export function FuzzyPinyinEditor({
  baseAlgebra: _baseAlgebra,
  enabledRules,
  onToggle,
}: FuzzyPinyinEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">模糊音</CardTitle>
        <CardDescription>
          启用模糊音后，相近的声母或韵母可以互相替代输入
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(FUZZY_PINYIN_GROUPS).map(([groupKey, group]) => (
          <div key={groupKey}>
            <Label className="text-sm font-medium">{group.label}</Label>
            <div className="mt-2 space-y-3">
              {group.rules.map((rule) => {
                // Check if this fuzzy rule pair is enabled
                // In the base file, commented rules start with "# - derive/"
                // An enabled rule means the derive line exists uncommented in the algebra
                const isEnabled =
                  enabledRules.has(rule.derive) && enabledRules.has(rule.reverse);
                return (
                  <div
                    key={`${rule.from}-${rule.to}`}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {rule.from} ↔ {rule.to}
                    </span>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        onToggle(rule.derive, rule.reverse, checked)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
