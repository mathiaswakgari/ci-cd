const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(process.env.MONGO_URI, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    })
    .then(() => console.log("Connected to MongoDB."))
    .catch(() => console.log("Error when trying to connect to MongoDB."));
};
