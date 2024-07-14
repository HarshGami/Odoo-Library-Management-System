import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HistoryPage = ({ userEmail }) => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/inventory`);
            if (response.ok) {
                const data = await response.json();
                setBorrowedBooks(data.borrowedBooks); // Adjust this according to your API response structure
            } else {
                console.error('Failed to fetch borrowed books:', response.status);
            }
        } catch (error) {
            console.error('Error fetching borrowed books:', error);
        }
    };

    const handleReturn = async (isbn) => {
        try {
            const response = await fetch(`YOUR_RETURN_BOOK_API_ENDPOINT`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                    isbn: isbn,
                }),
            });

            if (response.ok) {
                console.log('Book returned successfully!');
                fetchBorrowedBooks(); // Refresh borrowed books after returning
            } else {
                console.error('Failed to return book:', response.status);
            }
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    const handlePenaltyAlert = (dueDate, isbn) => {
        const today = new Date();
        const due = new Date(dueDate);
        if (today > due) {
            const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24)); // Calculate days overdue
            const penaltyAmount = daysOverdue * 10; // Replace PENALTY_RATE with your penalty rate per day
            if (window.confirm(`Please pay a penalty of $${penaltyAmount} for overdue book.`)) {
                handlePayPenalty(isbn);
            }
        }
    };

    const handlePayPenalty = async (isbn) => {
        try {
            const response = await fetch(`YOUR_PAY_PENALTY_API_ENDPOINT`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                    isbn: isbn,
                }),
            });

            if (response.ok) {
                console.log('Penalty paid successfully!');
                fetchBorrowedBooks(); // Refresh borrowed books after penalty payment
            } else {
                console.error('Failed to pay penalty:', response.status);
            }
        } catch (error) {
            console.error('Error paying penalty:', error);
        }
    };

    const calculateDueDate = (borrowDate) => {
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 14); // Assuming 14 days as the borrowing period
        return dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
            <div className="flex-grow p-6">
                <h2 className="text-3xl font-bold mb-4">Borrowed Books History</h2>
                <div className="grid grid-cols-1 gap-6">
                    {borrowedBooks.map((book) => (
                        <motion.div
                            key={book.isbn}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-6 shadow rounded-md flex flex-row justify-left"
                        >
                            <img src={book.thumbnail} alt={book.title} className="w-32 h-48 object-cover mr-4" />
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold">{book.title}</h3>
                                    <p><strong>Author:</strong> {book.author}</p>
                                    <p><strong>Genre:</strong> {book.genre}</p>
                                    <p><strong>Due Date:</strong> {calculateDueDate(book.borrowDate)}</p>
                                    <p><strong>ISBN:</strong> {book.isbn}</p>
                                </div>
                                <button
                                    className="mt-4 w-28 px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={() => {
                                        handleReturn(book.isbn);
                                        handlePenaltyAlert(book.borrowDate, book.isbn);
                                    }}
                                >
                                    Return Book
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
