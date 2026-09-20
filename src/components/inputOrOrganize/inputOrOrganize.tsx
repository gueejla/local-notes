import { useEffect, useState } from "react";
import type { Note } from "@/models/note";
import {
  SORTINGS,
  SORTINGDIRECTIONS,
  type Sort,
  type SortDirection,
} from "@/models/sort";

type Props = {
  notes: Note[];
  onSortedNotes: (notes: Note[]) => void;
};

export function InputOrOrganize({ notes, onSortedNotes }: Props) {
  const [sortNotesBy, setSortNotesBy] = useState<Sort>(() => {
    return (localStorage.getItem("sortBy") as Sort) || "updatedAt";
  });
  const [sortNotesDirection, setSortNotesDirection] = useState<SortDirection>(() => {
    return (localStorage.getItem("sortDirection") as SortDirection) || "Desc";
  });

  useEffect(() => {
    localStorage.setItem("sortBy", sortNotesBy);
    localStorage.setItem("sortDirection", sortNotesDirection);

    const sortedNotes = [...notes].sort((noteA, noteB) => {
      const valueA = noteA[sortNotesBy];
      const valueB = noteB[sortNotesBy];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortNotesDirection === "Asc" ? valueA - valueB : valueB - valueA;
      }

      const comparison = String(valueA ?? "").localeCompare(String(valueB ?? ""));
      return sortNotesDirection === "Asc" ? comparison : -comparison;
    });

    if (sortedNotes.some((note, index) => note.id !== notes[index]?.id)) {
      onSortedNotes(sortedNotes);
    }
  }, [notes, onSortedNotes, sortNotesBy, sortNotesDirection]);

  return (
    <>
      Sort by:{" "}
      <select
        id="sort-notes-by"
        value={sortNotesBy}
        onChange={(e) => setSortNotesBy(e.target.value as Sort)}
      >
        {SORTINGS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>{" "}
      <select
        id="sort-notes-direction"
        value={sortNotesDirection}
        onChange={(e) => setSortNotesDirection(e.target.value as SortDirection)}
      >
        {SORTINGDIRECTIONS.map((direction) => (
          <option key={direction} value={direction}>
            {direction}
          </option>
        ))}
      </select>
    </>
  );
}