

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface LayoutEditorProps {
  layout: 'stacked' | 'linear';
  inlinePreedit: boolean;
  cornerRadius: number;
  borderHeight: number;
  borderWidth: number;
  lineSpacing: number;
  spacing: number;
  fontFace: string;
  fontPoint: number;
  onLayoutChange: (value: 'stacked' | 'linear') => void;
  onInlinePreeditChange: (value: boolean) => void;
  onCornerRadiusChange: (value: number) => void;
  onBorderHeightChange: (value: number) => void;
  onBorderWidthChange: (value: number) => void;
  onLineSpacingChange: (value: number) => void;
  onSpacingChange: (value: number) => void;
  onFontFaceChange: (value: string) => void;
  onFontPointChange: (value: number) => void;
}

export function LayoutEditor(props: LayoutEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">布局与字体</CardTitle>
        <CardDescription>候选框的布局样式和字体设置</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Layout */}
        <div className="flex items-center justify-between">
          <Label>排列方式</Label>
          <Select value={props.layout} onValueChange={(v) => props.onLayoutChange(v as 'stacked' | 'linear')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stacked">竖排 (stacked)</SelectItem>
              <SelectItem value="linear">横排 (linear)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inline preedit */}
        <div className="flex items-center justify-between">
          <div>
            <Label>内嵌编码</Label>
            <p className="text-xs text-muted-foreground">拼音显示在光标位置</p>
          </div>
          <Switch
            checked={props.inlinePreedit}
            onCheckedChange={props.onInlinePreeditChange}
          />
        </div>

        {/* Corner radius */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>圆角半径</Label>
            <span className="text-sm text-muted-foreground">{props.cornerRadius}px</span>
          </div>
          <Slider
            value={[props.cornerRadius]}
            onValueChange={([v]) => props.onCornerRadiusChange(v)}
            min={0}
            max={20}
            step={1}
          />
        </div>

        {/* Line spacing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>行间距</Label>
            <span className="text-sm text-muted-foreground">{props.lineSpacing}px</span>
          </div>
          <Slider
            value={[props.lineSpacing]}
            onValueChange={([v]) => props.onLineSpacingChange(v)}
            min={0}
            max={20}
            step={1}
          />
        </div>

        {/* Font */}
        <div className="flex items-center justify-between gap-4">
          <Label className="shrink-0">字体</Label>
          <Input
            value={props.fontFace}
            onChange={(e) => props.onFontFaceChange(e.target.value)}
            placeholder="如 PingFangSC"
            className="w-48"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label className="shrink-0">字号</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[props.fontPoint]}
              onValueChange={([v]) => props.onFontPointChange(v)}
              min={10}
              max={28}
              step={1}
              className="w-32"
            />
            <span className="w-8 text-sm text-right">{props.fontPoint}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
