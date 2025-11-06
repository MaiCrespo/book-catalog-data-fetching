// src/components/BookDetails.jsx
import { useEffect, useState } from "react";

const API_BASE = "https://api.itbook.store/1.0/search/";

export default function BookDetails({ book, onClose }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // pick something simple to search by – first word of title
  const query = (book?.title || "").split(" ")[0] || "javascript";

  useEffect(() => {
    let cancelled = false;

    async function loadSimilar() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          setSimilar(Array.isArray(data.books) ? data.books : []);
        }
      } catch (err) {
        if (!cancelled) setError("Could not load similar books.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSimilar();
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!book) return null;

  const { title, author, publisher, year, pages, language, price, image, url } =
    book;

  return (
    <div className="details-view">
      <header className="details-header">
        <button className="action-btn" onClick={onClose}>
          ← Back to list
        </button>
      </header>

      <section className="details-main">
        <div className="details-cover">
          <img src={image} alt={title} />
        </div>

        <div className="details-info">
          <h2>{title}</h2>
          {author && (
            <p>
              <strong>Author:</strong> {author}
            </p>
          )}
          {publisher && (
            <p>
              <strong>Publisher:</strong> {publisher}
            </p>
          )}
          {year && (
            <p>
              <strong>Publication year:</strong> {year}
            </p>
          )}
          {pages && (
            <p>
              <strong>Pages:</strong> {pages}
            </p>
          )}
          {language && (
            <p>
              <strong>Language:</strong> {language}
            </p>
          )}
          {price && (
            <p>
              <strong>Price:</strong> {price}
            </p>
          )}

          {url && (
            <p>
              <a href={url} target="_blank" rel="noopener noreferrer">
                View original listing ↗
              </a>
            </p>
          )}
        </div>
      </section>

      <section className="details-similar">
        <h3>Similar books</h3>

        {loading && <p className="muted">Loading similar books…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && similar.length === 0 && (
          <p className="muted">No similar books found for “{query}”.</p>
        )}

        <div className="similar-grid">
          {similar.map((b) => (
            <article key={b.isbn13} className="similar-card">
              <img src={b.image} alt={b.title} />
              <div className="similar-body">
                <div className="similar-title">{b.title}</div>
                {b.price && <div className="similar-price">{b.price}</div>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
