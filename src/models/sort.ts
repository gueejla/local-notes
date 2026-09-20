// TODO: potentially get these programatically from notes.ts Note type?
export type Sort = "updatedAt" | "createdAt" | "title" | "tags" | "id";
export const SORTINGS: { value: Sort; label: string }[] = [
  { value: "updatedAt", label: "Updated Time (Default)" },
  { value: "createdAt", label: "Created Time" },
  { value: "title", label: "Title Text" },
  { value: "tags", label: "Tags Text" },
  { value: "id", label: "Note UUID" },
];

export type SortDirection = "Asc" | "Desc";
export const SORTINGDIRECTIONS = ["Asc", "Desc"];
