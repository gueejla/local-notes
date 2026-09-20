import { marked } from 'marked';
import DOMPurify from "isomorphic-dompurify";
import type { Note } from '@/models/note';

function convertMdToHtml(mdText: string) : string {
  const html = marked.parse(mdText) as string;
  const cleanHtml = DOMPurify.sanitize(html);

  return cleanHtml;
}

export function convertNoteToHtml(note: Note) : Note {
  const htmlTitle = convertMdToHtml(note.title);
  const htmlBody = convertMdToHtml(note.body);
  const newNote: Note = {...note, title: htmlTitle, body: htmlBody};

  return newNote;
}
