const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/test");
const Schema = mongoose.Schema;

const sessionSchema = new mongoose.Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("session", sessionSchema);
