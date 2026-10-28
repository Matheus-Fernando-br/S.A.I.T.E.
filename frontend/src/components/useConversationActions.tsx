"use client";

import { useState } from "react";

import { ConfirmDialog, PromptDialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/lib/format";
import { Conversation, deleteConversation, updateConversation } from "@/services/api";

/**
 * Ações de conversa (fixar, renomear, arquivar, excluir) reutilizadas pela
 * barra lateral e pela página de Histórico, com diálogos acessíveis no lugar
 * de window.prompt/confirm.
 */
export function useConversationActions(onChanged: (conversation: Conversation | null, removedId?: string) => void) {
  const { notify } = useToast();
  const [renaming, setRenaming] = useState<Conversation | null>(null);
  const [deleting, setDeleting] = useState<Conversation | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function run(conversation: Conversation, changes: Partial<Conversation>, success: string) {
    setBusyId(conversation.id);
    try {
      const updated = await updateConversation(conversation.id, changes);
      onChanged(updated);
      notify("success", success);
    } catch (error) {
      notify("error", errorMessage(error));
    } finally {
      setBusyId(null);
    }
  }

  const actions = {
    busyId,
    togglePin: (conversation: Conversation) =>
      run(conversation, { pinned: !conversation.pinned }, conversation.pinned ? "Conversa desafixada." : "Conversa fixada."),
    toggleArchive: (conversation: Conversation) =>
      run(
        conversation,
        { archived: !conversation.archived },
        conversation.archived ? "Conversa restaurada." : "Conversa arquivada.",
      ),
    rename: (conversation: Conversation) => setRenaming(conversation),
    remove: (conversation: Conversation) => setDeleting(conversation),
  };

  const dialogs = (
    <>
      <PromptDialog
        open={renaming !== null}
        title="Renomear conversa"
        label="Novo título"
        initialValue={renaming?.title ?? ""}
        onClose={() => setRenaming(null)}
        onSubmit={async (title) => {
          if (!renaming) return;
          try {
            onChanged(await updateConversation(renaming.id, { title }));
            notify("success", "Conversa renomeada.");
          } catch (error) {
            notify("error", errorMessage(error));
            throw error;
          }
        }}
      />
      <ConfirmDialog
        open={deleting !== null}
        title="Excluir conversa?"
        description={
          <>
            <strong>{deleting?.title}</strong> e todas as suas mensagens e anexos serão removidos permanentemente.
          </>
        }
        confirmLabel="Excluir"
        danger
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteConversation(deleting.id);
            onChanged(null, deleting.id);
            notify("success", "Conversa excluída.");
          } catch (error) {
            notify("error", errorMessage(error));
            throw error;
          }
        }}
      />
    </>
  );

  return { actions, dialogs };
}
