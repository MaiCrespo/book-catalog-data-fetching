export default function AddCard({ onClick }) {
  return (
    <button
      className="card add-card"
      onClick={onClick}
      aria-label="Add new book"
    >
      <span className="add-plus">+</span>
      <span className="add-text">Add</span>
    </button>
  );
}
