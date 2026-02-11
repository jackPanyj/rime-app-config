import { create } from 'zustand';
import { deepEqual } from '@/lib/yaml/patch';

interface ConfigState {
  // The config file being edited (e.g., 'default', 'squirrel', 'rime_ice')
  activeConfig: string;
  // Base config from the file (read-only reference)
  baseConfig: Record<string, unknown>;
  // Current custom patch being edited
  customPatch: Record<string, unknown>;
  // Last saved patch (for dirty detection)
  savedPatch: Record<string, unknown>;
  // Loading state
  isLoading: boolean;
  // Error
  error: string | null;

  // Actions
  setActiveConfig: (name: string) => void;
  loadConfig: (base: Record<string, unknown>, customPatch: Record<string, unknown>) => void;
  updatePatch: (key: string, value: unknown) => void;
  removePatchKey: (key: string) => void;
  replacePatch: (patch: Record<string, unknown>) => void;
  markSaved: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isDirty: () => boolean;
  reset: () => void;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  activeConfig: '',
  baseConfig: {},
  customPatch: {},
  savedPatch: {},
  isLoading: false,
  error: null,

  setActiveConfig: (name) => set({ activeConfig: name }),

  loadConfig: (base, customPatch) =>
    set({
      baseConfig: base,
      customPatch: { ...customPatch },
      savedPatch: { ...customPatch },
      isLoading: false,
      error: null,
    }),

  updatePatch: (key, value) =>
    set((state) => ({
      customPatch: { ...state.customPatch, [key]: value },
    })),

  removePatchKey: (key) =>
    set((state) => {
      const newPatch = { ...state.customPatch };
      delete newPatch[key];
      return { customPatch: newPatch };
    }),

  replacePatch: (patch) => set({ customPatch: { ...patch } }),

  markSaved: () =>
    set((state) => ({
      savedPatch: { ...state.customPatch },
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  isDirty: () => {
    const { customPatch, savedPatch } = get();
    return !deepEqual(customPatch, savedPatch);
  },

  reset: () =>
    set((state) => ({
      customPatch: { ...state.savedPatch },
    })),
}));
