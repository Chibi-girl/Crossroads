const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Model for chatroom thread to be stored in database

const chats = new Schema(
  {
    roomId: { type: String },
    username: [{ type: String }],
    email: [{ type: String }],
    msg: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chats", chats);
