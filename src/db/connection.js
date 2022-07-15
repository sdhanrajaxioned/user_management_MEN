const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect("mongodb://localhost:27017/users", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection is successful");
    })
    .catch((e) => {
      console.error(`Error: ${e}`);
    });
};

module.exports = connectDb;
