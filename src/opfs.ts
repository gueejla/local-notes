export interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
  createdAt: number;
}

const encoder = new TextEncoder();

async function getNotesDir(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  // create: true makes it on first use; returns existing handle afterwards
  return root.getDirectoryHandle("notes", { create: true });
}

export async function listNotes(): Promise<Note[]> {
  const dir = await getNotesDir();
  const notes: Note[] = [];
  // async iteration over the directory entries
  for await (const [name, handle] of (dir as any).entries()) {
    if (handle.kind === "file" && name.endsWith(".json")) {
      const file = await handle.getFile();
      notes.push(JSON.parse(await file.text()) as Note);
    }
  }
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveNote(note: Note): Promise<void> {
  const dir = await getNotesDir();
  const handle = await dir.getFileHandle(`${note.id}.json`, { create: true });
  const writable = await handle.createWritable(); // FileSystemWritableFileStream
  await writable.write(encoder.encode(JSON.stringify(note, null, 2)));
  await writable.close();
}

export async function deleteNote(id: string): Promise<void> {
  const dir = await getNotesDir();
  await dir.removeEntry(`${id}.json`);
}

export async function estimateUsage(): Promise<string> {
  const { usage, quota } = await navigator.storage.estimate();
  const mb = (n: number) => (n / 1024 / 1024).toFixed(1);
  return `${mb(usage ?? 0)} MB used of ~${mb(quota ?? 0)} MB quota`;
}
