/**
 * Merge base config with custom patches.
 * Custom patches use slash notation (e.g., "menu/page_size": 9).
 */
export function mergeConfigs(
  base: Record<string, unknown>,
  customPatch: Record<string, unknown>
): Record<string, unknown> {
  const result = structuredClone(base);

  for (const [key, value] of Object.entries(customPatch)) {
    if (key.includes('/')) {
      // Slash notation: "menu/page_size" -> set result.menu.page_size
      setNestedValue(result, key.split('/'), value);
    } else {
      // Top-level key replacement
      result[key] = value;
    }
  }

  return result;
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string[],
  value: unknown
): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[path[path.length - 1]] = value;
}

/**
 * Get a value from a nested object using a slash path
 */
export function getNestedValue(
  obj: Record<string, unknown>,
  slashPath: string
): unknown {
  const parts = slashPath.split('/');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
