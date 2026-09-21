// src/lib/markdown.test.ts
import { describe, it, expect, vi } from 'vitest';
import { convertNoteToHtml, convertMdToHtml } from '@/lib/markdown';
import type { Note } from '@/models/note';

// Mock marked and DOMPurify since they're external deps
vi.mock('marked', () => ({
  marked: {
    parse: vi.fn((md: string) => `<p>${md}</p>`),
  },
}));

vi.mock('isomorphic-dompurify', () => ({
  default: {
    sanitize: vi.fn((html: string) => html),
  },
}));

describe('markdown.ts', () => {
  describe('convertMdToHtml', () => {
    it('converts plain text to paragraph', () => {
      const result = convertMdToHtml('Hello world');
      expect(result).toBe('<p>Hello world</p>');
    });

    it('converts markdown headers', () => {
      const result = convertMdToHtml('# Heading');
      expect(result).toBe('<p># Heading</p>');
    });

    it('handles empty string', () => {
      const result = convertMdToHtml('');
      expect(result).toBe('<p></p>');
    });
  });

  describe('convertNoteToHtml', () => {
    const mockNote: Note = {
      id: 'test-id',
      title: 'Test Title',
      body: 'Test **body**',
      updatedAt: Date.now(),
      createdAt: Date.now(),
      tags: 'tag1,tag2',
    };

    it('converts both title and body to HTML', () => {
      const result = convertNoteToHtml(mockNote);

      expect(result.id).toBe('test-id');
      expect(result.title).toBe('<p>Test Title</p>');
      expect(result.body).toBe('<p>Test **body**</p>');
      expect(result.tags).toBe('tag1,tag2');
      expect(result.updatedAt).toBe(mockNote.updatedAt);
      expect(result.createdAt).toBe(mockNote.createdAt);
    });

    it('preserves all note properties', () => {
      const result = convertNoteToHtml(mockNote);

      // Original properties preserved
      expect(result.id).toBe(mockNote.id);
      expect(result.updatedAt).toBe(mockNote.updatedAt);
      expect(result.createdAt).toBe(mockNote.createdAt);
      expect(result.tags).toBe(mockNote.tags);
    });

    it('handles note without tags', () => {
      const noteWithoutTags: Note = { ...mockNote, tags: undefined };
      const result = convertNoteToHtml(noteWithoutTags);
      expect(result.tags).toBeUndefined();
    });

    it('returns new object (immutability)', () => {
      const result = convertNoteToHtml(mockNote);
      expect(result).not.toBe(mockNote);
    });
  });
});