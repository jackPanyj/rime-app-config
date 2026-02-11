import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { YamlPreviewPanel } from '@/components/layout/yaml-preview-panel';
import { ColorSchemePicker } from '@/components/editors/appearance/color-scheme-picker';
import { ColorSchemePreview } from '@/components/editors/appearance/color-scheme-preview';
import { LayoutEditor } from '@/components/editors/appearance/layout-editor';
import { AppOptionsEditor } from '@/components/editors/appearance/app-options-editor';
import { useConfig } from '@/hooks/use-config';
import { mergeConfigs } from '@/lib/merger';
import { parseColorSchemes, type ColorScheme } from '@/lib/color/schemes';

export default function AppearancePage() {
  const {
    baseConfig,
    customPatch,
    isLoading,
    isDirty,
    updatePatch,
    save,
    saveAndDeploy,
    reset,
  } = useConfig('squirrel');

  const [colorSchemes, setColorSchemes] = useState<ColorScheme[]>([]);

  useEffect(() => {
    if (baseConfig.preset_color_schemes) {
      const schemes = parseColorSchemes(
        baseConfig.preset_color_schemes as Record<string, Record<string, unknown>>
      );
      setColorSchemes(schemes);
    }
  }, [baseConfig]);

  const effective = mergeConfigs(baseConfig, customPatch);
  const style = (effective.style || {}) as Record<string, unknown>;

  const selectedScheme = (customPatch['style/color_scheme'] as string) ||
    (style.color_scheme as string) || '';
  const activeScheme = useMemo(
    () => colorSchemes.find((s) => s.id === selectedScheme),
    [colorSchemes, selectedScheme]
  );

  const layout = (customPatch['style/candidate_list_layout'] as string) ||
    (style.candidate_list_layout as string) || 'stacked';
  const inlinePreedit = (customPatch['style/inline_preedit'] as boolean) ??
    (style.inline_preedit as boolean) ?? true;
  const cornerRadius = (customPatch['style/corner_radius'] as number) ??
    (style.corner_radius as number) ?? 7;
  const borderHeight = (customPatch['style/border_height'] as number) ??
    (style.border_height as number) ?? 0;
  const borderWidth = (customPatch['style/border_width'] as number) ??
    (style.border_width as number) ?? 0;
  const lineSpacing = (customPatch['style/line_spacing'] as number) ??
    (style.line_spacing as number) ?? 5;
  const spacing = (customPatch['style/spacing'] as number) ??
    (style.spacing as number) ?? 8;
  const fontFace = (customPatch['style/font_face'] as string) ||
    (style.font_face as string) || '';
  const fontPoint = (customPatch['style/font_point'] as number) ??
    (style.font_point as number) ?? 16;
  const appOptions = (effective.app_options || {}) as Record<string, { ascii_mode?: boolean }>;

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
          title="外观主题"
          description="编辑 squirrel.custom.yaml，自定义候选框外观"
          isDirty={isDirty()}
          isLoading={isLoading}
          onSave={handleSave}
          onSaveAndDeploy={handleSaveAndDeploy}
          onReset={reset}
        />
        <div className="space-y-6 p-6">
          {activeScheme && (
            <ColorSchemePreview
              backColor={activeScheme.backColor}
              textColor={activeScheme.textColor}
              candidateTextColor={activeScheme.candidateTextColor}
              hilitedCandidateTextColor={activeScheme.hilitedCandidateTextColor}
              hilitedCandidateBackColor={activeScheme.hilitedCandidateBackColor}
              commentTextColor={activeScheme.commentTextColor}
              labelColor={activeScheme.labelColor}
              borderColor={activeScheme.borderColor}
              cornerRadius={cornerRadius}
              fontFace={fontFace || undefined}
              fontSize={fontPoint}
              isLinear={layout === 'linear'}
            />
          )}

          <ColorSchemePicker
            schemes={colorSchemes}
            selected={selectedScheme}
            onSelect={(id) => {
              updatePatch('style/color_scheme', id);
              updatePatch('style/color_scheme_dark', id);
            }}
          />

          <LayoutEditor
            layout={layout as 'stacked' | 'linear'}
            inlinePreedit={inlinePreedit}
            cornerRadius={cornerRadius}
            borderHeight={borderHeight}
            borderWidth={borderWidth}
            lineSpacing={lineSpacing}
            spacing={spacing}
            fontFace={fontFace}
            fontPoint={fontPoint}
            onLayoutChange={(v) => updatePatch('style/candidate_list_layout', v)}
            onInlinePreeditChange={(v) => updatePatch('style/inline_preedit', v)}
            onCornerRadiusChange={(v) => updatePatch('style/corner_radius', v)}
            onBorderHeightChange={(v) => updatePatch('style/border_height', v)}
            onBorderWidthChange={(v) => updatePatch('style/border_width', v)}
            onLineSpacingChange={(v) => updatePatch('style/line_spacing', v)}
            onSpacingChange={(v) => updatePatch('style/spacing', v)}
            onFontFaceChange={(v) => updatePatch('style/font_face', v)}
            onFontPointChange={(v) => updatePatch('style/font_point', v)}
          />

          <AppOptionsEditor
            options={appOptions}
            onChange={(opts) => updatePatch('app_options', opts)}
          />
        </div>
      </div>
      <YamlPreviewPanel />
    </div>
  );
}
