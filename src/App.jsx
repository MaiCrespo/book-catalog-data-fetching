// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Book from "./components/book.jsx";
import AddCard from "./components/AddCard";
import FilterBar from "./components/FilterBar.jsx";
import LoanManager from "./components/LoanManager.jsx";
import BookDetails from "./components/BookDetails.jsx";

const LS_BOOKS = "bookCatalogV5";
const LS_LOANS = "bookCatalogV6_loans";

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_BOOKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(LS_BOOKS, JSON.stringify(items));
  }, [items]);

  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(
    () => items.find((b) => b.id === selectedId) || null,
    [items, selectedId]
  );

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

  const [loans, setLoans] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_LOANS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(LS_LOANS, JSON.stringify(loans));
  }, [loans]);

  const loanedIds = useMemo(() => new Set(loans.map((l) => l.bookId)), [loans]);

  const [view, setView] = useState("catalog");
  const [detailsBook, setDetailsBook] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingBook, setEditingBook] = useState(null);

  const openAdd = () => {
    setModalMode("add");
    setEditingBook(null);
    setShowModal(true);
  };

  const openEdit = () => {
    if (!selected) return;
    setModalMode("edit");
    setEditingBook(selected);
    setShowModal(true);
  };

  const handleDeleteSelected = () => {
    if (!selected) return;
    setItems((prev) => prev.filter((b) => b.id !== selected.id));
    setSelectedId(null);
  };

  const handleToggleSelect = (id) =>
    setSelectedId((p) => (p === id ? null : id));

  const handleCreateLoan = (loan) => {
    if (loanedIds.has(loan.bookId)) return;
    setLoans((prev) => [loan, ...prev]);
    setSelectedId(null);
  };

  const handleSubmitBook = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const title = String(form.get("title") || "").trim();
    const author = String(form.get("author") || "").trim();
    const publisher = String(form.get("publisher") || "").trim();
    const yearRaw = String(form.get("year") || "").trim();
    const language = String(form.get("language") || "").trim();
    const pagesRaw = String(form.get("pages") || "").trim();
    const coverUrl = String(form.get("coverUrl") || "").trim();

    if (!title || !author || !coverUrl) return;

    const year = yearRaw ? Number(yearRaw) : undefined;
    const pages = pagesRaw ? Number(pagesRaw) : undefined;

    const payload = {
      title,
      author,
      publisher,
      year,
      language,
      pages,
      image: coverUrl,
      url: coverUrl,
    };

    if (modalMode === "add") {
      const newBook = {
        id: `local-${Date.now()}`,
        ...payload,
      };
      setItems((prev) => [newBook, ...prev]);
    } else if (modalMode === "edit" && editingBook) {
      setItems((prev) =>
        prev.map((b) => (b.id === editingBook.id ? { ...b, ...payload } : b))
      );
    }

    setShowModal(false);
    setEditingBook(null);
    e.currentTarget.reset();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <h1>Mai&apos;s Book Catalog</h1>
          <div className="view-switch">
            <button
              className={`tab ${view === "catalog" ? "active" : ""}`}
              onClick={() => setView("catalog")}
              type="button"
            >
              Books
            </button>
            <button
              className={`tab ${view === "loans" ? "active" : ""}`}
              onClick={() => setView("loans")}
              type="button"
            >
              Loans
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        {view === "loans" ? (
          <LoanManager
            items={items}
            loans={loans}
            onCreateLoan={handleCreateLoan}
            onBack={() => setView("catalog")}
          />
        ) : detailsBook ? (
          <BookDetails
            book={detailsBook}
            onClose={() => setDetailsBook(null)}
          />
        ) : (
          <>
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
                    onLoan={loanedIds.has(b.id)}
                    onShowDetails={setDetailsBook}
                  />
                ))}
              </section>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mai Crespo</p>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="modal-title">
                {modalMode === "add" ? "Add Book" : "Edit Book"}
              </h2>
              <button
                className="icon-btn close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form className="book-form wide" onSubmit={handleSubmitBook}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={editingBook?.title || ""}
                required
              />

              <label htmlFor="author">Author</label>
              <input
                id="author"
                name="author"
                type="text"
                defaultValue={editingBook?.author || ""}
                required
              />

              <label htmlFor="publisher">Publisher</label>
              <input
                id="publisher"
                name="publisher"
                type="text"
                defaultValue={editingBook?.publisher || ""}
              />

              <label htmlFor="year">Publication Year</label>
              <input
                id="year"
                name="year"
                type="number"
                min="0"
                defaultValue={editingBook?.year || ""}
              />

              <label htmlFor="language">Language</label>
              <input
                id="language"
                name="language"
                type="text"
                defaultValue={editingBook?.language || ""}
              />

              <label htmlFor="pages">Pages</label>
              <input
                id="pages"
                name="pages"
                type="number"
                min="1"
                defaultValue={editingBook?.pages || ""}
              />

              <label htmlFor="coverUrl">URL (book cover)</label>
              <input
                id="coverUrl"
                name="coverUrl"
                type="url"
                defaultValue={editingBook?.image || editingBook?.url || ""}
                required
              />

              <div className="modal-actions two-col">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBook(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {modalMode === "add" ? "Save" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
