import "./App.css";
import data from "../data/books.json";
import Book from "./components/book";
import AddCard from "./components/AddCard";

export default function App() {
  const books = Array.isArray(data) ? data : data?.books ?? [];

  return (
    <div className="app">
      <header className="header">
        <h1>Mai's Book Catalog</h1>
        <p className="sub">Imported from /data/books.json</p>
      </header>

      <main className="content">
        <section className="grid">
          <AddCard onClick={() => alert("Add new book")} />
          {books.map((b) => (
            <Book key={b.isbn13 ?? b.title} book={b} />
          ))}
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Your Name</p>
      </footer>
    </div>
  );
}
