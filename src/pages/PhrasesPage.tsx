import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { PhraseTable } from '@/components/editors/phrases/phrase-table';
import { PhrasePreviewPanel } from '@/components/editors/phrases/phrase-preview-panel';
import { usePhrases } from '@/hooks/use-phrases';

export default function PhrasesPage() {
  const {
    header,
    entries,
    isLoading,
    isDirty,
    addEntry,
    updateEntry,
    removeEntry,
    searchQuery,
    setSearchQuery,
    save,
    saveAndDeploy,
    reset,
  } = usePhrases();

  const handleSave = async () => {
    const ok = await save();
    if (ok) toast.success('短语已保存');
    else toast.error('保存失败');
  };

  const handleSaveAndDeploy = async () => {
    const result = await saveAndDeploy();
    if (result.success) toast.success(result.message || '已保存并部署');
    else toast.error(result.message || '部署失败');
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 min-w-0 h-full overflow-auto">
        <Header
          title="自定义短语"
          description="编辑 custom_phrase.txt，快捷输入自定义文本"
          isDirty={isDirty()}
          isLoading={isLoading}
          onSave={handleSave}
          onSaveAndDeploy={handleSaveAndDeploy}
          onReset={reset}
        />
        <div className="space-y-6 p-6">
          <PhraseTable
            entries={entries}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAdd={addEntry}
            onUpdate={updateEntry}
            onRemove={removeEntry}
          />
        </div>
      </div>
      <PhrasePreviewPanel header={header} entries={entries} />
    </div>
  );
}
