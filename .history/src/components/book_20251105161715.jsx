export default function Book({ book, selected, onToggle }) {
  const { title, author, price, image, url } = book || {};
  return (
    <article
      className={`card ${selected ? "is-selected" : ""}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
    >
      <img src={image} alt={title} />
      <div className="card-body">
        <h3 className="book-title">{title}</h3>
        {author && <p className="book-meta">{author}</p>}
        {price && <p className="book-price">{price}</p>}
        <a
          className="details"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Details
        </a>
      </div>
    </article>
  );
}
