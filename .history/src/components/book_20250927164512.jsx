export default function Book({ book, selected, onToggle, onRemove }) {
  const { title, price, image, url } = book || {};

  const handleRemoveClick = (e) => {
    e.stopPropagation(); // don't toggle selection when removing
    onRemove?.();
  };

  return (
    <article
      className={`card book-card ${selected ? "selected" : ""}`}
      onClick={onToggle}
      tabIndex={0}
      aria-pressed={selected}
    >
      <button
        className="remove-btn"
        onClick={handleRemoveClick}
        aria-label={`Remove ${title}`}
        title="Remove"
      >
        ×
      </button>

      <img src={image} alt={title} />
      <div className="card-body">
        <h3 className="book-title">{title}</h3>
        <p className="book-price">{price ?? "—"}</p>
        <a
          className="details"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Details
        </a>
      </div>
    </article>
  );
}
