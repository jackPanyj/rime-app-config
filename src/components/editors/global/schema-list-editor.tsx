

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface SchemaInfo {
  schemaId: string;
  name: string;
}

interface SchemaListEditorProps {
  value: { schema: string }[];
  availableSchemas: SchemaInfo[];
  onChange: (value: { schema: string }[]) => void;
}

export function SchemaListEditor({ value, availableSchemas, onChange }: SchemaListEditorProps) {
  const selectedIds = new Set(value.map((s) => s.schema));

  const toggle = (schemaId: string) => {
    if (selectedIds.has(schemaId)) {
      onChange(value.filter((s) => s.schema !== schemaId));
    } else {
      onChange([...value, { schema: schemaId }]);
    }
  };

  // Move a schema up in the list
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...value];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    onChange(newList);
  };

  // Move a schema down in the list
  const moveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newList = [...value];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    onChange(newList);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">输入方案</CardTitle>
        <CardDescription>选择启用的输入方案，勾选后可拖动排序</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Selected schemas with reorder */}
        {value.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">已启用（按顺序）</Label>
            {value.map((item, index) => {
              const info = availableSchemas.find((s) => s.schemaId === item.schema);
              return (
                <div
                  key={item.schema}
                  className="flex items-center gap-2 rounded-md border px-3 py-2"
                >
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => toggle(item.schema)}
                  />
                  <span className="flex-1 text-sm">
                    {info?.name || item.schema}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.schema}</span>
                  <div className="flex gap-1">
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                      onClick={() => moveDown(index)}
                      disabled={index === value.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Available but not selected */}
        {availableSchemas.filter((s) => !selectedIds.has(s.schemaId)).length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">可用方案</Label>
            {availableSchemas
              .filter((s) => !selectedIds.has(s.schemaId))
              .map((schema) => (
                <div
                  key={schema.schemaId}
                  className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2"
                >
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => toggle(schema.schemaId)}
                  />
                  <span className="flex-1 text-sm">{schema.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {schema.schemaId}
                  </span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
