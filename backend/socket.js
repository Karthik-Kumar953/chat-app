let ioInstance = null;
const userSocketMap = {};

function initSocket(server) {
    const { Server } = require("socket.io");
    ioInstance = new Server(server, { cors: { origin: "*" } });

    ioInstance.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) userSocketMap[userId] = socket.id;
        ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            delete userSocketMap[userId];
            ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });

    return ioInstance;
}

function getIO() {
    if (!ioInstance) throw new Error("Socket.io not initialized");
    return ioInstance;
}

module.exports = { initSocket, getIO, userSocketMap };
