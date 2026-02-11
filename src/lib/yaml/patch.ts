/**
 * Build a patch object from form state.
 * Takes the current custom values and builds a minimal patch.
 */

/**
 * Set a value at a slash-separated path in the patch object.
 * e.g., setSlashPath({}, "menu/page_size", 9) -> { "menu/page_size": 9 }
 */
export function setSlashPath(
  patch: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const result = { ...patch };
  result[path] = value;
  return result;
}

/**
 * Remove a path from the patch object.
 */
export function removeSlashPath(
  patch: Record<string, unknown>,
  path: string
): Record<string, unknown> {
  const result = { ...patch };
  delete result[path];
  return result;
}

/**
 * Deep-equal comparison for detecting dirty state.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(key => deepEqual(aObj[key], bObj[key]));
  }
  return false;
}
