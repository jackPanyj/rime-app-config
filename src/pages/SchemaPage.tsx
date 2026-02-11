import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { Cpu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SchemaInfo {
  schemaId: string;
  name: string;
  version: string;
  author: string[];
  description: string;
  switches: { name: string; states?: string[] }[];
  hasFuzzyPinyin: boolean;
}

export default function SchemaPage() {
  const [schemas, setSchemas] = useState<SchemaInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoke<{ schemas: SchemaInfo[] }>('get_schemas')
      .then((d) => {
        setSchemas(d.schemas);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-display neon-text-cyan">输入方案</h2>
        <p className="mt-2 text-sm text-muted-foreground font-mono">&gt; LOADING...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-display neon-text-cyan">输入方案</h2>
        <p className="mt-1 text-sm text-muted-foreground font-mono">
          &gt; SELECT INPUT SCHEMA
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schemas.map((schema) => (
          <Card
            key={schema.schemaId}
            className="neon-border hover:neon-glow-cyan transition-all cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{schema.name}</CardTitle>
                </div>
                {schema.version && (
                  <Badge variant="outline" className="text-[10px] neon-text-magenta">
                    v{schema.version}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs font-mono">
                {schema.schemaId}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-3">
                {schema.switches
                  .filter((s) => s.name !== 'ascii_mode')
                  .map((sw) => (
                    <Badge key={sw.name} variant="secondary" className="text-[10px]">
                      {sw.states ? sw.states.join('/') : sw.name}
                    </Badge>
                  ))}
                {schema.hasFuzzyPinyin && (
                  <Badge variant="secondary" className="text-[10px]">
                    模糊音
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/30 text-primary hover:bg-primary/10"
                asChild
              >
                <Link to={`/schema/${schema.schemaId}`}>编辑配置</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
