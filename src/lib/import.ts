// Imports notes from a zip of markdown files (format produced by export.ts)
// back into OPFS. Existing notes with the same id are overwritten.
import JSZip from "jszip";
import { saveNote } from "@/lib/opfs";
import type { Note } from "@/models/note";

/** Parse "YYYY-MM-DD HH:MM:SS" (local time, as written by export) into epoch ms. */
function parseLocalDateTime(s: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})$/.exec(s.trim());
  if (!m) return Date.now();
  const [y, mo, d, h, mi, se] = m.slice(1).map(Number);
  return new Date(y, mo - 1, d, h, mi, se).getTime();
}

/** Parse the YAML-ish front matter + H1 + body format written by export.ts. */
function fromMarkdown(text: string): Note {
  const lines = text.split("\n");
  const fm: Record<string, string> = {};
  let i = 0;

  if (lines[0]?.trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") {
      const idx = lines[i].indexOf(":");
      if (idx > 0) fm[lines[i].slice(0, idx).trim()] = lines[i].slice(idx + 1).trim();
      i++;
    }
    i++; // skip closing "---"
  }

  // Skip blank lines and the H1 heading (title is authoritative in front matter)
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i < lines.length && lines[i].startsWith("# ")) i++;
  while (i < lines.length && lines[i].trim() === "") i++;

  // Unquote JSON-stringified title if it was quoted
  let title = fm.title ?? "";
  try {
    title = JSON.parse(title) as string;
  } catch {
    // not quoted — keep as-is
  }

  const now = Date.now();
  const id = /^[A-Za-z0-9_-]+$/.test(fm.id ?? "") ? fm.id! : crypto.randomUUID();

  return {
    id,
    title,
    body: lines.slice(i).join("\n").replace(/\n$/, ""),
    createdAt: fm.created ? parseLocalDateTime(fm.created) : now,
    updatedAt: fm.updated ? parseLocalDateTime(fm.updated) : now,
  };
}

export async function importNotesFromZip(file: File): Promise<number> {
  const zip = await JSZip.loadAsync(file);

  const entries = Object.values(zip.files).filter(
    (f) => !f.dir && f.name.endsWith(".md") && !f.name.split("/").pop()?.startsWith("__MACOSX"),
  );
  if (entries.length === 0) {
    throw new Error("No markdown notes found in zip.");
  }

  for (const entry of entries) {
    const text = await entry.async("string");
    await saveNote(fromMarkdown(text));
  }

  return entries.length;
}
