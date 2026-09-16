// src/export.ts
// Exports all notes from OPFS into a downloadable zip of markdown files.
import JSZip from "jszip";
import { listNotes, type Note } from "@/lib/opfs";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatLocalDateTime(ms: number): string {
  const d = new Date(ms);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

/** Make a filename safe across OSes (strip path separators, reserved chars). */
function slugify(title: string): string {
  const base = title
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-");
  return base.length > 0 ? base.slice(0, 80) : "untitled";
}

/** Build markdown content with YAML-ish front matter. */
function toMarkdown(note: Note): string {
  const fm = [
    "---",
    `id: ${note.id}`,
    `title: ${JSON.stringify(note.title)}`,
    `created: ${formatLocalDateTime(note.createdAt)}`,
    `updated: ${formatLocalDateTime(note.updatedAt)}`,
    "---",
    "",
  ].join("\n");

  // H1 heading from the title, then the body
  return `${fm}# ${note.title || "(untitled)"}\n\n${note.body}\n`;
}

export async function exportNotesToZip(): Promise<void> {
  const notes = await listNotes();
  if (notes.length === 0) {
    throw new Error("No notes to export.");
  }

  const zip = new JSZip();
  const used = new Map<string, number>();

  for (const note of notes) {
    // Deduplicate filenames by appending -2, -3, etc.
    let name = slugify(note.title);
    const count = used.get(name) ?? 0;
    used.set(name, count + 1);
    if (count > 0) name = `${name}-${count + 1}`;

    zip.file(`${name}.md`, toMarkdown(note));
  }

  const blob = await zip.generateAsync({ type: "blob" });

  // Trigger a browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `notes-${formatLocalDateTime(Date.now()).replace(/[: ]/g, "-")}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
