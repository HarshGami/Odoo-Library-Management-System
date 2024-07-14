import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

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
                    <LinkContainer to={`/`}>
                      <Nav.Link>Dashboard</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={`/User_history`}>
                      <Nav.Link>User Inventory</Nav.Link>
                    </LinkContainer>
                  </>
                ) : role === "2" ? (
                  <>
                    <LinkContainer to={`/`}>
                      <Nav.Link>Dashboard</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={`/add_book`}>
                      <Nav.Link>Add Book</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={`/view_history/:isbn`}>
                      <Nav.Link>View History</Nav.Link>
                    </LinkContainer>
                  </>
                ) : (
                  <>
                    <LinkContainer to={`/`}>
                      <Nav.Link>Dashboard</Nav.Link>
                    </LinkContainer>
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