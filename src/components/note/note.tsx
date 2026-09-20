import { useMemo, useState } from "react";
import type { Note } from "@/models/note";
import { convertNoteToHtml } from "@/lib/markdown";

const PREVIEW_LEN = 300;

type Props = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export function NoteItem({ note, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const noteHtml = useMemo(() => convertNoteToHtml(note), [note]);
  const isLong = note.body.length > PREVIEW_LEN;
  const showFull = expanded || !isLong;

  return (
    <div>
      <li className="note-item">
        <div className="note-header">
          <strong>
            {noteHtml.title ? <div dangerouslySetInnerHTML={{ __html: noteHtml.title }} /> : "Untitled"}
          </strong>
          <time dateTime={new Date(note.updatedAt).toISOString()}>
            {new Date(note.updatedAt).toLocaleString()}
          </time>
        </div>

        <div className="note-body">
          {showFull ? <div dangerouslySetInnerHTML={{ __html: noteHtml.body }} />
            : <p>`${note.body.slice(0, PREVIEW_LEN)}…`</p>}
        </div>

        {isLong && (
          <button onClick={() => setExpanded((e) => !e)}>
            {showFull ? "Show less" : "Read more"}
          </button>
        )}{" "}

        <button onClick={() => onEdit(note)}>Edit</button>{" "}
        <button onClick={() => onDelete(note.id)}>Delete</button>
      </li>
    </div>
  );
}
