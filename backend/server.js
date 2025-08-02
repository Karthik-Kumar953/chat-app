const express = require("express");
const http = require("http");
require("dotenv/config");
const cors = require("cors");
const connectToDB = require("./config/mongodb.config.js");
const userRouter = require("./routes/userRoutes.js");
const messageRouter = require("./routes/messageRoutes.js");
const { Server } = require("socket.io");
const { initSocket, userSocketMap } = require("./socket");

const app = express();
const server = http.createServer(app);

const allowOrigns = ["http://localhost:5173"];

// middelwares
app.use(express.json({ limit: "4mb" }));
app.use(cors({ credentials: true, origin: allowOrigns }));

// Database connection
(async () => {
    await connectToDB();

    // Initialize socket.io
    initSocket(server);

    app.use("/auth", userRouter);
    app.use("/messages", messageRouter);

    if (process.env.NODE_ENV != "production") {
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, (err) => {
            if (err) {
                console.log(err);
            }
            console.log("Server is running at port: ", PORT);
        });
    }
})();

// export for the vercel
module.exports = server;
