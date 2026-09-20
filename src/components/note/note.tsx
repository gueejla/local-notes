import { useState, useEffect } from "react";
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
  const [noteHtml, setNoteHtml] = useState(note);
  const isLong = note.body.length > PREVIEW_LEN;
  const showFull = expanded || !isLong;

  useEffect(() => {
    setNoteHtml(convertNoteToHtml(structuredClone(note)));
  }, [note]);

  return (
    <div>
        <li className="note-item">
          <div className="note-header">
            <strong>
              <div dangerouslySetInnerHTML={{ __html: noteHtml.title }} />
            </strong>
            <time dateTime={new Date(note.updatedAt).toISOString()}>
              {new Date(note.updatedAt).toLocaleString()}
            </time>
          </div>

          <p className="note-body">
            {showFull ? <div dangerouslySetInnerHTML={{ __html: noteHtml.body }} />
              : `${note.body.slice(0, PREVIEW_LEN)}…`}
          </p>

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
