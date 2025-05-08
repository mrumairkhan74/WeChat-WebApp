const User = require('../model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');


// create User
const createUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: "Please Filled All Field" })
        }
        if (user) {
            return res.status(409).json({ message: "User Already Exists" })
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name, username, email, password: hashedPassword
        });

        const token = jwt.sign({ username: newUser.username, id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "Strict" });
        res.status(200).json({ message: "Created Successfully", username });
    }
    catch (error) {
        return res.status(500).json(error);

    }
}


// Login user
const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" })
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(401).json({ error: "Password Incorrect" })
        }
        const token = jwt.sign({ _id: user.id, username: user.username, name: user.name }, process.env.JWT_SECRET_KEY, { expiresIn: '15min' })
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
        res.status(200).json({ message: "Login Successfully", user: { username: user.username, name: user.name } })

    }
    catch (error) {
        return res.status(500).json(error);
    }
}


// delete  User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: "User not Found" })
        }
        res.status(200).json({ message: `Successfully Delete ${id}` })
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" })
        }
        const updateUser = await User.findByIdAndUpdate(id, { name, username, email, password });
        res.status(200).json({ message: "Update Successfully", updateUser })

    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


// get All User
const AllUser = async (req, res) => {
    try {
        const user = await User.find();
        if (!user) {
            return res.status(404).json({ message: "No User available" })
        }
        res.status(200).json(user)
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


// get UserBy Id

const UserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "No User available" })
        }
        res.status(200).json(user)
    }
    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createUser,
    loginUser,
    deleteUser,
    updateUser,
    AllUser,
    UserById, logout
}