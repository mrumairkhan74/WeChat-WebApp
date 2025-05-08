const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const userRouter = require('./routes/UserRoute');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);

const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true }
});

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log('User Connected:', socket.id);

    // Store username when the user joins
    socket.on("userJoined", (username) => {
        socket.username = username;

        if (!onlineUsers.includes(username)) {
            onlineUsers.push(username);
        }

        io.emit("onlineUsers", onlineUsers); // Broadcast to all
    });

    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.username || socket.id);

        if (socket.username) {
            onlineUsers = onlineUsers.filter(name => name !== socket.username);
            io.emit("onlineUsers", onlineUsers); // Update for all clients
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
