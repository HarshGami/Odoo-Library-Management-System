import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

function NavBar({ isAuth, setIsAuth, role }) {
  const username = localStorage.getItem("name");
  const navigate = useNavigate();

  function logout() {
    navigate("/");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.clear();
    setIsAuth(false);
  }

  return (
    <nav className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <div className="text-lg font-bold">Library Management System</div>
        <button className="md:hidden focus:outline-none">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <div className="hidden md:flex md:items-center md:space-x-6">
          {isAuth === true ? (
            <>
              <div className="flex space-x-4">
                {role === "1" ? (
                  <>
                    <Link to="/" className="hover:text-gray-300">
                      Dashboard
                    </Link>
                    <Link to="/report_form" className="hover:text-gray-300">
                      Create New Report
                    </Link>
                    <Link to="/report_history" className="hover:text-gray-300">
                      Report History
                    </Link>
                    <Link to="/collection_schedule" className="hover:text-gray-300">
                      View Schedule
                    </Link>
                  </>
                ) : role === "2" ? (
                  <>
                    <Link to="/" className="hover:text-gray-300">
                      Dashboard
                    </Link>
                    <Link to="/assigned_tasks" className="hover:text-gray-300">
                      Assigned Tasks
                    </Link>
                    <Link to="/task_history" className="hover:text-gray-300">
                      Task History
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/" className="hover:text-gray-300">
                      Dashboard
                    </Link>
                    <Link to="/assign_task" className="hover:text-gray-300">
                      Assign Tasks
                    </Link>
                    <Link to="/task_status" className="hover:text-gray-300">
                      Monitor Progress
                    </Link>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <FaUser className="text-white" />
                <div className="font-semibold text-lg">{username}</div>
              </div>
              <button
                onClick={logout}
                className="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
              <Link to="/register">
                <button className="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-200">
                  Log In
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;