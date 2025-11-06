export default function Book({
  book,
  selected,
  onToggle,
  onLoan = false,
  onShowDetails,
}) {
  const { title, author, price, image } = book || {};

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    if (onShowDetails) onShowDetails(book);
  };

  return (
    <article
      className={`card ${selected ? "is-selected" : ""} ${
        onLoan ? "is-loaned" : ""
      }`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
    >
      <div className="thumb-wrap">
        {onLoan && <span className="badge-loan">On loan</span>}
        <img src={image} alt={title} />
      </div>

      <div className="card-body">
        <h3 className="book-title">{title}</h3>
        {author && <p className="book-meta">{author}</p>}
        {price && <p className="book-price">{price}</p>}
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
