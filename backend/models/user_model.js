const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Model for users to be stored in database
const users = new Schema(
  {
    user_name: { type: String },
    status: { type: String },
    visit: { type: String },
    rooms: [{ type: String }],
    password: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auths", users);
