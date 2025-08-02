const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    return token;
};

module.exports = generateToken;
