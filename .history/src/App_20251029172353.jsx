// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Book from "./components/book.jsx";
import AddCard from "./components/AddCard";
import FilterBar from "./components/FilterBar.jsx";
import LoanManager from "./components/LoanManager.jsx";

const LS_BOOKS = "bookCatalogV5";
const LS_LOANS = "bookCatalogV6_loans";

export default function App() {
  // ---- books (same as your v5) ----
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

  // selection
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(
    () => items.find((b) => b.id === selectedId) || null,
    [items, selectedId]
  );

  // ---- filters (your v5) ----
  const [filters, setFilters] = useState({ q: "", publisher: "ALL", language: "ALL" });
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
        !q || b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
      const matchesPublisher = filters.publisher === "ALL" || b.publisher === filters.publisher;
      const matchesLanguage = filters.language === "ALL" || b.language === filters.language;
      return matchesQ && matchesPublisher && matchesLanguage;
    });
  }, [items, filters]);

  // ---- loans ----
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

  // ---- view toggle ----
  const [view, setView] = useState("catalog"); // "catalog" | "loans"

  // ---- handlers you already have (examples shown briefly) ----
  const openAdd = () => {/* your existing add modal open */};
  const openEdit = () => {/* your existing edit modal open */};
  const handleDeleteSelected = () => {/* your existing delete book */};
  const handleToggleSelect = (id) => setSelectedId((p) => (p === id ? null : id));

  // ---- loan create ----
  const handleCreateLoan = (loan) => {
    // prevent duplicates by bookId
    if (loanedIds.has(loan.bookId)) return;
    setLoans((prev) => [loan, ...prev]);
    // Note: optional: auto select none to avoid confusion
    setSelectedId(null);
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
        ) : (
          <>
            {/* Filters (keep from v5) */}
            <FilterBar
              q={filters.q}
              publisher={filters.publisher}
              language={filters.language}
              publishers={publishers}
              languages={languages}
              onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
              onReset={() => setFilters({ q: "", publisher: "ALL", language: "ALL" })}
            />

            <div className="grid-wrapper">
              <aside className="add-col">
                <AddCard onClick={openAdd} />
                <div className="actions">
                  <button className="action-btn" type="button" onClick={openEdit} disabled={!selected}>
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
                    onLoan={loanedIds.has(b.id)}    {/* NEW: loan flag */}
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

      {/* keep your add/edit modal here */}
    </div>
  );
}
