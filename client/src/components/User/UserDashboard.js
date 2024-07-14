import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const UserLandingPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filter, setFilter] = useState({
    name: "",
    author: "",
    genre: "",
    year: "",
  });
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, [books]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filter, sort, books]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/books`);
      if (response.status === 200) {
        const data = await response.json();
        setBooks(data.books);
      } else {
        console.error("Failed to fetch books:", response.message);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(filter.name.toLowerCase()) &&
        book.author.toLowerCase().includes(filter.author.toLowerCase()) &&
        book.genre.toLowerCase().includes(filter.genre.toLowerCase()) &&
        book.year.toString().includes(filter.year)
    );

    if (sort) {
      filtered = filtered.sort((a, b) => {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      });
    }

    setFilteredBooks(filtered);
  };

  const handleBorrowBook = async (isbn) => {
    const userEmail = localStorage.getItem('email')
    const borrowDate = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(`http://localhost:5000/api/user/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userEmail,
          bookISBN: isbn,
          borrowDate: borrowDate,
        }),
      });

      if (response.status === 200) {
        console.log("Book borrowed successfully!");
      } else {
        console.error("Failed to borrow book:", response.message);
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredBooks.length / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <div className="flex-grow p-6">
        <h2 className="text-3xl font-bold mb-4">User Dashboard</h2>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Filter by name"
            value={filter.name}
            onChange={handleFilterChange}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="text"
            name="author"
            placeholder="Filter by author"
            value={filter.author}
            onChange={handleFilterChange}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="text"
            name="genre"
            placeholder="Filter by genre"
            value={filter.genre}
            onChange={handleFilterChange}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="text"
            name="year"
            placeholder="Filter by year"
            value={filter.year}
            onChange={handleFilterChange}
            className="mr-2 p-2 border rounded"
          />
          <select
            name="sort"
            value={sort}
            onChange={handleSortChange}
            className="p-2 border rounded"
          >
            <option value="">Sort by</option>
            <option value="title">Name</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
            <option value="year">Year</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {currentBooks.map((book) => (
            <motion.div
              key={book.ISBN}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 shadow rounded-md flex flex-row"
            >
              <div className="flex items-center justify-left w-1/2">
                <img
                  src={book.imageLink}
                  alt={book.title}
                  className="w-32 h-48 object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold">{book.title}</h3>
                  <p>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <p>
                    <strong>Year:</strong> {book.year}
                  </p>
                  <p>
                    <strong>ISBN:</strong> {book.ISBN}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {book.quantity}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleBorrowBook(book.ISBN)}
                >
                  Borrow Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 border rounded mx-1 ${
                number === currentPage ? "bg-green-500 text-white" : ""
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserLandingPage;
