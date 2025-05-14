import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Background from "./Background";
import LogoS from "./LogoS";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !username || !email || !password) {
      toast.error("Please Fill All Fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/users/create",
        { name, username, email, password },
        { withCredentials: true }
      );

      if (res.data?.exists) {
        toast.error("User Already Exists");
        return;
      }

      toast.success(`${res.data.username} Registered Successfully`);
      navigate("/");
    } catch (err) {
      setError("Something went wrong");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Background />

      {/* Full-screen loader overlay */}
      {loading && <LogoS />}

      <div className="w-full h-screen relative">
        <div className="w-[500px] h-[550px] rounded-md bg-transparent backdrop-blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md shadow-black">
          <form className="p-5 mt-[25px]" onSubmit={handleSubmit}>
            <img
              src="./images/signup.png"
              className="w-[250px] mx-auto"
              alt="signup icon"
            />
            <div className="flex flex-col items-center mt-[25px] gap-3">
              <input
                type="text"
                className="p-2 w-full rounded-md border-2 border-gray-400"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
              <input
                type="text"
                className="p-2 w-full rounded-md border-2 border-gray-400"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
              />
              <input
                type="email"
                className="p-2 w-full rounded-md border-2 border-gray-400"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <input
                type="password"
                className="p-2 w-full rounded-md border-2 border-gray-400"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <div className="flex items-center gap-2 text-sm mt-2">
                <p>I already have an account</p>
                <Link to="/" className="text-blue-600 underline">
                  Login
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="p-2 rounded-md border-2 border-blue-400 cursor-pointer flex items-center justify-center"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
