// src/components/BookDetails.jsx
import { useEffect, useMemo, useState } from "react";

export default function BookDetails({ book, onClose }) {
  const { title, author, publisher, year, language, pages, image } = book || {};

  const query = useMemo(() => {
    if (title && title.trim().length > 0) {
      return title.split(" ").slice(0, 3).join(" ");
    }
    if (author && author.trim().length > 0) return author;
    if (publisher && publisher.trim().length > 0) return publisher;
    return "javascript";
  }, [title, author, publisher]);

  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchSimilar = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `https://api.itbook.store/1.0/search/${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setSimilar(Array.isArray(data.books) ? data.books : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load similar books.");
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSimilar();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="details-view">
      <button className="back-btn" type="button" onClick={onClose}>
        ← Back to list
      </button>

      <section className="details-main">
        <div className="details-cover">
          {image && <img src={image} alt={title} />}
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
              <strong>Year:</strong> {year}
            </p>
          )}

          {language && (
            <p>
              <strong>Language:</strong> {language}
            </p>
          )}

          {pages && (
            <p>
              <strong>Pages:</strong> {pages}
            </p>
          )}
        </div>
      </section>

      <section className="details-similar">
        <h3>Similar books</h3>

        {loading && <p>Loading similar books…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && similar.length === 0 && (
          <p>No similar books found.</p>
        )}

        <div className="similar-grid">
          {similar.map((s) => (
            <article key={s.isbn13} className="similar-card">
              <img src={s.image} alt={s.title} />
              <h4>{s.title}</h4>
              {s.price && <p className="similar-price">{s.price}</p>}
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="similar-link"
                >
                  View on itbook.store
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
