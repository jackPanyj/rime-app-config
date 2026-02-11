import { useEffect, useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { usePhrasesStore } from '@/stores/phrases-store';

export function usePhrases() {
  const {
    header,
    entries,
    loadPhrases,
    addEntry,
    updateEntry,
    removeEntry,
    searchQuery,
    setSearchQuery,
    markSaved,
    setLoading,
    setError,
    isDirty,
    reset,
    isLoading,
    error,
  } = usePhrasesStore();

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    invoke<{ header: string; entries: { phrase: string; code: string; weight?: number }[] }>('read_phrases')
      .then((data) => {
        const entriesWithId = (data.entries || []).map((e) => ({
          ...e,
          id: crypto.randomUUID(),
        }));
        loadPhrases(data.header || '', entriesWithId);
      })
      .catch((err) => {
        setError(String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshKey, loadPhrases, setError, setLoading]);

  const save = useCallback(async () => {
    setLoading(true);
    try {
      await invoke('write_phrases', {
        header,
        entries: entries.map(({ id: _id, ...rest }) => rest),
      });
      markSaved();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, [header, entries, markSaved, setError, setLoading]);

  const deploy = useCallback(async () => {
    try {
      const result = await invoke<{ success: boolean; message: string }>('deploy');
      return result;
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err),
      };
    }
  }, []);

  const saveAndDeploy = useCallback(async () => {
    const saved = await save();
    if (saved) {
      return deploy();
    }
    return { success: false, message: 'Save failed, deploy skipped' };
  }, [save, deploy]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return {
    header,
    entries,
    isLoading,
    error,
    isDirty,
    addEntry,
    updateEntry,
    removeEntry,
    searchQuery,
    setSearchQuery,
    save,
    deploy,
    saveAndDeploy,
    reset,
    refresh,
  };
}
