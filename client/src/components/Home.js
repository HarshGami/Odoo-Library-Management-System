// src/pages/Home.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUsers, FaHistory, FaBell, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";


function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      className="bg-white shadow-md rounded-md p-6 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="text-green-600 w-12 h-12 mb-4" />
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </motion.div>
  );
};


function Home({ setIsAuth }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function verification() {
      const response = await fetch('http://localhost:5000/api/auth/verification', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      return await response.json();
    }

    if (token) {
      const data = verification();

      if (!data.error) {
        setIsAuth(true);
        navigate("/");
      } else {
        alert(data.error);
        setIsAuth(false);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-40">
      <header className="flex-grow flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl pb-5"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800">Welcome to Your Library</h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-600">Manage your books effortlessly and keep track of your borrowers.</p>
          <Link to="/register">
            <button className="mt-8 px-6 py-3 bg-green-600 text-white rounded-md text-lg">Get Started</button>
          </Link>
        </motion.div>
      </header>

      <section className="bg-gray-200 py-12">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaBook}
              title="Book Inventory Management"
              description="Add, update, delete, and search for books with real-time availability status."
            />
            <FeatureCard
              icon={FaUsers}
              title="User Management"
              description="Role-based access control for Admin, Librarian, and User roles."
            />
            <FeatureCard
              icon={FaHistory}
              title="Borrowing System"
              description="Efficient checkout and return process with history tracking and late fee calculations."
            />
            <FeatureCard
              icon={FaBell}
              title="Notifications and Alerts"
              description="Receive email or SMS notifications for due dates, new arrivals, and overdue books."
            />
            <FeatureCard
              icon={FaChartBar}
              title="Reporting"
              description="Generate detailed reports on book usage, overdue items, and user activity."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;