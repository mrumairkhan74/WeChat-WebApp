import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BsPersonCheckFill } from "react-icons/bs";
import io from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { IoSend } from "react-icons/io5";

// Connect to Socket.io server
const socket = io("http://localhost:3000");

const Home = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const addEmoji = (e) => {
    setMsg((prev) => prev + e.native);
    setShowPicker(false);
  };
  // Send message to server
  const sendMessage = () => {
    if (msg.trim()) {
      socket.emit("sendMessage", {
        text: msg,
        sender: user?.username || "Anonymous",
      });
      setMsg(""); // Reset input
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleReceive);

    // Clean up
    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, []);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      socket.emit("userJoined", parsedUser.username); // ✅ Correct
      socket.emit("setUsername", parsedUser.username); // ✅ Correct
    } else {
      navigate("/"); // redirect to login
    }
  }, [navigate]);

  // Logout logic
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/user/logout");
      localStorage.removeItem("user");
      toast.success("Logout Successful");
      navigate("/");
    } catch (err) {
      toast.error("Logout Failed");
    }
  };

  return (
    <div className="p-4 w-full mx-auto">
      <ToastContainer/>
      {user ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <img src="/images/wechat.png" alt="" />

            <div className="flex items-center justify-center gap-2">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-500">
                <BsPersonCheckFill /> {user.username}
              </h3>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          {/* for online user  */}
          <div className="mb-4 max-w-xl p-4 mx-auto">
            <h4 className="font-semibold">Online Users:</h4>
            <ul className="list-disc list-inside text-blue-600">
              {onlineUsers.map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          </div>
          {/* for text messages */}
          <div className="max-w-xl mx-auto p-4">
            <h2 className="text-lg font-bold text-blue-900 mb-2">Chat Room</h2>
            <div
              className="border px-4 py-2 h-64 overflow-y-scroll bg-blue-100 mb-2 "
              style={{ borderRadius: "8px", borderColor: "blue" }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`my-1 flex ${
                    m.sender === user?.username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                  // className={`px-3 py-2 rounded-lg max-w-xs ${
                  //   m.sender === user?.username ? "bg-gray-200" : "bg-white"
                  // }`}
                  >
                    <strong className="block text-[12px] text-gray-600 font-mono tracking-wide bg-transparent mb-2">
                      {m.sender}
                    </strong>
                    <span
                      className={`${
                        m.sender === user?.username ? "bg-blue-300" : "bg-white"
                      } px-3 py-2 block rounded-md`}
                    >
                      {m.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="flex gap-1 border-1 border-gray-300 p-2 rounded-md w-full ">
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="text-2xl"
                  type="button"
                >
                  😊
                </button>

                {showPicker && (
                  <div className="absolute bottom-12 left-0 bg-white shadow-lg p-2 rounded z-10">
                    <div className="flex justify-end mb-1">
                      <button
                        onClick={() => setShowPicker(false)}
                        className="text-gray-500 hover:text-red-500 text-sm"
                      >
                        ✖️
                      </button>
                    </div>
                    <Picker data={data} onEmojiSelect={addEmoji} />
                  </div>
                )}
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  className="flex-grow w-full p-2 rounded"
                />
                <button
                  onClick={sendMessage}
                  className="text-3xl text-blue-900"
                >
                  <IoSend />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
