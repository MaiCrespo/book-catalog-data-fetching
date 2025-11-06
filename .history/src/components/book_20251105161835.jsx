// src/components/book.jsx
export default function Book({
  book,
  selected,
  onToggle,
  onShowDetails, // 👈 NEW prop
}) {
  const { title, author, price, image } = book || {};

  function handleDetailsClick(e) {
    // Don’t trigger the card’s onClick (which toggles selection)
    e.stopPropagation();
    if (onShowDetails) {
      onShowDetails(book);
    }
  }

  return (
    <article
      className={`card ${selected ? "is-selected" : ""}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onToggle();
        }
      }}
    >
      <img src={image} alt={title} />
      <div className="card-body">
        <h3 className="book-title">{title}</h3>
        {author && <p className="book-meta">{author}</p>}
        {price && <p className="book-price">{price}</p>}

        {/* 👇 New internal “View details” button */}
        <button
          type="button"
          className="details-btn"
          onClick={handleDetailsClick}
        >
          View details
        </button>
      </div>
    </article>
  );
}
