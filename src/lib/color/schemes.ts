import { bgrToRgb } from './bgr';

export interface ColorScheme {
  id: string;
  name: string;
  author?: string;
  // CSS-friendly colors (converted from BGR)
  backColor: string;
  textColor: string;
  candidateTextColor: string;
  hilitedCandidateTextColor: string;
  hilitedCandidateBackColor: string;
  commentTextColor: string;
  labelColor: string;
  borderColor?: string;
  // Layout
  candidateListLayout?: string;
  inlinePreedit?: boolean;
  cornerRadius?: number;
  borderWidth?: number;
  borderHeight?: number;
  fontFace?: string;
  fontSize?: number;
}

/**
 * Parse preset_color_schemes from squirrel.yaml into CSS-friendly format.
 */
export function parseColorSchemes(
  schemesData: Record<string, Record<string, unknown>>
): ColorScheme[] {
  return Object.entries(schemesData).map(([id, scheme]) => ({
    id,
    name: (scheme.name as string) || id,
    author: scheme.author as string | undefined,
    backColor: bgrToRgb(scheme.back_color as string | number || '0x000000'),
    textColor: bgrToRgb(scheme.text_color as string | number || '0xFFFFFF'),
    candidateTextColor: bgrToRgb(scheme.candidate_text_color as string | number || scheme.text_color as string | number || '0xFFFFFF'),
    hilitedCandidateTextColor: bgrToRgb(scheme.hilited_candidate_text_color as string | number || '0xFFFFFF'),
    hilitedCandidateBackColor: bgrToRgb(scheme.hilited_candidate_back_color as string | number || '0x000000'),
    commentTextColor: bgrToRgb(scheme.comment_text_color as string | number || '0x808080'),
    labelColor: bgrToRgb(scheme.label_color as string | number || scheme.text_color as string | number || '0xFFFFFF'),
    borderColor: scheme.border_color ? bgrToRgb(scheme.border_color as string | number) : undefined,
    candidateListLayout: scheme.candidate_list_layout as string | undefined,
    inlinePreedit: scheme.inline_preedit as boolean | undefined,
    cornerRadius: scheme.corner_radius as number | undefined,
    borderWidth: scheme.border_width as number | undefined,
    borderHeight: scheme.border_height as number | undefined,
    fontFace: scheme.font_face as string | undefined,
    fontSize: scheme.font_point as number | undefined,
  }));
}
