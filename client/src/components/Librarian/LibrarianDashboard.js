import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";


const LibrarianDashboard = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/books`);
            if (response.status == 200) {
                const data = await response.json();
                setBooks(data.books);
            } else {
                console.error('Failed to fetch books:', response.message);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleEditQuantity = async (isbn) => {
        const newQuantity = prompt('Enter new quantity:');
        if (newQuantity !== null) {
            try {
                const response = await fetch(`http://localhost:5000/api/librarian/book/updateQuantity`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ISBN: isbn,
                        quantity: parseInt(newQuantity),
                    }),
                });

                if (response.status == 200) {
                    console.log('Quantity updated successfully!');
                    fetchBooks();
                } else {
                    console.error('Failed to update quantity:', response.message);
                }
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        }
    };

    const handleDeleteBook = async (isbn) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/librarian/deleteBook?ISBN=${isbn}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status == 200) {
                    console.log('Book deleted successfully!');
                    fetchBooks();
                } else {
                    console.error('Failed to delete book:', response.message);
                }
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
            <div className="flex-grow p-6">
                <h2 className="text-3xl font-bold mb-4">Librarian Dashboard</h2>
                <div className="grid grid-cols-1 gap-6">
                    {books.map((book) => (
                        <motion.div
                            key={book.ISBN}
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
                                    <p><strong>Year:</strong> {book.year}</p>
                                    <p><strong>ISBN:</strong> {book.ISBN}</p>
                                    <p><strong>Quantity:</strong> {book.quantity}</p>
                                </div>
                                <div className="mt-4 space-x-4">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={() => handleEditQuantity(book.ISBN)}
                                    >
                                        Edit Quantity
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                        onClick={() => handleDeleteBook(book.ISBN)}
                                    >
                                        Delete Book
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded"
                                    >
                                        <LinkContainer to={`/view_history/${book.ISBN}`}>
                                            <Nav.Link>View History</Nav.Link>
                                        </LinkContainer>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LibrarianDashboard;
