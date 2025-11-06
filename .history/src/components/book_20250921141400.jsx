export default function Book(props) {
  const { title, price, image, url } = book || {};
  return (
    <article className="card">
      <img src={image} alt={title} />
      <div className="card-body">
        <h3 className="book-title">{title}</h3>
        <p className="book-price">{price ?? "—"}</p>
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
