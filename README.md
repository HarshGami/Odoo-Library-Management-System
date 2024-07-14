# Library Management System

This is a comprehensive Library Management System developed using React for the frontend with Tailwind CSS and Framer for animations, and Node.js with MongoDB for the backend. The system includes user authentication, book management, and an admin dashboard with data analysis and real-time notifications.

## Table of Contents

- [System Requirements](#system-requirements)
- [Setup Instructions](#setup-instructions)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Features](#features)
  - [User Features](#user-features)
  - [Librarian Features](#librarian-features)
  - [Admin Features](#admin-features)

## System Requirements

- Node.js (v14 or later)
- MongoDB Compass
- npm (v6 or later) or yarn (v1 or later)

## Setup Instructions

### Frontend Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/HarshGami/Odoo-Library-Management-System.git
    cd library-management-system
    ```

2. Navigate to the frontend directory and install dependencies:

    ```sh
    cd client
    npm install
    ```

3. Start the frontend development server:

    ```sh
    npm start
    ```

    The frontend server will start at `http://localhost:3000`.

### Backend Setup

1. Navigate to the backend directory and install dependencies:

    ```sh
    cd server
    npm install
    ```

2. Create a `.env` file in the `server` directory with the following environment variables:

    ```env
    DB_URI=mongodb://localhost:27017/your-database-name
    SECRET_KEY=your-secret-key
    ```

3. Start the backend server:

    ```sh
    npm start
    ```

    The backend server will start at `http://localhost:5000`.

### Running the Application

With both the frontend and backend servers running, you can access the application at `http://localhost:3000`.

## Features

### User Features

- User registration and login
- Borrow and return books
- View borrowed book history

## Librarian Features

- Librarian can Add, Delete and Edit any book and it's details
- Librarian can see history of any book

### Admin Features

- View data analysis of book-related data (borrow frequency, overdue borrows, genre popularity)
- Real-time notifications when any book's quantity reaches 0

