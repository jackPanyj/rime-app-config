import yaml from 'js-yaml';

/**
 * Serialize a patch object to YAML string in Rime patch format.
 * Uses slash notation: `menu/page_size: 9`
 */
export function serializePatch(patch: Record<string, unknown>): string {
  if (!patch || Object.keys(patch).length === 0) {
    return 'patch: {}\n';
  }
  const doc = yaml.dump({ patch }, {
    indent: 2,
    lineWidth: -1, // no wrapping
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });
  return doc;
}

/**
 * Flatten a nested object into slash-notation keys.
 * { menu: { page_size: 9 } } -> { "menu/page_size": 9 }
 */
export function flattenToSlashNotation(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}/${key}` : key;
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      Object.assign(result, flattenToSlashNotation(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

/**
 * Serialize to Rime-style patch YAML (slash notation).
 */
export function serializeSlashPatch(patch: Record<string, unknown>): string {
  const flat = flattenToSlashNotation(patch);
  if (Object.keys(flat).length === 0) {
    return 'patch: {}\n';
  }
  return serializePatch(flat);
}
