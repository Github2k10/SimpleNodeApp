const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/test");
const Schema = mongoose.Schema;

const documentSchema = new mongoose.Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("documents", documentSchema);
