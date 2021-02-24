const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messagesSchema = new Schema({
  groupNickname: String,
  groupName: String,
  isDM: Boolean, // true if dm, false if gc
  members: Array,
  messages: Array, // user, msg
  owner: String,
});

let messages = mongoose.model("messages", messagesSchema);

module.exports = messages;
