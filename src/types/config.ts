export interface DefaultConfig {
  schema_list: { schema: string }[];
  menu: {
    page_size: number;
  };
  switcher: {
    hotkeys: string[];
    save_options: string[];
    fold_options: boolean;
  };
  ascii_composer: {
    good_old_caps_lock: boolean;
    switch_key: Record<string, string>;
  };
}

export interface SquirrelStyle {
  color_scheme: string;
  color_scheme_dark: string;
  candidate_list_layout: 'stacked' | 'linear';
  text_orientation: 'horizontal' | 'vertical';
  inline_preedit: boolean;
  inline_candidate: boolean;
  memorize_size: boolean;
  translucency: boolean;
  corner_radius: number;
  hilited_corner_radius: number;
  border_height: number;
  border_width: number;
  line_spacing: number;
  spacing: number;
  shadow_size: number;
  font_face: string;
  font_point: number;
  candidate_format: string;
}

export interface ColorSchemeConfig {
  name: string;
  author?: string;
  back_color: string | number;
  text_color: string | number;
  candidate_text_color?: string | number;
  hilited_text_color?: string | number;
  hilited_back_color?: string | number;
  hilited_candidate_text_color?: string | number;
  hilited_candidate_back_color?: string | number;
  hilited_candidate_label_color?: string | number;
  hilited_comment_text_color?: string | number;
  comment_text_color?: string | number;
  label_color?: string | number;
  border_color?: string | number;
  preedit_back_color?: string | number;
  candidate_back_color?: string | number;
  // Layout overrides
  candidate_list_layout?: string;
  inline_preedit?: boolean;
  corner_radius?: number;
  border_width?: number;
  border_height?: number;
  font_face?: string;
  font_point?: number;
  label_font_face?: string;
  label_font_point?: number;
  comment_font_face?: string;
  comment_font_point?: number;
}

export interface SquirrelConfig {
  config_version: string;
  keyboard_layout: string;
  show_notifications_when: string;
  app_options: Record<string, { ascii_mode?: boolean }>;
  style: SquirrelStyle;
  preset_color_schemes: Record<string, ColorSchemeConfig>;
}

export interface InstallationInfo {
  distribution_code_name: string;
  distribution_name: string;
  distribution_version: string;
  install_time: string;
  installation_id: string;
  rime_version: string;
}
