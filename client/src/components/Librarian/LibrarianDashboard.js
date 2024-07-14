import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

const LibrarianDashboard = () => {
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
  }, []);

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

  const handleEditQuantity = async (isbn, quantityChange) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/librarian/book/updateQuantity`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ISBN: isbn,
            quantity: quantityChange,
          }),
        }
      );

      if (response.status === 200) {
        console.log("Quantity updated successfully!");
        fetchBooks();
      } else {
        console.error("Failed to update quantity:", response.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteBook = async (isbn) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/librarian/deleteBook?ISBN=${isbn}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          console.log("Book deleted successfully!");
          fetchBooks();
        } else {
          console.error("Failed to delete book:", response.message);
        }
      } catch (error) {
        console.error("Error deleting book:", error);
      }
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
        <h2 className="text-3xl font-bold mb-4">Librarian Dashboard</h2>
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
                <div>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded mx-2"
                    onClick={() =>
                      handleEditQuantity(book.ISBN, book.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() =>
                      handleEditQuantity(book.ISBN, book.quantity - 1)
                    }
                    disabled={book.quantity <= 0}
                  >
                    -
                  </button>
                </div>
                <div>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handleDeleteBook(book.ISBN)}
                  >
                    Delete Book
                  </button>
                </div>
                <div>
                  <button className="px-4 py-2 bg-green-500 text-white rounded">
                    <LinkContainer to={`/view_history/${book.ISBN}`}>
                      <Nav.Link>View History</Nav.Link>
                    </LinkContainer>
                  </button>
                </div>
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
                number === currentPage ? "bg-blue-500 text-white" : ""
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

export default LibrarianDashboard;
