

import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  description?: string;
  isDirty?: boolean;
  isLoading?: boolean;
  onSave?: () => void;
  onSaveAndDeploy?: () => void;
  onReset?: () => void;
}

export function Header({
  title,
  description,
  isDirty,
  isLoading,
  onSave,
  onSaveAndDeploy,
  onReset,
}: HeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-neon-cyan/20 px-6 py-4">
      <div>
        <h2 className="font-display text-xl font-semibold uppercase tracking-wider neon-text-cyan">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onSave && (
        <div className="flex items-center gap-2">
          {onReset && isDirty && (
            <Button variant="ghost" size="sm" onClick={onReset} disabled={isLoading}>
              重置
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={!isDirty || isLoading}
            className="bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20"
          >
            {isLoading ? '保存中...' : '保存'}
          </Button>
          {onSaveAndDeploy && (
            <Button
              size="sm"
              onClick={onSaveAndDeploy}
              disabled={!isDirty || isLoading}
              className="bg-primary text-primary-foreground"
            >
              保存并部署
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
