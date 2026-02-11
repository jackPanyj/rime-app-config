// Switch key options for ascii_composer
export const SWITCH_KEY_OPTIONS = [
  'commit_code',
  'commit_text',
  'inline_ascii',
  'clear',
  'noop',
  'set_ascii_mode',
  'unset_ascii_mode',
] as const;

export type SwitchKeyOption = typeof SWITCH_KEY_OPTIONS[number];

// Caps lock options (subset)
export const CAPS_LOCK_OPTIONS = ['commit_code', 'commit_text', 'clear'] as const;
export type CapsLockOption = typeof CAPS_LOCK_OPTIONS[number];

// Switcher hotkeys
export const SWITCHER_HOTKEYS = [
  'F4',
  'Control+grave',
  'Control+Shift+grave',
  'Alt+grave',
] as const;

// Switch key names
export const SWITCH_KEY_NAMES = {
  Caps_Lock: '大写锁定',
  Shift_L: '左 Shift',
  Shift_R: '右 Shift',
  Control_L: '左 Control',
  Control_R: '右 Control',
} as const;

// Schema switch names
export const SCHEMA_SWITCH_NAMES: Record<string, string> = {
  ascii_mode: '中英切换',
  ascii_punct: '中英标点',
  traditionalization: '简繁切换',
  emoji: 'Emoji',
  full_shape: '全角/半角',
  search_single_char: '单字优先',
};

// Fuzzy pinyin rules - grouped
export const FUZZY_PINYIN_GROUPS = {
  initials: {
    label: '声母',
    rules: [
      { from: 'zh', to: 'z', derive: "derive/^([zcs])h/$1/", reverse: "derive/^([zcs])([^h])/$1h$2/" },
      { from: 'ch', to: 'c', derive: "derive/^([zcs])h/$1/", reverse: "derive/^([zcs])([^h])/$1h$2/" },
      { from: 'sh', to: 's', derive: "derive/^([zcs])h/$1/", reverse: "derive/^([zcs])([^h])/$1h$2/" },
      { from: 'l', to: 'n', derive: "derive/^l/n/", reverse: "derive/^n/l/" },
      { from: 'f', to: 'h', derive: "derive/^f/h/", reverse: "derive/^h/f/" },
      { from: 'l', to: 'r', derive: "derive/^l/r/", reverse: "derive/^r/l/" },
      { from: 'g', to: 'k', derive: "derive/^g/k/", reverse: "derive/^k/g/" },
    ],
  },
  finals: {
    label: '韵母',
    rules: [
      { from: 'ang', to: 'an', derive: "derive/ang$/an/", reverse: "derive/an$/ang/" },
      { from: 'eng', to: 'en', derive: "derive/eng$/en/", reverse: "derive/en$/eng/" },
      { from: 'in', to: 'ing', derive: "derive/in$/ing/", reverse: "derive/ing$/in/" },
      { from: 'ian', to: 'iang', derive: "derive/ian$/iang/", reverse: "derive/iang$/ian/" },
      { from: 'uan', to: 'uang', derive: "derive/uan$/uang/", reverse: "derive/uang$/uan/" },
      { from: 'an', to: 'ai', derive: "derive/ai$/an/", reverse: "derive/an$/ai/" },
      { from: 'ong', to: 'un', derive: "derive/ong$/un/", reverse: "derive/un$/ong/" },
      { from: 'ong', to: 'eng', derive: "derive/ong$/eng/", reverse: "derive/eng$/ong/" },
    ],
  },
} as const;

// BGR color keys used in Rime squirrel.yaml
export const BGR_COLOR_KEYS = new Set([
  'back_color',
  'border_color',
  'text_color',
  'hilited_text_color',
  'hilited_back_color',
  'hilited_candidate_text_color',
  'hilited_candidate_back_color',
  'hilited_candidate_label_color',
  'hilited_comment_text_color',
  'candidate_text_color',
  'candidate_back_color',
  'comment_text_color',
  'label_color',
  'preedit_back_color',
]);

// Candidate list layout options
export const CANDIDATE_LIST_LAYOUTS = ['stacked', 'linear'] as const;
export type CandidateListLayout = typeof CANDIDATE_LIST_LAYOUTS[number];

// Text orientation options
export const TEXT_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type TextOrientation = typeof TEXT_ORIENTATIONS[number];
