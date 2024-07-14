import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const BookHistoryPage = () => {
  const { isbn } = useParams();
  const [bookHistory, setBookHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filter, setFilter] = useState({
    userEmail: "",
    borrowDate: "",
    dueDate: "",
    status: "",
  });
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const historyPerPage = 10;

  useEffect(() => {
    fetchBookHistory();
  }, [isbn]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filter, sort, bookHistory]);

  const fetchBookHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/librarian/books/borrowed?ISBN=${isbn}`
      );
      if (response.status === 200) {
        const data = await response.json();
        setBookHistory(data.borrowedBooks);
      } else {
        console.error("Failed to fetch book history:", response.message);
      }
    } catch (error) {
      console.error("Error fetching book history:", error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = bookHistory.filter(
      (history) =>
        history.userEmail.toLowerCase().includes(filter.userEmail.toLowerCase()) &&
        history.borrowDate.toLowerCase().includes(filter.borrowDate.toLowerCase()) &&
        history.dueDate.toLowerCase().includes(filter.dueDate.toLowerCase()) &&
        history.status.toLowerCase().includes(filter.status.toLowerCase())
    );

    if (sort) {
      filtered = filtered.sort((a, b) => {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      });
    }

    setFilteredHistory(filtered);
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

  const indexOfLastHistory = currentPage * historyPerPage;
  const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
  const currentHistory = filteredHistory.slice(indexOfFirstHistory, indexOfLastHistory);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredHistory.length / historyPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <div className="flex-grow p-6">
        <h2 className="text-3xl font-bold mb-4">Book History</h2>
        <div className="mb-4">
          <input
            type="text"
            name="userEmail"
            placeholder="Filter by user email"
            value={filter.userEmail}
            onChange={handleFilterChange}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="text"
            name="borrowDate"
            placeholder="Filter by borrow date"
            value={filter.borrowDate}
            onChange={handleFilterChange}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="text"
            name="dueDate"
            placeholder="Filter by due date"
            value={filter.dueDate}
            onChange={handleFilterChange}
            className="mr-2 p-2 border rounded"
          />
          <input
            type="text"
            name="status"
            placeholder="Filter by status"
            value={filter.status}
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
            <option value="userEmail">User Email</option>
            <option value="borrowDate">Borrow Date</option>
            <option value="dueDate">Due Date</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {currentHistory.map((book) => (
            <motion.div
              key={book.bookISBN}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 shadow rounded-md flex flex-row justify-left"
            >
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold">{book.title}</h3>
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

export default BookHistoryPage;
