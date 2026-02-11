import yaml from 'js-yaml';
import { BGR_COLOR_KEYS } from '@/lib/constants';

/**
 * Parse YAML string, preserving BGR hex color values.
 * js-yaml parses 0xBBGGRR as integers; we need to keep them as-is for display.
 */
export function parseYaml(content: string): Record<string, unknown> {
  const parsed = yaml.load(content);
  if (!parsed || typeof parsed !== 'object') return {};
  return parsed as Record<string, unknown>;
}

/**
 * Convert integer color values back to 0xHHHHHH string format.
 * This is needed because js-yaml parses `0xBBGGRR` as a number.
 */
export function preserveBgrColors(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = preserveBgrColors(value as Record<string, unknown>);
    } else if (BGR_COLOR_KEYS.has(key) && typeof value === 'number') {
      // Convert back to hex string with 0x prefix, padded to 6 or 8 digits
      const hex = value.toString(16).toUpperCase();
      result[key] = `0x${hex.padStart(hex.length > 6 ? 8 : 6, '0')}`;
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function parseYamlWithColors(content: string): Record<string, unknown> {
  const parsed = parseYaml(content);
  return preserveBgrColors(parsed);
}
