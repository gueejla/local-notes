import { useState } from "react";
import type { Note } from "../../lib/opfs";

const PREVIEW_LEN = 300;

type Props = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export function NoteItem({ note, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isLong = note.body.length > PREVIEW_LEN;
  const showFull = expanded || !isLong;

  return (
    <li className="note-item">
      <div className="note-header">
        <strong>{note.title || "(untitled)"}</strong>
        <time dateTime={new Date(note.updatedAt).toISOString()}>
          {new Date(note.updatedAt).toLocaleString()}
        </time>
      </div>

      <p className="note-body">
        {showFull ? note.body : `${note.body.slice(0, PREVIEW_LEN)}…`}
      </p>

      {isLong && (
        <button onClick={() => setExpanded((e) => !e)}>
          {showFull ? "Show less" : "Read more"}
        </button>
      )}{" "}

      <button onClick={() => onEdit(note)}>Edit</button>{" "}
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </li>
  );
}
