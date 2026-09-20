export type Align = "left" | "center" | "right" | "between";
export const ALIGNS: { value: Align; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Centered" },
  { value: "right", label: "Right" },
  { value: "between", label: "Space Between" },
];
