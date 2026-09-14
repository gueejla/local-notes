import { useCallback, useEffect, useState } from "react";
import { type Note, listNotes, saveNote, deleteNote } from "./opfs";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<Note | null>(null);

  const refresh = useCallback(async () => {
    setNotes(await listNotes());
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const newNote = () =>
    setDraft({ id: crypto.randomUUID(), title: "", body: "", updatedAt: Date.now(), createdAt: Date.now() });

  const persist = async () => {
    if (!draft) return;
    await saveNote({ ...draft, updatedAt: Date.now() });
    setDraft(null);
    await refresh();
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h1>local Notes</h1>

      {draft ? (
        <div>
          <input
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            style={{ fontSize: 18, width: "100%" }}
          />
          <textarea
            placeholder="Write your note…"
            rows={10}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            style={{ width: "100%", marginTop: 8 }}
          />
          <button onClick={persist}>Save</button>
          <button onClick={() => setDraft(null)}>Cancel</button>
        </div>
      ) : (
        <button onClick={newNote}>+ New note</button>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((n) => (
          <li key={n.id} style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
            <strong>{n.title || "(untitled)"}</strong>
            <p>{n.body.slice(0, 120)}</p>
            <button onClick={() => setDraft(n)}>Edit</button>{" "}
            <button onClick={async () => { await deleteNote(n.id); await refresh(); }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
