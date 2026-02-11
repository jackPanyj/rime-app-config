import type { CustomPhrasesData } from '@/types/phrases';

export function serializeCustomPhrases(data: CustomPhrasesData): string {
  const lines: string[] = [data.header.trimEnd()];

  for (const entry of data.entries) {
    const parts = [entry.phrase, entry.code];
    if (entry.weight != null) parts.push(String(entry.weight));
    lines.push(parts.join('\t'));
  }

  return lines.join('\n') + '\n';
}
