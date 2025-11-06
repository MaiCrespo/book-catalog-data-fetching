// src/components/LoanManager.jsx
import { useMemo, useState } from "react";

function formatDueDate(startISO, weeks) {
  const start = new Date(startISO);
  const ms = weeks * 7 * 24 * 60 * 60 * 1000;
  const due = new Date(start.getTime() + ms);
  return due.toLocaleDateString();
}

export default function LoanManager({ items, loans, onCreateLoan, onBack }) {
  const [borrower, setBorrower] = useState("");
  const [bookId, setBookId] = useState("");
  const [weeks, setWeeks] = useState(2); // 1..4

  const loanedIds = useMemo(() => new Set(loans.map((l) => l.bookId)), [loans]);
  const availableBooks = useMemo(
    () => items.filter((b) => !loanedIds.has(b.id)),
    [items, loanedIds]
  );

  const allLoaned = availableBooks.length === 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!borrower.trim() || !bookId || weeks < 1 || weeks > 4) return;

    onCreateLoan({
      id: `loan-${Date.now()}`,
      borrower: borrower.trim(),
      bookId,
      weeks: Number(weeks),
      startDate: new Date().toISOString(),
    });

    // reset
    setBorrower("");
    setBookId("");
    setWeeks(2);
  }

  return (
    <div className="loan-wrap">
      <div className="loan-header">
        <h2>Loan Management</h2>
        <button className="action-btn" onClick={onBack}>
          ← Back to Books
        </button>
      </div>

      {allLoaned ? (
        <div className="notice">
          All books are currently on loan. Please check back later.
        </div>
      ) : (
        <form className="loan-form" onSubmit={handleSubmit}>
          <div className="frow">
            <label htmlFor="borrower">Borrower</label>
            <input
              id="borrower"
              type="text"
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="frow">
            <label htmlFor="book">Book</label>
            <select
              id="book"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose a book…
              </option>
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
          <div className="frow">
            <label htmlFor="weeks">Loan period (weeks)</label>
            <input
              id="weeks"
              type="number"
              min={1}
              max={4}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              required
            />
          </div>
          <div className="loan-actions">
            <button type="submit" className="primary">
              Create Loan
            </button>
          </div>
        </form>
      )}

      <div className="loan-list">
        <h3>Loaned Books</h3>
        {loans.length === 0 ? (
          <p className="muted">No active loans.</p>
        ) : (
          <ul>
            {loans.map((l) => {
              const book = items.find((b) => b.id === l.bookId);
              if (!book) return null;
              return (
                <li key={l.id} className="loan-item">
                  <div>
                    <div className="loan-title">{book.title}</div>
                    <div className="loan-meta">
                      Borrower: <strong>{l.borrower}</strong> • Due:{" "}
                      <strong>{formatDueDate(l.startDate, l.weeks)}</strong>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
