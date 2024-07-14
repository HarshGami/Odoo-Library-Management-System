import Register from "./components/Register";
import NavBar from "./components/Navbar";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import UserLandingPage from "./components/User/UserDashboard";
import HistoryPage from "./components/User/UserHistory";
import BookHistoryPage from "./components/Librarian/BookHistory";
import LibrarianDashboard from "./components/Librarian/LibrarianDashboard";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return (
    <>
      <div className="App">
        {isAuth ? (
          <>
            {role === "1" ? (
              <>
                <Router>
                  <NavBar isAuth={isAuth} setIsAuth={setIsAuth} role={role} />
                  <Routes>
                    <Route exact path="*" element={<UserLandingPage />}></Route>
                    <Route
                      exact
                      path="/User_history"
                      element={<HistoryPage />}
                    ></Route>
                  </Routes>
                </Router>
              </>
            ) : role === "2" ? (
              <Router>
                <NavBar isAuth={isAuth} setIsAuth={setIsAuth} role={role} />
                <Routes>
                  <Route
                    exact
                    path="*"
                    element={<LibrarianDashboard />}
                  ></Route>
                  <Route
                    exact
                    path="/view_history/:isbn"
                    element={<BookHistoryPage />}
                  ></Route>
                </Routes>
              </Router>
            ) : (
              <>
                <Router>
                  <NavBar isAuth={isAuth} setIsAuth={setIsAuth} role={role} />
                </Router>
              </>
            )}
          </>
        ) : (
          <>
            <Router>
              <NavBar isAuth={isAuth} setIsAuth={setIsAuth} role={role} />
              {token && <Register setIsAuth={setIsAuth} />}
              <Routes>
                <Route
                  exact
                  path="*"
                  element={<Home setIsAuth={setIsAuth} />}
                ></Route>
                <Route
                  exact
                  path="/register"
                  element={<Register setIsAuth={setIsAuth} />}
                ></Route>
              </Routes>
            </Router>
          </>
        )}
      </div>
      <footer className="bg-gradient-to-r from-green-500 to-green-700 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Library Management System. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
