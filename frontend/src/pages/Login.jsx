import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { toast, ToastContainer } from "react-toastify";

import Background from "./Background";
import LogoL from "./LogoL";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginData = email.includes("@")
      ? { email, password }
      : { username, password };

    try {
      const res = await axios.post(
        "http://localhost:5000/users/login",
        loginData,
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(`${res.data.user.username} successfully logged in`);
      navigate("/home");
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Try again.";
      setError(message);
      toast.error("Invalid Credential");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background />
      <ToastContainer />

      {/* Full-screen loader overlay */}
      {loading && <LogoL />}

      <div className="w-full h-screen relative">
        <div className="w-[500px] h-[500px] rounded-md bg-transparent backdrop-blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md shadow-black">
          <form className="p-5 mt-[100px] mb-0" onSubmit={handleLogin}>
            <img
              src="./images/login-lock.png"
              className="w-50 mx-auto"
              alt="login icon"
            />
            <div className="flex flex-col items-center mt-[50px] gap-3">
              <input
                type="text"
                placeholder="username or email"
                className="p-2 w-full rounded-md text-blue-900 border-2 border-gray-400"
                value={username || email}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes("@")) {
                    setEmail(value);
                    setUsername("");
                  } else {
                    setUsername(value);
                    setEmail("");
                  }
                }}
                required
              />
              <input
                type="password"
                placeholder="password"
                className="p-2 w-full text-blue-900 rounded-md border-2 border-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center gap-2 text-sm mt-2">
                <p>I don't have an account</p>
                <Link to="/signup" className="text-blue-600 underline">
                  Signup
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="p-2 w-[100px] text-blue-900 rounded-md border-2 border-blue-900 cursor-pointer flex items-center justify-center hover:bg-blue-900 hover:text-white "
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
