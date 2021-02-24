const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema (like a blueprint)
let signUpSchema = new Schema({
  email: String,
  password: String,
  friends: Array,
  messages: Array,
  friendRequests: Array,
});

// OLD MESSAGES SCHEMA / DB STRUCTURE (INTEGRATED INTO USER PROFILE):
// friends: [
//   {name: String, messages: [
//     ["username", "message"]
//   ]},
// ],
// => NEW DB STRUCTURE HOLDS A REFERENCE TO THE CHAT IN MESSAGES

let signUp = mongoose.model("signUp", signUpSchema);

module.exports = signUp;
