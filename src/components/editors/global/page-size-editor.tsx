

import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PageSizeEditorProps {
  value: number;
  onChange: (value: number) => void;
}

export function PageSizeEditor({ value, onChange }: PageSizeEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">候选词数量</CardTitle>
        <CardDescription>每页显示的候选词个数（1-9）</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Slider
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={1}
            max={9}
            step={1}
            className="flex-1"
          />
          <span className="w-8 text-center text-2xl font-semibold">{value}</span>
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>5</span>
          <span>9</span>
        </div>
      </CardContent>
    </Card>
  );
}
