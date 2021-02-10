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

router.post("/requests", auth, (req, res) => {
  signUp.findById({ _id: res.locals.id.id }).then((result) => {
    let frsTo = [];
    let frsFrom = [];
    console.log(result);
    result.friendRequests.forEach((fr) => {
      if (fr.to) {
        signUp.findOne({ _id: fr.to }).then((result) => {
          frsTo.push(result.email);
        });
      } else if (fr.from) {
        signUp.findOne({ _id: fr.from }).then((result) => {
          frsFrom.push(result.email);
        });
      }
    });
    res.send({ to: frsTo, from: frsFrom });
    // incoming, outgoing
  });
  // .then((res) => {
  //   console.log(frs);
  // });
});

router.post("/search", auth, async (req, res) => {
  // FRIENDS SCHEMA
  // friends: [
  //   {name: String, messages: [
  //     ["username", "message"]
  //   ]},
  // ],

  let isDuplicate = await signUp.findOne({
    email: req.body.search,
  });

  // let thisUser = await signUp.findOne({
  //   _id: res.locals.id.id,
  // });

  if (isDuplicate) {
    // check if user is trying to add themselves
    if (isDuplicate.id === res.locals.id.id) {
      return res.status(401).json({ message: "You can't add yourself!" });
    }
    // check if friend request already sent
    // isDuplicate.friendRequests.forEach((fr) => {
    //   try {
    //     if (fr.from === res.locals.id.id) {
    //       console.log(fr);
    //       console.log("Duplicate Friend Request:", fr);
    //       // return res
    //       //   .status(200)
    //       //   .json({ message: "Friend request already sent." });
    //     }
    //   } catch (err) {
    //     throw err;
    //   }
    // });
  } else {
    // if not duplicate, then user doesn't exist
    return res.status(404).json({ message: "User not found." });
  }

  // update user's friendRequests (TO)

  await signUp.findOneAndUpdate(
    {
      _id: res.locals.id.id,
    },
    {
      $addToSet: {
        // addToSet works like push but pushes if no duplicates of object
        friendRequests: [{ to: isDuplicate._id }],
      },
    }
  );
  // update user being added friendRequests (FROM)
  await signUp.findOneAndUpdate(
    {
      _id: isDuplicate._id,
    },
    {
      $addToSet: {
        // addToSet works like push but pushes if no duplicates of object
        friendRequests: [{ from: res.locals.id.id }],
      },
    }
  );

  // if code made it this far, friend request sent
  return res.status(201).json({ message: "Friend request sent." });
});

module.exports = router;
