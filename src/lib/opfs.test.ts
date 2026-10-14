import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteNote, listNotes, saveNote } from '@/lib/opfs';
import type { Note } from '@/models/note';

const files = new Map<string, string>();

function createFileHandle(name: string) {
  return {
    kind: 'file' as const,
    getFile: async () => new File([files.get(name) ?? ''], name),
    createWritable: async () => ({
      write: async (content: Uint8Array) => {
        files.set(name, new TextDecoder().decode(content));
      },
      close: async () => {},
    }),
  };
}

const notesDirectory = {
  getFileHandle: async (name: string) => createFileHandle(name),
  removeEntry: async (name: string) => {
    if (!files.delete(name)) throw new DOMException('File not found', 'NotFoundError');
  },
  async *entries() {
    for (const name of files.keys()) {
      yield [name, createFileHandle(name) as unknown as FileSystemHandle];
    }
  },
} as unknown as FileSystemDirectoryHandle;

const rootDirectory = {
  getDirectoryHandle: async () => notesDirectory,
} as unknown as FileSystemDirectoryHandle;

const note: Note = {
  id: 'note-1',
  title: 'First note',
  body: 'Note contents',
  createdAt: 1,
  updatedAt: 1,
};

beforeEach(() => {
  files.clear();
  vi.stubGlobal('navigator', {
    storage: {
      getDirectory: async () => rootDirectory,
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('note persistence', () => {
  it('creates and lists a note', async () => {
    await saveNote(note);

    await expect(listNotes()).resolves.toEqual([note]);
  });

  it('updates an existing note with the same ID', async () => {
    await saveNote(note);
    const updatedNote = {
      ...note,
      title: 'Updated title',
      body: 'Updated contents',
      updatedAt: 2,
    };

    await saveNote(updatedNote);

    await expect(listNotes()).resolves.toEqual([updatedNote]);
  });

  it('deletes a saved note', async () => {
    await saveNote(note);

    await deleteNote(note.id);

    await expect(listNotes()).resolves.toEqual([]);
  });
});
