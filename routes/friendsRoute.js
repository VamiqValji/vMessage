const router = require("express").Router();
const signUp = require("../models/signUpModel");
const auth = require("../middleware/auth");

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
    console.log(result);
    return res.status(201).json({ frs: result.friendRequests });
  });
  // .then((res) => {
  //   console.log(frs);
  // });
});

router.post("/requests/add", auth, async (req, res) => {
  // FRIENDS SCHEMA
  // friends: [
  //   {name: String, messages: [
  //     ["username", "message"]
  //   ]},
  // ],
  // "name:" represents name of friend,
  // messages: ["username", "message"] username
  // represents the username of the person who sent
  // the message in the second index([1]) of the list

  let requestUser = await signUp.findOne({
    _id: res.locals.id.id,
  });

  const returnJSON = (requestedUser = Boolean) => {
    let user;
    let msg;
    if (requestedUser) {
      user = requestUser.email;
      msg = `Hi, ${req.body.username}`;
    } else {
      user = req.body.username;
      msg = `Hi, ${requestUser.email}`;
    }
    return {
      name: user,
      messages: [[user, msg]],
    };
  };

  await signUp.findOneAndUpdate(
    {
      _id: res.locals.id.id,
    },
    {
      $addToSet: {
        friends: returnJSON(true),
      },
    }
  );
  await signUp.findOneAndUpdate(
    {
      email: req.body.username,
    },
    {
      $addToSet: {
        friends: returnJSON(false),
      },
    }
  );
  return res.status(201).json({ message: "Added friend." });
});

router.post("/requests/delete", auth, async (req, res) => {
  let requestUser = await signUp.findOne({
    _id: res.locals.id.id,
  });
  await signUp.findOneAndUpdate(
    {
      email: req.body.username,
    },
    {
      $pull: {
        friendRequests: { from: requestUser.email },
      },
    }
  );
  await signUp.findOneAndUpdate(
    {
      _id: res.locals.id.id,
    },
    {
      $pull: {
        friendRequests: { to: req.body.username },
      },
    }
  );
  console.log({ from: res.locals.id.id }, { to: req.body.username });
});

router.post("/search", auth, async (req, res) => {
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

  let requestUser = await signUp.findOne({
    _id: res.locals.id.id,
  });

  await signUp.findOneAndUpdate(
    {
      _id: res.locals.id.id,
    },
    {
      $addToSet: {
        // addToSet works like push but pushes if no duplicates of object
        friendRequests: { to: isDuplicate.email },
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
        friendRequests: { from: requestUser.email },
      },
    }
  );

  // if code made it this far, friend request sent
  return res.status(201).json({ message: "Friend request sent." });
});

module.exports = router;
