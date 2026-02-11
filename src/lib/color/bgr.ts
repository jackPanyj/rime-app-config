/**
 * BGR <-> RGB color conversion utilities.
 * Rime uses BGR hex format: 0xBBGGRR
 * CSS uses RGB hex format: #RRGGBB
 */

/**
 * Convert Rime BGR hex (e.g., "0xBBGGRR" or "0xAABBGGRR") to CSS color string.
 */
export function bgrToRgb(bgrHex: string | number): string {
  let value: number;
  if (typeof bgrHex === 'string') {
    value = parseInt(bgrHex.replace('0x', ''), 16);
  } else {
    value = bgrHex;
  }

  // Check if it has alpha (8 digits = 0xAABBGGRR)
  const hexStr = value.toString(16).padStart(6, '0');

  if (hexStr.length > 6) {
    // Has alpha: 0xAABBGGRR
    const alpha = (value >>> 24) & 0xFF;
    const blue = (value >>> 16) & 0xFF;
    const green = (value >>> 8) & 0xFF;
    const red = value & 0xFF;
    const a = alpha / 255;
    return `rgba(${red}, ${green}, ${blue}, ${a.toFixed(2)})`;
  }

  // No alpha: 0xBBGGRR
  const blue = (value >>> 16) & 0xFF;
  const green = (value >>> 8) & 0xFF;
  const red = value & 0xFF;
  return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
}

/**
 * Convert CSS hex (#RRGGBB) to Rime BGR hex (0xBBGGRR).
 */
export function rgbToBgr(cssHex: string): string {
  const hex = cssHex.replace('#', '');
  const r = hex.substring(0, 2);
  const g = hex.substring(2, 4);
  const b = hex.substring(4, 6);
  return `0x${b}${g}${r}`.toUpperCase();
}

/**
 * Convert a BGR color number to hex string with 0x prefix.
 */
export function bgrToHexString(value: number): string {
  const hex = value.toString(16).toUpperCase();
  return `0x${hex.padStart(hex.length > 6 ? 8 : 6, '0')}`;
}
