// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Book from "./components/book.jsx";
import AddCard from "./components/AddCard";
import FilterBar from "./components/FilterBar.jsx";

const LS_KEY = "bookCatalogV5";

export default function App() {
  // ---- DATA ----
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  // selection (only one at a time)
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(
    () => items.find((b) => b.id === selectedId) || null,
    [items, selectedId]
  );

  // ---- FILTERS ----
  const [filters, setFilters] = useState({
    q: "",
    publisher: "ALL",
    language: "ALL",
  });

  const publishers = useMemo(() => {
    const set = new Set(items.map((b) => b.publisher).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [items]);

  const languages = useMemo(() => {
    const set = new Set(items.map((b) => b.language).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return items.filter((b) => {
      const matchesQ =
        !q ||
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q);
      const matchesPublisher =
        filters.publisher === "ALL" || b.publisher === filters.publisher;
      const matchesLanguage =
        filters.language === "ALL" || b.language === filters.language;
      return matchesQ && matchesPublisher && matchesLanguage;
    });
  }, [items, filters]);

  // ---- MODAL (reused for add/edit) ----
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "edit"
  const [draft, setDraft] = useState(emptyDraft());

  function emptyDraft() {
    return {
      title: "",
      author: "",
      publisher: "",
      year: "",
      language: "",
      pages: "",
      coverUrl: "",
    };
  }

  const openAdd = () => {
    setMode("add");
    setDraft(emptyDraft());
    setShowModal(true);
  };

  const openEdit = () => {
    if (!selected) return;
    setMode("edit");
    setDraft({
      title: selected.title || "",
      author: selected.author || "",
      publisher: selected.publisher || "",
      year: selected.year || "",
      language: selected.language || "",
      pages: selected.pages || "",
      coverUrl: selected.image || selected.url || "",
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // ---- CRUD ----
  const handleToggleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleDeleteSelected = () => {
    if (!selected) return;
    setItems((prev) => prev.filter((b) => b.id !== selected.id));
    setSelectedId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      title: String(form.get("title") || "").trim(),
      author: String(form.get("author") || "").trim(),
      publisher: String(form.get("publisher") || "").trim(),
      year: form.get("year") ? Number(form.get("year")) : undefined,
      language: String(form.get("language") || "").trim(),
      pages: form.get("pages") ? Number(form.get("pages")) : undefined,
      image: String(form.get("coverUrl") || "").trim(),
      url: String(form.get("coverUrl") || "").trim(),
    };

    if (!payload.title || !payload.author || !payload.image) return;

    if (mode === "add") {
      const newBook = {
        id: `local-${Date.now()}`,
        ...payload,
      };
      setItems((prev) => [newBook, ...prev]);
    } else if (mode === "edit" && selected) {
      setItems((prev) =>
        prev.map((b) => (b.id === selected.id ? { ...b, ...payload } : b))
      );
    }

    setShowModal(false);
    e.currentTarget.reset();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Mai&apos;s Book Catalog</h1>
      </header>

      <main className="content">
        {/* Filters */}
        <FilterBar
          q={filters.q}
          publisher={filters.publisher}
          language={filters.language}
          publishers={publishers}
          languages={languages}
          onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
          onReset={() =>
            setFilters({ q: "", publisher: "ALL", language: "ALL" })
          }
        />

        <div className="grid-wrapper">
          <aside className="add-col">
            <AddCard onClick={openAdd} />
            <div className="actions">
              <button
                className="action-btn"
                type="button"
                onClick={openEdit}
                disabled={!selected}
              >
                Update
              </button>
              <button
                className="action-btn danger"
                type="button"
                onClick={handleDeleteSelected}
                disabled={!selected}
              >
                Delete
              </button>
            </div>
          </aside>

          <section className="grid-books">
            {filtered.map((b) => (
              <Book
                key={b.id}
                book={b}
                selected={b.id === selectedId}
                onToggle={() => handleToggleSelect(b.id)}
              />
            ))}
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mai Crespo</p>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="modal-title">
                {mode === "add" ? "Add Book" : "Edit Book"}
              </h2>
              <button
                className="icon-btn close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form
              className="book-form wide"
              onSubmit={handleSubmit}
              onChange={(e) => {
                const fd = new FormData(e.currentTarget);
                setDraft({
                  title: fd.get("title") || "",
                  author: fd.get("author") || "",
                  publisher: fd.get("publisher") || "",
                  year: fd.get("year") || "",
                  language: fd.get("language") || "",
                  pages: fd.get("pages") || "",
                  coverUrl: fd.get("coverUrl") || "",
                });
              }}
            >
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={draft.title}
                required
              />

              <label htmlFor="author">Author</label>
              <input
                id="author"
                name="author"
                type="text"
                defaultValue={draft.author}
                required
              />

              <label htmlFor="publisher">Publisher</label>
              <input
                id="publisher"
                name="publisher"
                type="text"
                defaultValue={draft.publisher}
              />

              <label htmlFor="year">Publication Year</label>
              <input
                id="year"
                name="year"
                type="number"
                min="0"
                defaultValue={draft.year}
              />

              <label htmlFor="language">Language</label>
              <input
                id="language"
                name="language"
                type="text"
                defaultValue={draft.language}
              />

              <label htmlFor="pages">Pages</label>
              <input
                id="pages"
                name="pages"
                type="number"
                min="1"
                defaultValue={draft.pages}
              />

              <label htmlFor="coverUrl">URL (book cover)</label>
              <input
                id="coverUrl"
                name="coverUrl"
                type="url"
                defaultValue={draft.coverUrl}
                required
              />

              <div className="modal-actions two-col">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {mode === "add" ? "Save" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
