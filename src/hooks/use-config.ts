import { useEffect, useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useConfigStore } from '@/stores/config-store';

export function useConfig(basename: string) {
  const {
    baseConfig,
    customPatch,
    loadConfig,
    updatePatch,
    removePatchKey,
    replacePatch,
    markSaved,
    setLoading,
    setError,
    isDirty,
    reset,
    isLoading,
    error,
  } = useConfigStore();

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!basename) return;
    setLoading(true);
    invoke<{ base: Record<string, unknown>; customPatch: Record<string, unknown> }>('read_config', { basename })
      .then((data) => {
        loadConfig(data.base || {}, data.customPatch || {});
      })
      .catch((err) => {
        setError(String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [basename, refreshKey, loadConfig, setError, setLoading]);

  const save = useCallback(async () => {
    setLoading(true);
    try {
      await invoke('write_config', { basename, patch: customPatch });
      markSaved();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, [basename, customPatch, markSaved, setError, setLoading]);

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
    baseConfig,
    customPatch,
    isLoading,
    error,
    isDirty,
    updatePatch,
    removePatchKey,
    replacePatch,
    save,
    deploy,
    saveAndDeploy,
    reset,
    refresh,
  };
}
