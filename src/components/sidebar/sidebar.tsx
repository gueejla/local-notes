import { useState, useEffect } from "react";
import { exportNotesToZip } from "@/lib/export";

type Theme = "light" | "dark" | "solarized" | "cozy";
const THEMES: Theme[] = ["light", "dark", "solarized", "cozy"];

type Align = "left" | "center" | "right" | "between";
const ALIGNS: { value: Align; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Centered" },
  { value: "right", label: "Right" },
  { value: "between", label: "Space Between" },
];

type Props = {
  sidebarOpen: boolean;
};

export function Sidebar({ sidebarOpen}: Props) {  
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "light";
  });
  const [align, setAlign] = useState<Align>(() => {
    return (localStorage.getItem("align") as Align) || "left"
  });
  
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.align = align; // ← add
    localStorage.setItem("align", align);           // ← add
  }, [theme, align]);

  return (
    <aside id="app-sidebar" className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <section className="sidebar-section">
          <h2>Theme</h2>
          <label htmlFor="theme-select" className="visually-hidden">
          Theme
          </label>
          <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          >
          {THEMES.map((t) => (
              <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
          ))}
          </select>
      </section>

      <section className="sidebar-section">
          <h2>Text Alignment</h2>
          <label htmlFor="text-alignment" className="visually-hidden">
          Text Alignment
          </label>
          <select
          id="text-alignment"
          value={align}
          onChange={(e) => setAlign(e.target.value as Align)}
          >
          {ALIGNS.map(({value, label}) => (
              <option key={value} value={value}>
              {label}
              </option>
          ))}
          </select>
      </section>

      <section className="sidebar-section">
          <h2>Export</h2>
          <button onClick={() => exportNotesToZip().catch((e) => alert(String(e)))}>
          Export all notes (.zip)
          </button>
      </section>

    </aside>
  );
}
