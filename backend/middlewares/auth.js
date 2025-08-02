const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const authProtected = async (req, res, next) => {
    // console.log("Middleware Called");
    try {
        // Get token from Authorization header (Bearer <token>)
        const authHeader = req.headers.authorization;
        const token =
            authHeader && authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null;
        // console.log("Token:", token);
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "No token provided" });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.userId).select("-password");

        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User Doesn't Exsists!" });

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = authProtected;
