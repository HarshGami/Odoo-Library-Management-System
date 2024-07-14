import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const UserLandingPage = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 5;

    useEffect(() => {
        fetchIsbnList();
    }, []);

    const fetchIsbnList = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/books'); // Replace with your backend API URL

            const isbnList = await response.json();
            fetchBooks(isbnList);
        } catch (error) {
            console.error('Error fetching ISBN list:', error);
        }
    };

    const fetchBooks = async (isbnList) => {
        const bookPromises = isbnList.map(isbn =>
            fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`).then(res => res.json())
        );

        try {
            const results = await Promise.all(bookPromises);
            const bookList = results.flatMap(data =>
                data.items.map(item => ({
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown',
                    genre: item.volumeInfo.categories ? item.volumeInfo.categories.join(', ') : 'Unknown',
                    year: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.split('-')[0] : 'Unknown',
                    quantity: 1,
                    isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : 'N/A',
                    thumbnail: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x195'
                }))
            );
            setBooks(bookList);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
            <div className="flex-grow p-6 flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 lg:w-3/4 md:pr-6">
                    <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
                    <BookList books={currentBooks} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </div>
                <div className="w-full md:w-1/3 lg:w-1/4 mt-6 md:mt-0">
                    <UserInfoCard />
                </div>
            </div>
        </div>
    );
};

const UserInfoCard = () => {
    const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        role: "User",
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="bg-white p-4 shadow rounded-md"
        >
            <h2 className="text-2xl font-bold mb-2">User Information</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
        </motion.div>
    );
};

const SearchBar = ({ searchQuery, handleSearch }) => (
    <div className="mb-6">
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 border rounded-md"
            placeholder="Search books by title, author or genre ..."
        />
    </div>
);

const BookList = ({ books, userEmail }) => {
    const handleBorrow = async (isbn) => {
        const borrowDate = new Date().toISOString(); // Get current date as ISO string
        const borrowData = {
            userEmail: userEmail,
            isbn: isbn,
            borrowDate: borrowDate,
        };

        console.log(borrowData);
        try {
            const response = await fetch('http://localhost:5000/api/user/borrow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(borrowData),
            });

            if (response.ok) {
                // Handle success, update book quantity or UI
                console.log('Book borrowed successfully!');
            } else {
                // Handle error
                console.error('Failed to borrow book:', response.status);
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            {books.map((book) => (
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
                            <p><strong>Year:</strong> {book.year}</p>
                            <p><strong>ISBN:</strong> {book.isbn}</p>
                        </div>
                        <button
                            className={`mt-4 w-28 px-4 py-2 rounded ${book.quantity > 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            disabled={book.quantity === 0}
                            onClick={() => handleBorrow(book.isbn)}
                        >
                            {book.quantity > 0 ? 'Borrow' : 'Out of Stock'}
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};


const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const handleClick = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="mt-6 flex justify-center">
            <button
                onClick={() => handleClick(currentPage - 1)}
                className={`px-3 py-2 mx-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-green-500 text-white'}`}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handleClick(index + 1)}
                    className={`px-3 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => handleClick(currentPage + 1)}
                className={`px-3 py-2 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-green-500 text-white'}`}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default UserLandingPage;
