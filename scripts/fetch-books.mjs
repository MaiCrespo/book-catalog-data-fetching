import fs from "node:fs/promises";

const topic = "javascript";
const page = 1;

const res = await fetch(`https://api.itbook.store/1.0/search/${topic}/${page}`);
const data = await res.json();
const books = (data.books ?? []).map((b) => ({
  title: b.title,
  price: b.price,
  image: b.image,
  url: b.url,
  isbn13: b.isbn13,
}));

await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/books.json", JSON.stringify(books, null, 2));

console.log(`Saved ${books.length} books to data/books.json`);
