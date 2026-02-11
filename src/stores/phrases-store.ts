import { create } from 'zustand';
import type { CustomPhrase } from '@/types/phrases';

interface PhrasesState {
  header: string;
  entries: CustomPhrase[];
  savedHeader: string;
  savedEntries: CustomPhrase[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;

  // Actions
  loadPhrases: (header: string, entries: CustomPhrase[]) => void;
  addEntry: (entry: CustomPhrase) => void;
  updateEntry: (id: string, updates: Partial<Omit<CustomPhrase, 'id'>>) => void;
  removeEntry: (id: string) => void;
  setSearchQuery: (query: string) => void;
  markSaved: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isDirty: () => boolean;
  reset: () => void;
}

function entriesEqual(a: CustomPhrase[], b: CustomPhrase[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].phrase !== b[i].phrase || a[i].code !== b[i].code || a[i].weight !== b[i].weight) {
      return false;
    }
  }
  return true;
}

export const usePhrasesStore = create<PhrasesState>((set, get) => ({
  header: '',
  entries: [],
  savedHeader: '',
  savedEntries: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  loadPhrases: (header, entries) =>
    set({
      header,
      entries: [...entries],
      savedHeader: header,
      savedEntries: [...entries],
      isLoading: false,
      error: null,
    }),

  addEntry: (entry) =>
    set((state) => ({
      entries: [...state.entries, entry],
    })),

  updateEntry: (id, updates) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  markSaved: () =>
    set((state) => ({
      savedHeader: state.header,
      savedEntries: [...state.entries],
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  isDirty: () => {
    const { header, entries, savedHeader, savedEntries } = get();
    return header !== savedHeader || !entriesEqual(entries, savedEntries);
  },

  reset: () =>
    set((state) => ({
      header: state.savedHeader,
      entries: [...state.savedEntries],
    })),
}));
