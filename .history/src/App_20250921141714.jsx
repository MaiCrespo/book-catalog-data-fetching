import "./App.css";
import data from "../data/books.json";
import { Book } from "./components/Book";
import AddCard from "./components/AddCard";

export default function App() {
  const books = Array.isArray(data) ? data : data?.books ?? [];

  function handleAdd() {
    alert("Add new book (wire this up later)");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>My Book Catalog</h1>
        <p className="sub">Imported from /data/books.json</p>
      </header>

      <main className="content">
        <section className="grid">
          {/* ADD sits in its own column, aligned like a card */}
          <AddCard onClick={handleAdd} />
          {books.map((b) => (
            <Book key={b.isbn13 ?? b.title} book={b} />
          ))}
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mai Crespo</p>
      </footer>
    </div>
  );
}
