import "./App.css";
import data from "../data/books.json";
import Book from "./components/book.jsx";
import AddCard from "./components/AddCard";

export default function App() {
  const books = Array.isArray(data) ? data : data?.books ?? [];

  return (
    <div className="app">
      <header className="header">
        <h1>Mai's Book Catalog</h1>
      </header>

      <main className="content">
        <section className="grid two-cols">
          <div className="add-column">
            <AddCard onClick={() => alert("Add new book")} />
          </div>

          <div className="books-grid">
            {books.map((b) => (
              <Book key={b.isbn13 ?? b.title} book={b} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mai Crespo</p>
      </footer>
    </div>
  );
}
