const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/test");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  documents: [
    {
      type: Schema.Types.ObjectId,
      ref: "documents",
    },
  ],
  password: {
    type: String,
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

userSchema.methods.addDocument = function (documentId) {
  this.documents.push(documentId);
  return this.save();
};

userSchema.methods.deleteDocument = function (documentId) {
  this.documents.remove(documentId);
  return this.save();
};

module.exports = mongoose.model("user", userSchema);
