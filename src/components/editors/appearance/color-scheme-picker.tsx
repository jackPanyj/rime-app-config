

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ColorSchemeInfo {
  id: string;
  name: string;
  backColor: string;
  textColor: string;
  candidateTextColor: string;
  hilitedCandidateTextColor: string;
  hilitedCandidateBackColor: string;
}

interface ColorSchemePickerProps {
  schemes: ColorSchemeInfo[];
  selected: string;
  onSelect: (id: string) => void;
  label?: string;
}

export function ColorSchemePicker({
  schemes,
  selected,
  onSelect,
  label = '配色方案',
}: ColorSchemePickerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription>选择候选框的配色方案</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {schemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => onSelect(scheme.id)}
              className={cn(
                'rounded-lg border-2 p-2 text-left transition-all hover:shadow-md',
                selected === scheme.id
                  ? 'border-primary shadow-sm'
                  : 'border-transparent hover:border-border'
              )}
            >
              {/* Mini preview */}
              <div
                className="rounded-md p-2 text-xs leading-relaxed"
                style={{ backgroundColor: scheme.backColor }}
              >
                <div
                  className="truncate"
                  style={{ color: scheme.candidateTextColor }}
                >
                  1. 你好
                </div>
                <div
                  className="mt-0.5 rounded px-1 truncate"
                  style={{
                    color: scheme.hilitedCandidateTextColor,
                    backgroundColor: scheme.hilitedCandidateBackColor,
                  }}
                >
                  2. 世界
                </div>
                <div
                  className="mt-0.5 truncate"
                  style={{ color: scheme.candidateTextColor }}
                >
                  3. 测试
                </div>
              </div>
              <p className="mt-1.5 text-xs font-medium truncate">
                {scheme.name}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
