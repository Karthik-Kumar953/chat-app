const cloudinary = require("../config/cloudinary.config.js");
const Message = require("../models/message.model.js");
const User = require("../models/user.model.js");
const { getIO, userSocketMap } = require("../socket.js");
// const io = getIO();

// get the users for sidebar
const getSidebarUsers = async (req, res) => {
    const userId = req.user._id;

    try {
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
            "-password"
        );
        const unseeenMessages = {};

        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false,
            });

            if (messages.length > 0) {
                unseeenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);
        res.status(200).json({
            success: true,
            unseeenMessages,
            users: filteredUsers,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// get all messages of the selected user
const getAllMeassages = async (req, res) => {
    const myId = req.user._id;
    const { id: selectedUserId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ],
        });

        await Message.updateMany(
            {
                senderId: selectedUserId,
                receiverId: myId,
            },
            { $set: { seen: true } }
        );

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// To set the message as seen
const markMessagesAsSeen = async (req, res) => {
    try {
        const id = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// send message
const sendMessage = async (req, res) => {
    const io = getIO();
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    try {
        let imageUrl;
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = await Message.create({
            text,
            image: imageUrl,
            senderId,
            receiverId,
        });

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        const senderSocketId = userSocketMap[senderId.toString()];
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json({ success: true, newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSidebarUsers,
    getAllMeassages,
    markMessagesAsSeen,
    sendMessage,
};
