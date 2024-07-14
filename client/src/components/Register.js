import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineWarning } from "react-icons/ai";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

function Register({ setIsAuth }) {
  const navigate = useNavigate();

  function ValidateEmail(input) {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;

    return validRegex.test(input);
  }

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: null,
  });
  const [form, setForm] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUser({ name: "", email: "", password: "", role: null });
    setEmail("");
    setPassword("");
    setError("");
  }, [form]);

  async function LoginUser(event) {
    event.preventDefault();

    if (email === "" || password === "") {
      setError("Please enter both email and password.");
      return;
    }
    if (!ValidateEmail(email)) {
      setError("Invalid email format. Please enter a valid email address.");
      return;
    }

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("token", data.token);
      setIsAuth(true);
      navigate("/");
    } else {
      setError(data.message);
      setIsAuth(false);
    }
  }

  async function RegisterUser(event) {
    event.preventDefault();

    if (
      user.name === "" ||
      user.email === "" ||
      user.password === "" ||
      user.role === null
    ) {
      setError("Please enter all required details: name, email, password, and role.");
      return;
    }
    if (!ValidateEmail(user.email)) {
      setError("Invalid email format. Please enter a valid email address.");
      return;
    }

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("token", data.token);
      setIsAuth(true);
      navigate("/");
    } else {
      setError(data.message);
      setIsAuth(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-5">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <button
            className={`w-1/2 py-2 ${form === 1 ? "border-b-2 border-green-500" : ""}`}
            onClick={() => setForm(1)}
          >
            Log In
          </button>
          <button
            className={`w-1/2 py-2 ${form === 2 ? "border-b-2 border-green-500" : ""}`}
            onClick={() => setForm(2)}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded flex items-center">
            <AiOutlineWarning className="mr-2" />
            {error}
          </div>
        )}

        {form === 2 ? (
          <form className="space-y-4" onSubmit={RegisterUser}>
            <div className="flex items-center border-b border-gray-300 py-2">
              <FiUser className="mr-2" />
              <input
                type="text"
                placeholder="Enter Full Name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <FiMail className="mr-2" />
              <input
                type="email"
                placeholder="Enter Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <FiLock className="mr-2" />
              <input
                type="password"
                placeholder="Enter Password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
            </div>
            <div className="flex justify-around py-2">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="librarian"
                  onChange={(e) => setUser({ ...user, role: 2 })}
                /> Librarian
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  onChange={(e) => setUser({ ...user, role: 1 })}
                /> User
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={LoginUser}>
            <div className="flex items-center border-b border-gray-300 py-2">
              <FiMail className="mr-2" />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
            </div>
            <div className="flex items-center border-b border-gray-300 py-2">
              <FiLock className="mr-2" />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
