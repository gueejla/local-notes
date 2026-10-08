import { useCallback, useEffect, useState } from "react";
import { listNotes, deleteNote } from "@/lib/opfs";
import { NoteItem } from "@/components/note/";
import { Sidebar } from "@/components/sidebar";
import { Organize } from "@/components/organize";
import type { Note } from "@/models/note";
import { Input } from "@/components/input";

import '@/App.css';
import '@/components/note/note.css';
import '@/components/sidebar/sidebar.css';
import '@/components/sidebar/colorThemes.css';
import '@/components/input/input.css';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refresh = useCallback(async () => {
    const notes = (await listNotes())
    setNotes(notes);
  }, []);

  useEffect(() => {
    void listNotes().then(setNotes);
  }, []);

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

        <Input 
          draft={draft}
          onSetDraft={setDraft}
          refresh={refresh}
        />
        <Organize
          notes={notes}
          onSortedNotes={setNotes}
          onFilteredNotes={setFilteredNotes}
        />

        <ul className="note-list">
        {filteredNotes.map((n) => (
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
