const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema (like a blueprint)
let signUpSchema = new Schema({
  email: String,
  password: String,
  friends: Array,
});

// friends: [
//   {name: String, messages: [
//     ["username", "message"]
//   ]},
// ],

let signUp = mongoose.model("signUp", signUpSchema);

module.exports = signUp;
