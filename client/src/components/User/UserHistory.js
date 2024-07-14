import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HistoryPage = ({ userEmail }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    borrowDate: "",
    dueDate: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [borrowedBooks, filters, sortField, sortOrder, currentPage]);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/inventory?userEmail=${email}`
      );
      if (response.ok) {
        const data = await response.json();
        const updatedBooks = await Promise.all(
          data.inventory.map(async (book) => {
            const bookDetails = await fetchBookDetails(book.bookISBN);
            return { ...book, ...bookDetails };
          })
        );
        setBorrowedBooks(updatedBooks);
      } else {
        console.error("Failed to fetch borrowed books:", response.status);
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDetails = async (isbn) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const bookInfo = data.items[0].volumeInfo;
          return {
            title: bookInfo.title,
            author: bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown",
            thumbnail: bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : "",
          };
        }
      } else {
        console.error("Failed to fetch book details:", response.status);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
    return { title: "Unknown", author: "Unknown", thumbnail: "" };
  };

  const handleReturn = async (isbn) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          bookISBN: isbn,
        }),
      });

      if (response.status === 200) {
        console.log("Book returned successfully!");
        fetchBorrowedBooks();
      } else {
        console.error("Failed to return book:", response.message);
      }
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  const handlePayPenalty = async (isbn) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/penalty?userEmail=${email}&bookISBN=${isbn}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Penalty paid successfully!");
        fetchBorrowedBooks();
      } else {
        console.error("Failed to pay penalty:", response.message);
      }
    } catch (error) {
      console.error("Error paying penalty:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const applyFiltersAndSorting = () => {
    let filtered = borrowedBooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        book.author.toLowerCase().includes(filters.author.toLowerCase()) &&
        book.borrowDate.includes(filters.borrowDate) &&
        book.dueDate.includes(filters.dueDate) &&
        book.status.toLowerCase().includes(filters.status.toLowerCase())
      );
    });

    filtered.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredBooks(filtered);
  };

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <div className="flex-grow p-6">
        <h2 className="text-3xl font-bold mb-4">Borrowed Books History</h2>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Filter by title"
            value={filters.title}
            onChange={handleFilterChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="author"
            placeholder="Filter by author"
            value={filters.author}
            onChange={handleFilterChange}
            className="border p-2 mr-2"
          />
          <input
            type="date"
            name="borrowDate"
            placeholder="Filter by borrow date"
            value={filters.borrowDate}
            onChange={handleFilterChange}
            className="border p-2 mr-2"
          />
          <input
            type="date"
            name="dueDate"
            placeholder="Filter by due date"
            value={filters.dueDate}
            onChange={handleFilterChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="status"
            placeholder="Filter by status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-2"
          />
        </div>
        <div className="mb-4">
          <button onClick={() => handleSortChange("title")} className="mr-2">
            Sort by Title
          </button>
          <button onClick={() => handleSortChange("author")} className="mr-2">
            Sort by Author
          </button>
          <button onClick={() => handleSortChange("borrowDate")} className="mr-2">
            Sort by Borrow Date
          </button>
          <button onClick={() => handleSortChange("dueDate")} className="mr-2">
            Sort by Due Date
          </button>
          <button onClick={() => handleSortChange("status")}>
            Sort by Status
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {paginatedBooks.map((book) => (
            <motion.div
              key={book.bookISBN}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 shadow rounded-md flex flex-row justify-left"
            >
              <div className="flex items-center justify-left w-1/2">
                {book.thumbnail && (
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="w-32 h-48 object-cover mr-4"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold">{book.title}</h3>
                  <p>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong>User Email:</strong> {book.userEmail}
                  </p>
                  <p>
                    <strong>Borrow Date:</strong> {book.borrowDate}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {book.dueDate}
                  </p>
                  <p>
                    <strong>Status:</strong> {book.status}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-1/2 space-y-4">
                <button
                  className="mt-4 w-28 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleReturn(book.bookISBN)}
                  disabled={book.status === "Returned"}
                >
                  Return Book
                </button>
                {book.isPenalty && (
                  <button
                    className="mt-4 w-28 px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => handlePayPenalty(book.bookISBN)}
                  >
                    Pay Penalty
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="mr-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2">{`${currentPage} / ${totalPages}`}</span>
          <button
            className="ml-2"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
