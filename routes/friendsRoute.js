const router = require("express").Router();
const signUp = require("../models/signUpModel");
const auth = require("../middleware/auth");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// router.get("/", (req, res) => {
//   signUp
//     .find() // finds all as no other parameters are specified
//     .then((result) => {
//       res.send(result);
//     })
//     .then((req) => {
//       console.log(req);
//     });
// });

router.post("/search", auth, async (req, res) => {
  // FRIENDS SCHEMA
  // friends: [
  //   {name: String, messages: [
  //     ["username", "message"]
  //   ]},
  // ],

  //   console.log(req.body);

  let isDuplicate = await signUp.findOne({
    email: req.body.search,
  });

  let thisUser = await signUp.findOne({
    _id: res.locals.id.id,
  });
  //   let currentFriendsList = thisUser.friends;
  //   console.log(currentFriendsList.push("test"));
  //     let newFriendsList = currentFriendsList.push()
  //     await signUp.findOneAndUpdate(
  //       {
  //         _id: res.locals.id.id,
  //       },
  //       {
  //         $push {friends: currentFriendsList.push({
  //           name: isDuplicate.email,
  //           messages: [],
  //         }}),
  //       }
  //     );

  //   thisUser.friends.push({ name: isDuplicate.email, messages: [] })
  if (isDuplicate) {
    return res.status(201).json({ message: "Friend request sent." });
  }
  return res.status(404).json({ message: "Not found" });
});

module.exports = router;
