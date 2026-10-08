import type { Note } from "@/models/note";
import { saveNote } from "@/lib/opfs";
import { useEffect } from "react";

type Props = {
  draft: Note | null;
  onSetDraft: (note: Note | null) => void;
  refresh: () => void;
}

export function Input({draft, onSetDraft, refresh}: Props) {
  useEffect(() => {
    const el = document.getElementById("note-input");
    el?.scrollIntoView({ behavior: "smooth" });
  }, [draft]);

  const newNote = () =>
    onSetDraft({ id: crypto.randomUUID(), title: "", body: "", updatedAt: Date.now(), createdAt: Date.now() });

  const persist = async () => {
    if (!draft) return;
    await saveNote({ ...draft, updatedAt: Date.now() });
    onSetDraft(null);
    await refresh();
  };

  return(
    <>
      <div className="new-note">
        {draft ? (
          <div id="note-input">
            <input
              placeholder="Title"
              value={draft.title}
              onChange={(e) => onSetDraft({ ...draft, title: e.target.value })}
              className="title-input"
            />
            <textarea
              placeholder="Write your note…"
              rows={10}
              value={draft.body}
              onChange={(e) => onSetDraft({ ...draft, body: e.target.value })}
              className="body-input"
            />
            <button onClick={persist}>Save</button>{" "}
            <button onClick={() => onSetDraft(null)}>Cancel</button>
          </div>
        ) : (
          <div id="new-note">
            <button onClick={newNote}>+ New note</button>
          </div>
        )}
      </div>
    </>
  )
}