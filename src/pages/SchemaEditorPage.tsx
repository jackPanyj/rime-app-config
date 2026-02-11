import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { YamlPreviewPanel } from '@/components/layout/yaml-preview-panel';
import { SwitchesEditor } from '@/components/editors/schema/switches-editor';
import { FuzzyPinyinEditor } from '@/components/editors/schema/fuzzy-pinyin-editor';
import { useConfig } from '@/hooks/use-config';
interface SchemaSwitch {
  name: string;
  states?: string[];
  reset?: number;
}

export default function SchemaEditorPage() {
  const { schemaId } = useParams<{ schemaId: string }>();
  const {
    baseConfig,
    customPatch,
    isLoading,
    isDirty,
    updatePatch,
    save,
    saveAndDeploy,
    reset,
  } = useConfig(schemaId!);

  const [baseAlgebra, setBaseAlgebra] = useState<string[]>([]);

  useEffect(() => {
    invoke<{ base: Record<string, unknown> }>('read_config', {
      basename: schemaId,
      configType: 'base',
    })
      .then((d) => {
        const speller = d.base?.speller as Record<string, unknown> | undefined;
        if (speller?.algebra) {
          setBaseAlgebra(speller.algebra as string[]);
        }
      });
  }, [schemaId]);

  const switches = (baseConfig.switches as SchemaSwitch[]) || [];

  const switchValues = useMemo(() => {
    const values: Record<string, number> = {};
    const customSwitches = customPatch.switches as SchemaSwitch[] | undefined;
    if (customSwitches) {
      for (const sw of customSwitches) {
        if (sw.reset !== undefined) values[sw.name] = sw.reset;
      }
    }
    return values;
  }, [customPatch]);

  const handleSwitchChange = useCallback(
    (name: string, reset: number) => {
      const currentSwitches = (customPatch.switches as SchemaSwitch[]) || [...switches];
      const updated = currentSwitches.map((sw) =>
        sw.name === name ? { ...sw, reset } : sw
      );
      if (!updated.find((sw) => sw.name === name)) {
        updated.push({ name, reset });
      }
      updatePatch('switches', updated);
    },
    [customPatch, switches, updatePatch]
  );

  const enabledRules = useMemo(() => {
    const customAlgebra = (customPatch['speller/algebra'] as string[]) || baseAlgebra;
    return new Set(customAlgebra.filter((r) => r.startsWith('derive/')));
  }, [customPatch, baseAlgebra]);

  const handleFuzzyToggle = useCallback(
    (derive: string, reverse: string, enabled: boolean) => {
      let algebra = (customPatch['speller/algebra'] as string[]) || [...baseAlgebra];

      if (enabled) {
        const insertIndex = algebra.findIndex(
          (r) => !r.startsWith('derive/') && !r.startsWith('# - derive/')
        );
        const idx = insertIndex === -1 ? 0 : insertIndex;
        if (!algebra.includes(derive)) algebra.splice(idx, 0, derive);
        if (!algebra.includes(reverse)) algebra.splice(idx + 1, 0, reverse);
      } else {
        algebra = algebra.filter((r) => r !== derive && r !== reverse);
      }

      updatePatch('speller/algebra', algebra);
    },
    [customPatch, baseAlgebra, updatePatch]
  );

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

  const schemaName = ((baseConfig.schema as Record<string, unknown>)?.name as string) || schemaId || '';

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto">
        <Header
          title={schemaName}
          description={`编辑 ${schemaId}.custom.yaml`}
          isDirty={isDirty()}
          isLoading={isLoading}
          onSave={handleSave}
          onSaveAndDeploy={handleSaveAndDeploy}
          onReset={reset}
        />
        <div className="space-y-6 p-6">
          {switches.length > 0 && (
            <SwitchesEditor
              switches={switches}
              values={switchValues}
              onChange={handleSwitchChange}
            />
          )}
          {baseAlgebra.length > 0 && (
            <FuzzyPinyinEditor
              baseAlgebra={baseAlgebra}
              enabledRules={enabledRules}
              onToggle={handleFuzzyToggle}
            />
          )}
        </div>
      </div>
      <YamlPreviewPanel />
    </div>
  );
}
