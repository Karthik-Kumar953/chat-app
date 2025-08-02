const express = require("express");
const messageRouter = express.Router();
const {
    getSidebarUsers,
    getAllMeassages,
    markMessagesAsSeen,
    sendMessage,
} = require("../controllers/messageController.js");
const authProtected = require("../middlewares/auth.js");

messageRouter.get("/get-users", authProtected, getSidebarUsers);
messageRouter.get("/:id", authProtected, getAllMeassages);
messageRouter.put("/mark-msg/:id", authProtected, markMessagesAsSeen);
messageRouter.post("/send/:id", authProtected, sendMessage);

module.exports = messageRouter;
