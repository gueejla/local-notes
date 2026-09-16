import { useCallback, useEffect, useState } from "react";
import { type Note, listNotes, saveNote, deleteNote } from "./lib/opfs";
import { exportNotesToZip } from "@/lib/export";
import { NoteItem } from "@/components/note/note";

type Theme = "light" | "dark" | "solarized" | "cozy";
const THEMES: Theme[] = ["light", "dark", "solarized", "cozy"];

type Align = "left" | "center" | "right" | "between";
const ALIGNS: { value: Align; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Centered" },
  { value: "right", label: "Right" },
  { value: "between", label: "Space between" },
];

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<Note | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "light";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [align, setAlign] = useState<Align>(() => {
    return (localStorage.getItem("align") as Align) || "left"
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.align = align; // ← add
    localStorage.setItem("align", align);           // ← add
  }, [theme, align]);

  const refresh = useCallback(async () => {
    setNotes(await listNotes());
  }, []);

  useEffect(() => {
    void listNotes().then(setNotes);
  }, []);

  const newNote = () =>
    setDraft({ id: crypto.randomUUID(), title: "", body: "", updatedAt: Date.now(), createdAt: Date.now() });

  const persist = async () => {
    if (!draft) return;
    await saveNote({ ...draft, updatedAt: Date.now() });
    setDraft(null);
    await refresh();
  };

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-expanded={sidebarOpen}
        aria-controls="app-sidebar"
        onClick={() => setSidebarOpen((o) => !o)}
        title="Menu"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <aside id="app-sidebar" className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <section className="sidebar-section">
          <h2>Theme</h2>
          <label htmlFor="theme-select" className="visually-hidden">
            Theme
          </label>
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
        </section>

        <section className="sidebar-section">
          <h2>Export</h2>
          <button onClick={() => exportNotesToZip().catch((e) => alert(String(e)))}>
            Export all notes (.zip)
          </button>
        </section>

        <section className="sidebar-section">
          <h2>Text alignment</h2>
          {ALIGNS.map(({ value, label }) => (
            <label key={value} className="align-option">
              <input
                type="radio"
                name="align"
                value={value}
                checked={align === value}
                onChange={() => setAlign(value)}
              />
              {label}
            </label>
          ))}
        </section>

        {/* Future sections go here — e.g. Import, Settings, About */}
      </aside>

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="app">
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
            <button onClick={persist}>Save</button>{" "}
            <button onClick={() => setDraft(null)}>Cancel</button>
          </div>
        ) : (
          <button onClick={newNote}>+ New note</button>
        )}

        <ul className="note-list">
        {notes.map((n) => (
          <NoteItem
            key={n.id}
            note={n}
            onEdit={setDraft}
            onDelete={async (id: string) => {
              await deleteNote(id);
              await refresh();
            }}
          />
        ))}
      </ul>

      </main>

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
        </p>
      </footer>
    </>
  );
}
