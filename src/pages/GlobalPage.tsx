import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { YamlPreviewPanel } from '@/components/layout/yaml-preview-panel';
import { SchemaListEditor } from '@/components/editors/global/schema-list-editor';
import { PageSizeEditor } from '@/components/editors/global/page-size-editor';
import { HotkeysEditor } from '@/components/editors/global/hotkeys-editor';
import { SwitchKeyEditor } from '@/components/editors/global/switch-key-editor';
import { useConfig } from '@/hooks/use-config';
import { mergeConfigs, getNestedValue } from '@/lib/merger';

interface SchemaInfo {
  schemaId: string;
  name: string;
}

export default function GlobalPage() {
  const {
    baseConfig,
    customPatch,
    isLoading,
    isDirty,
    updatePatch,
    save,
    saveAndDeploy,
    reset,
  } = useConfig('default');

  const [availableSchemas, setAvailableSchemas] = useState<SchemaInfo[]>([]);

  useEffect(() => {
    invoke<{ schemas: SchemaInfo[] }>('get_schemas').then((d) => setAvailableSchemas(d.schemas));
  }, []);

  const effective = mergeConfigs(baseConfig, customPatch);
  const schemaList = (getNestedValue(effective, 'schema_list') as { schema: string }[]) || [];
  const pageSize = (getNestedValue(effective, 'menu/page_size') as number) || 5;
  const hotkeys = (getNestedValue(effective, 'switcher/hotkeys') as string[]) || ['F4'];
  const switchKeys = (getNestedValue(effective, 'ascii_composer/switch_key') as Record<string, string>) || {};
  const capsLock = (getNestedValue(effective, 'ascii_composer/good_old_caps_lock') as boolean) ?? true;

  const handleSave = async () => {
    const ok = await save();
    if (ok) toast.success('配置已保存');
    else toast.error('保存失败');
  };

  const handleSaveAndDeploy = async () => {
    const result = await saveAndDeploy();
    if (result.success) toast.success(result.message || '已保存并部署');
    else toast.error(result.message || '部署失败');
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto">
        <Header
          title="全局配置"
          description="编辑 default.custom.yaml，影响所有输入方案"
          isDirty={isDirty()}
          isLoading={isLoading}
          onSave={handleSave}
          onSaveAndDeploy={handleSaveAndDeploy}
          onReset={reset}
        />
        <div className="space-y-6 p-6">
          <SchemaListEditor
            value={schemaList}
            availableSchemas={availableSchemas}
            onChange={(v) => updatePatch('schema_list', v)}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <PageSizeEditor
              value={pageSize}
              onChange={(v) => updatePatch('menu/page_size', v)}
            />
            <HotkeysEditor
              value={hotkeys}
              onChange={(v) => updatePatch('switcher/hotkeys', v)}
            />
          </div>
          <SwitchKeyEditor
            switchKeys={switchKeys}
            capsLock={capsLock}
            onSwitchKeyChange={(key, value) =>
              updatePatch(`ascii_composer/switch_key/${key}`, value)
            }
            onCapsLockChange={(value) =>
              updatePatch('ascii_composer/good_old_caps_lock', value)
            }
          />
        </div>
      </div>
      <YamlPreviewPanel />
    </div>
  );
}
