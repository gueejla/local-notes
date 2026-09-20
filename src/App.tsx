import { useCallback, useEffect, useState } from "react";
import { listNotes, saveNote, deleteNote } from "@/lib/opfs";
import { NoteItem } from "@/components/note/";
import { Sidebar } from "@/components/sidebar";
import { InputOrOrganize } from "@/components/inputOrOrganize";
import type { Note } from "@/models/note";

import '@/App.css';
import '@/components/note/note.css';
import '@/components/sidebar/sidebar.css';
import '@/components/sidebar/colorThemes.css';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refresh = useCallback(async () => {
    const notes = (await listNotes())
    setNotes(notes);
  }, []);

  useEffect(() => {
    void listNotes().then(setNotes);
  }, []);

  useEffect(() => {
    const el = document.getElementById("note-input");
    el?.scrollIntoView({ behavior: "smooth" });
  }, [draft]);

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

      <Sidebar
        sidebarOpen={sidebarOpen}
        refresh={refresh}
      />

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="app">
        <h1>local notes</h1>

        {draft ? (
          <div id="note-input">
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
          <div>
            <button onClick={newNote}>+ New note</button>{" "}
            <InputOrOrganize notes={notes} onSortedNotes={setNotes} />
          </div>
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
