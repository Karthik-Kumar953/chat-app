const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../lib/generateToken.js");
const cloudinary = require("../config/cloudinary.config.js");

// signup
const signUp = async (req, res) => {
    const { email, fullName, password, bio } = req.body;

    try {
        if (!email || !bio || !password || !fullName) {
            return res
                .status(400)
                .json({ success: false, message: "Missing Details!" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res
                .status(409)
                .json({ success: false, message: "User Already exsists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id);

        res.status(200).json({
            success: true,
            message: "User Created Succesfully!",
            userData: newUser,
            token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if ((!email, !password)) {
            return res
                .status(400)
                .json({ success: false, message: "Missing Details!" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User doesn't exsists" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login Succesfull",
            userData: user,
            token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Authentication Checking
const checkAuth = async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};

// Update profile
const updateProfile = async (req, res) => {
    console.log("entered");
    const { fullName, bio, profilePic } = req.body;
    const userId = req.user._id;
    console.log(userId);

    let updatedUser;

    try {
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName, bio },
                { new: true }
            );
        } else {
            const uploadeImg = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: uploadeImg.secure_url, fullName, bio },
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { login, signUp, checkAuth, updateProfile };
