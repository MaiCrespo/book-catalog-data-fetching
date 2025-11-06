// src/components/book.jsx
export default function Book({
  book,
  selected,
  onToggle,
  onLoan = false,
  onShowDetails,
}) {
  const { title, author, price, image, url } = book || {};

  const handleCardClick = () => {
    if (onToggle) onToggle();
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation(); // don't toggle selection
    if (onShowDetails) {
      onShowDetails(book);
    } else if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article
      className={`card ${selected ? "is-selected" : ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <img src={image} alt={title} />
      <div className="card-body">
        <h3 className="book-title">{title}</h3>

        {author && <p className="book-meta">{author}</p>}

        {price && <p className="book-price">{price}</p>}

        {onLoan && (
          <p className="loan-badge" aria-label="Book currently on loan">
            On loan
          </p>
        )}

        <button
          type="button"
          className="details-btn"
          onClick={handleDetailsClick}
        >
          Details
        </button>
      </div>
    </article>
  );
}
