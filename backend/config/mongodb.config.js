const mongoose = require("mongoose");

const connectToDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Succesfully Connected to the database!");
    });

    mongoose.connection.on("error", () => {
        console.log("Error:", error);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}chat-app`);
};

module.exports = connectToDB;
