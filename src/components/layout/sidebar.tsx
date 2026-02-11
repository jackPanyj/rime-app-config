import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Keyboard, Palette, MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/', label: '仪表盘', icon: Home },
  { href: '/global', label: '全局配置', icon: Settings, configName: 'default' },
  { href: '/schema', label: '输入方案', icon: Keyboard, configName: 'schema' },
  { href: '/appearance', label: '外观主题', icon: Palette, configName: 'squirrel' },
  { href: '/phrases', label: '自定义短语', icon: MessageSquareText },
];

interface SidebarProps {
  configDir?: string;
  dirtyConfigs?: Set<string>;
}

export function Sidebar({ configDir, dirtyConfigs }: SidebarProps) {
  const { pathname } = useLocation();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-cyan-500/30 bg-[#0d0d1a]">
      {/* Header with HUD-style decorative elements */}
      <div className="relative flex h-14 items-center border-b border-cyan-500/30 px-4">
        {/* Top-left corner bracket */}
        <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-cyan-500/60"></div>
        {/* Top-right corner bracket */}
        <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-cyan-500/60"></div>

        <h1 className="font-display text-lg font-bold tracking-wider neon-text-cyan">
          RIME
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const isDirty = item.configName && dirtyConfigs?.has(item.configName);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded px-3 py-2 text-sm font-mono transition-all',
                isActive
                  ? 'neon-text-cyan neon-glow-cyan bg-cyan-500/10 font-medium border border-cyan-500/50'
                  : 'text-muted-foreground border border-transparent hover:bg-cyan-500/5 hover:text-cyan-400 hover:border-cyan-500/30'
              )}
            >
              {/* Active indicator line */}
              {isActive && (
                <div className="absolute left-0 top-1/2 h-1/2 w-0.5 -translate-y-1/2 bg-cyan-500 neon-glow-cyan"></div>
              )}

              <Icon className={cn("h-4 w-4", isActive && "animate-pulse")} />
              <span className="flex-1">{item.label}</span>

              {isDirty && (
                <Badge
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px] bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/50 font-mono"
                >
                  未保存
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer with HUD-style decorative elements */}
      <div className="relative border-t border-cyan-500/30 p-3">
        {/* Bottom-left corner bracket */}
        <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-cyan-500/60"></div>
        {/* Bottom-right corner bracket */}
        <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-cyan-500/60"></div>

        <p className="font-mono text-xs neon-text-green">
          数据存储于 {configDir ?? '~/Library/Rime/'}
        </p>
      </div>
    </aside>
  );
}
