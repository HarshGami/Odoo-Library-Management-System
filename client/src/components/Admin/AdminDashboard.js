import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const sampleData = [
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Fiction",
        "year": 1925,
        "ISBN": "9780743273565",
        "quantity": 5,
        "borrowHistory": [
            {
                "userName": "Alice Johnson",
                "email": "alice@example.com",
                "borrowDate": "2024-01-15",
                "returnDate": "2024-02-15",
                "dueDate": "2024-02-15",
                "penaltyAmount": 0
            },
            {
                "userName": "Bob Smith",
                "email": "bob@example.com",
                "borrowDate": "2024-03-01",
                "returnDate": null,
                "dueDate": "2024-04-01",
                "penaltyAmount": 0
            }
        ]
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "genre": "Fiction",
        "year": 1960,
        "ISBN": "9780061120084",
        "quantity": 0,
        "borrowHistory": [
            {
                "userName": "Charlie Brown",
                "email": "charlie@example.com",
                "borrowDate": "2024-02-10",
                "returnDate": "2024-03-10",
                "dueDate": "2024-03-10",
                "penaltyAmount": 0
            },
            {
                "userName": "David Wilson",
                "email": "david@example.com",
                "borrowDate": "2024-04-01",
                "returnDate": null,
                "dueDate": "2024-05-01",
                "penaltyAmount": 5
            }
        ]
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "genre": "Dystopian",
        "year": 1949,
        "ISBN": "9780451524935",
        "quantity": 2,
        "borrowHistory": [
            {
                "userName": "Eve Adams",
                "email": "eve@example.com",
                "borrowDate": "2024-01-05",
                "returnDate": "2024-02-05",
                "dueDate": "2024-02-05",
                "penaltyAmount": 0
            },
            {
                "userName": "Frank Miller",
                "email": "frank@example.com",
                "borrowDate": "2024-03-15",
                "returnDate": null,
                "dueDate": "2024-04-15",
                "penaltyAmount": 10
            }
        ]
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "genre": "Romance",
        "year": 1813,
        "ISBN": "9781503290563",
        "quantity": 3,
        "borrowHistory": [
            {
                "userName": "Grace Kelly",
                "email": "grace@example.com",
                "borrowDate": "2024-01-20",
                "returnDate": "2024-02-20",
                "dueDate": "2024-02-20",
                "penaltyAmount": 0
            },
            {
                "userName": "Henry Ford",
                "email": "henry@example.com",
                "borrowDate": "2024-04-05",
                "returnDate": null,
                "dueDate": "2024-05-05",
                "penaltyAmount": 0
            }
        ]
    }
];

const AdminDashboard = () => {
    const borrowFrequency = sampleData.map(book => ({
        title: book.title,
        count: book.borrowHistory.length,
    }));

    const overdueBorrows = sampleData.map(book => ({
        title: book.title,
        overdueCount: book.borrowHistory.filter(history => {
            const dueDate = new Date(history.dueDate);
            return !history.returnDate && dueDate < new Date();
        }).length,
    }));

    const genrePopularity = sampleData.reduce((acc, book) => {
        acc[book.genre] = (acc[book.genre] || 0) + book.borrowHistory.length;
        return acc;
    }, {});

    const borrowFrequencyData = {
        labels: borrowFrequency.map(book => book.title),
        datasets: [
            {
                label: 'Borrow Frequency',
                data: borrowFrequency.map(book => book.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const overdueBorrowsData = {
        labels: overdueBorrows.map(book => book.title),
        datasets: [
            {
                label: 'Overdue Borrows',
                data: overdueBorrows.map(book => book.overdueCount),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    const genrePopularityData = {
        labels: Object.keys(genrePopularity),
        datasets: [
            {
                label: 'Genre Popularity',
                data: Object.values(genrePopularity),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-28 px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>
            <div className="space-y-12">
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Borrow Frequency</h3>
                    <div className="relative h-96">
                        <Bar data={borrowFrequencyData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Overdue Borrows</h3>
                    <div className="relative h-96">
                        <Bar data={overdueBorrowsData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Genre Popularity</h3>
                    <div className="relative h-96">
                        <Bar data={genrePopularityData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
