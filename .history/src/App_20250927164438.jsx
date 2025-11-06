import { useMemo, useState } from "react";
import "./App.css";
import data from "../data/books.json";
import Book from "./components/book.jsx";
import AddCard from "./components/AddCard";

export default function App() {
  // normalize JSON once
  const initialBooks = useMemo(
    () => (Array.isArray(data) ? data : data?.books ?? []),
    []
  );

  // state
  const [items, setItems] = useState(initialBooks);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);

  // helpers
  const getId = (b) => b.isbn13 ?? b.title;

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateBook = (e) => {
    e.preventDefault();
    // v3 requirement: submitting only closes modal for now
    setShowModal(false);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((b) => getId(b) !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Mai&apos;s Book Catalog</h1>
      </header>

      <main className="content">
        <div className="grid-wrapper">
          <aside className="add-col">
            <AddCard onClick={handleOpenModal} />
          </aside>

          <section className="grid-books">
            {items.map((b) => {
              const id = getId(b);
              return (
                <Book
                  key={id}
                  book={b}
                  selected={selectedIds.has(id)}
                  onToggle={() => handleToggleSelect(id)}
                  onRemove={() => handleRemove(id)}
                />
              );
            })}
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mai Crespo</p>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-book-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="new-book-title">Create a New Book</h2>
              <button
                className="icon-btn close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form className="book-form" onSubmit={handleCreateBook}>
              <label>
                Title
                <input name="title" type="text" required />
              </label>
              <label>
                Author
                <input name="author" type="text" required />
              </label>
              <label>
                Publisher
                <input name="publisher" type="text" />
              </label>
              <label>
                Publication Year
                <input name="year" type="number" min="0" />
              </label>
              <label>
                Language
                <input name="language" type="text" />
              </label>
              <label>
                Pages
                <input name="pages" type="number" min="1" />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
