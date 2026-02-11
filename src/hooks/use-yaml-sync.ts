

import { useState, useEffect, useRef } from 'react';
import { useConfigStore } from '@/stores/config-store';

/**
 * Debounced YAML preview generation from the current custom patch.
 * Returns a YAML string that updates after 100ms of no changes.
 */
export function useYamlSync(delay = 100): string {
  const customPatch = useConfigStore((s) => s.customPatch);
  const [yamlString, setYamlString] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Generate YAML preview client-side
      const lines: string[] = ['patch:'];
      const entries = Object.entries(customPatch);
      if (entries.length === 0) {
        setYamlString('patch: {}\n');
        return;
      }
      for (const [key, value] of entries) {
        lines.push(`  ${key}: ${formatYamlValue(value)}`);
      }
      setYamlString(lines.join('\n') + '\n');
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [customPatch, delay]);

  return yamlString;
}

function formatYamlValue(value: unknown, indent = 4): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    // Quote strings that contain special characters
    if (value.includes(':') || value.includes('#') || value.includes("'") || value.includes('"') || value.startsWith('0x')) {
      return `"${value}"`;
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // Simple arrays on one line
    if (value.every(v => typeof v === 'string' || typeof v === 'number')) {
      return '\n' + value.map(v => {
        const prefix = ' '.repeat(indent) + '- ';
        if (typeof v === 'object' && v !== null) {
          return prefix + formatObjectInline(v);
        }
        return prefix + formatYamlValue(v, indent + 2);
      }).join('\n');
    }
    return '\n' + value.map(v => {
      const prefix = ' '.repeat(indent) + '- ';
      if (typeof v === 'object' && v !== null) {
        return prefix + formatObjectInline(v);
      }
      return prefix + String(v);
    }).join('\n');
  }
  if (typeof value === 'object') {
    return formatObjectInline(value);
  }
  return String(value);
}

function formatObjectInline(obj: unknown): string {
  if (!obj || typeof obj !== 'object') return String(obj);
  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return '{}';
  // For schema list items like { schema: rime_ice }
  if (entries.length <= 2) {
    return '{' + entries.map(([k, v]) => `${k}: ${v}`).join(', ') + '}';
  }
  return '{' + entries.map(([k, v]) => `${k}: ${v}`).join(', ') + '}';
}
