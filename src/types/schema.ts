export interface SchemaMetadata {
  schemaId: string;
  name: string;
  version: string;
  author: string[];
  description: string;
  switches: SchemaSwitch[];
  hasFuzzyPinyin: boolean;
}

export interface SchemaSwitch {
  name: string;
  states?: string[];
  reset?: number;
  abbrev?: string[];
}

export interface FuzzyPinyinRule {
  from: string;
  to: string;
  derive: string;
  reverse: string;
}

export interface FuzzyPinyinGroup {
  label: string;
  rules: FuzzyPinyinRule[];
}
