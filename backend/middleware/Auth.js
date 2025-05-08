const jwt = require('jsonwebtoken');

const User = require('../model/UserModel');


const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ Message: "Token Not Found:UnAuthorized" })

        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ _id: decoded.id, username: decoded.username, email: decoded.email });

        if (!user) {
            return res.status(404).json({ Error: "Username not found" });
        }

        req.user = user;
        next();
    } catch {
        return res.status(500).json({ Error: "Something Went Wrong" })
    }
}


module.exports = { isAuth }