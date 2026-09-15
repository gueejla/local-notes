import { useCallback, useEffect, useState } from "react";
import { type Note, listNotes, saveNote, deleteNote } from "./opfs";

type Theme = "light" | "dark" | "solarized" | "cozy";
const THEMES: Theme[] = ["light", "dark", "solarized", "cozy"];

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<Note | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

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
    <div className="app data-theme">
      <h1>local notes</h1>

      {draft ? (
        <div>
          <input
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="title-input"
          />
          <textarea
            placeholder="Write your note…"
            rows={10}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            className="body-input"
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
      <footer className="app-footer">
        <p>
          Your notes on your device ·{" "}
          <a
            href="https://github.com/gueejla/local-notes"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub 
          </a>
        </p>·{" "}
        <label htmlFor="theme-select">Theme: </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </footer>
    </div>
  );
}
