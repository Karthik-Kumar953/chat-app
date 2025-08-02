const express = require("express");
const userRouter = express.Router();
const {
    login,
    signUp,
    checkAuth,
    updateProfile,
} = require("../controllers/userController.js");
const authProtected = require("../middlewares/auth.js");

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", authProtected, updateProfile);
userRouter.get("/is-auth", authProtected, checkAuth);

module.exports = userRouter;
