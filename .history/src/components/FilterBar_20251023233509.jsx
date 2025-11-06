// src/components/FilterBar.jsx
export default function FilterBar({
  q,
  publisher,
  language,
  publishers = ["ALL"],
  languages = ["ALL"],
  onChange,
  onReset,
}) {
  return (
    <div className="filters">
      <input
        className="filter-input"
        type="search"
        placeholder="Search by title or author…"
        value={q}
        onChange={(e) => onChange({ q: e.target.value })}
      />

      <select
        className="filter-select"
        value={publisher}
        onChange={(e) => onChange({ publisher: e.target.value })}
      >
        {publishers.map((p) => (
          <option key={p} value={p}>
            {p === "ALL" ? "All publishers" : p}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={language}
        onChange={(e) => onChange({ language: e.target.value })}
      >
        {languages.map((l) => (
          <option key={l} value={l}>
            {l === "ALL" ? "All languages" : l}
          </option>
        ))}
      </select>

      <button className="filter-reset" type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
