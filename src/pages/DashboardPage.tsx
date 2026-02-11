import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Layers, Sliders, Zap } from 'lucide-react';

interface HealthData {
  platform: string;
  configDir: string;
  configDirExists: boolean;
  installation?: {
    distributionName: string;
    distributionVersion: string;
    rimeVersion: string;
    installTime: string;
  };
}

interface SchemaInfo {
  schemaId: string;
  name: string;
  version: string;
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [schemas, setSchemas] = useState<SchemaInfo[]>([]);
  const [defaultConfig, setDefaultConfig] = useState<Record<string, unknown>>({});

  useEffect(() => {
    invoke<HealthData>('get_health').then(setHealth);
    invoke<{ schemas: SchemaInfo[] }>('get_schemas').then((d) => setSchemas(d.schemas));
    invoke<{ base: Record<string, unknown>; customPatch: Record<string, unknown> }>('read_config', {
      basename: 'default',
    }).then((d) => {
      // Merge base + custom to get effective config
      const merged = { ...d.base };
      for (const [k, v] of Object.entries(d.customPatch || {})) {
        if (k.includes('/')) {
          const parts = k.split('/');
          let cur = merged as Record<string, unknown>;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
            cur = cur[parts[i]] as Record<string, unknown>;
          }
          cur[parts[parts.length - 1]] = v;
        } else {
          merged[k] = v;
        }
      }
      setDefaultConfig(merged);
    });
  }, []);

  const installation = health?.installation;
  const schemaList = (defaultConfig.schema_list as { schema: string }[]) || [];
  const pageSize = ((defaultConfig.menu as Record<string, unknown>)?.page_size as number) || 5;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold neon-text-cyan tracking-wider">
          系统终端
        </h2>
        <p className="mt-2 text-sm text-muted-foreground font-mono">
          &gt; RIME INPUT METHOD // SYSTEM STATUS
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Installation Info */}
        <Card className="neon-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-cyan-400" />
              <CardTitle className="text-base font-display uppercase tracking-wide">
                [ 安装信息 ]
              </CardTitle>
            </div>
            <CardDescription className="font-mono text-xs">RIME ENGINE STATUS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {installation ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">前端</span>
                  <span className="font-mono">{installation.distributionName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">版本</span>
                  <span className="font-mono">{installation.distributionVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Rime 版本</span>
                  <span className="font-mono">{installation.rimeVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">配置目录</span>
                  <Badge
                    variant={health?.configDirExists ? 'secondary' : 'destructive'}
                    className={health?.configDirExists ? 'neon-glow-cyan bg-green-950/50 text-green-400 border-green-500' : 'bg-red-950/50 text-red-400 border-red-500'}
                  >
                    {health?.configDirExists ? '正常' : '未找到'}
                  </Badge>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground font-mono neon-text-cyan">LOADING...</p>
            )}
          </CardContent>
        </Card>

        {/* Active Schemas */}
        <Card className="neon-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <CardTitle className="text-base font-display uppercase tracking-wide">
                [ 激活方案 ]
              </CardTitle>
            </div>
            <CardDescription className="font-mono text-xs">ACTIVE INPUT SCHEMAS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {schemaList.map((s) => {
                const info = schemas.find((sc) => sc.schemaId === s.schema);
                return (
                  <Badge
                    key={s.schema}
                    variant="outline"
                    className="neon-border bg-cyan-950/30 text-cyan-300 border-cyan-500/50 font-mono text-xs"
                  >
                    {info?.name || s.schema}
                  </Badge>
                );
              })}
              {schemaList.length === 0 && (
                <p className="text-sm text-muted-foreground font-mono neon-text-cyan">LOADING...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Settings */}
        <Card className="neon-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <CardTitle className="text-base font-display uppercase tracking-wide">
                [ 关键设置 ]
              </CardTitle>
            </div>
            <CardDescription className="font-mono text-xs">KEY CONFIGURATION</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground font-mono">候选词数量</span>
              <span className="font-mono neon-text-cyan">{pageSize}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="neon-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <CardTitle className="text-base font-display uppercase tracking-wide">
              [ 快捷操作 ]
            </CardTitle>
          </div>
          <CardDescription className="font-mono text-xs">QUICK ACTIONS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="neon-border border-cyan-500/50 hover:bg-cyan-950/30 hover:text-cyan-300 font-mono"
            >
              <Link to="/global">编辑全局配置</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="neon-border border-cyan-500/50 hover:bg-cyan-950/30 hover:text-cyan-300 font-mono"
            >
              <Link to="/schema">管理输入方案</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="neon-border border-cyan-500/50 hover:bg-cyan-950/30 hover:text-cyan-300 font-mono"
            >
              <Link to="/appearance">调整外观主题</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="neon-border border-cyan-500/50 hover:bg-cyan-950/30 hover:text-cyan-300 font-mono"
            >
              <Link to="/phrases">管理自定义短语</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
