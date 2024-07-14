import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const BookHistoryPage = () => {
    const { isbn } = useParams();
    const [bookHistory, setBookHistory] = useState([]);

    useEffect(() => {
        fetchBookHistory();
    }, [isbn]);

    const fetchBookHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/librarian/books/borrowed`);
            if (response.status == 200) {
                const data = await response.json();
                setBookHistory(data.borrowedBooks);
            } else {
                console.error('Failed to fetch book history:', response.message);
            }
        } catch (error) {
            console.error('Error fetching book history:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
            <div className="flex-grow p-6">
                <h2 className="text-3xl font-bold mb-4">Book History</h2>
                <div className="grid grid-cols-1 gap-6">
                    {bookHistory.map((history) => (
                        <motion.div
                            key={history.borrowId}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-6 shadow rounded-md flex flex-row justify-left"
                        >
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold">{history.userName}</h3>
                                    <p><strong>Email:</strong> {history.email}</p>
                                    <p><strong>Date Borrowed:</strong> {history.borrowDate}</p>
                                    <p><strong>Date Returned:</strong> {history.returnDate || 'Not returned yet'}</p>
                                    <p><strong>Due Date:</strong> {history.dueDate}</p>
                                    <p><strong>Penalty Amount:</strong> ${history.penaltyAmount || '0'}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookHistoryPage;
