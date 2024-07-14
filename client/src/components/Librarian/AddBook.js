import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineWarning } from 'react-icons/ai';
import { FiBook } from 'react-icons/fi';

function AddBook() {
    const navigate = useNavigate();
    const [isbn, setIsbn] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');

    const handleAddBook = async (event) => {
        event.preventDefault();

        if (isbn === '' || quantity === '') {
            setError('Please enter both ISBN number and quantity.');
            return;
        }

        const response = await fetch('http://localhost:5000/api/librarian/addBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isbn,
                quantity: parseInt(quantity),
            }),
        });

        const data = await response.json();

        if (response.status === 201) {
            console.log('Book added successfully:', data);
            navigate('/librarian/dashboard'); // Redirect to librarian dashboard after adding book
        } else {
            setError(data.message || 'Failed to add book.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-5">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <h2 className="text-2xl font-bold">Add Book</h2>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 mb-4 rounded flex items-center">
                        <AiOutlineWarning className="mr-2" />
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleAddBook}>
                    <div className="flex items-center border-b border-gray-300 py-2">
                        <FiBook className="mr-2" />
                        <input
                            type="text"
                            placeholder="Enter ISBN Number"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center border-b border-gray-300 py-2">
                        <FiBook className="mr-2" />
                        <input
                            type="number"
                            placeholder="Enter Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Book
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddBook;
