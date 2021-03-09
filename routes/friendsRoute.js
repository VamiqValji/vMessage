const router = require("express").Router();
const signUp = require("../models/signUpModel");
const messages = require("../models/messagesModel");
const auth = require("../middleware/auth");

router.get("/get", auth, (req, res) => {
  signUp.findById({ _id: res.locals.id.id }).then((result) => {
    // console.log(result);
    return res
      .status(201)
      .json({ friends: result.friends, yourUsername: result.email });
  });
});

router.post("/get/messages", auth, async (req, res) => {
  // returns GC / DM info
  let roomName = req.body.roomName;
  console.log("get/messages", `(${req.body.roomName})`);

  let roomData = await messages.findOne({ groupName: roomName });
  if (roomData) {
    return res.status(200).json(roomData);
  }
  return res.status(404).json({ message: "Chat not found." });
});

router.post("/add/messages", auth, async (req, res) => {
  // console.log("add msg post request", req.body);
  await messages.findOneAndUpdate(
    {
      groupName: req.body.roomName,
    },
    {
      $addToSet: {
        messages: {
          author: req.body.author,
          message: req.body.message,
          timeSent: req.body.timeSent,
        },
      },
    }
  );
  return res.status(200).json({ message: "Added message." });
  // return res.status(404).json({ message: "Chat not found." });
});

router.post("/requests", auth, (req, res) => {
  signUp.findById({ _id: res.locals.id.id }).then((result) => {
    // console.log(result);
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
  // ^^^ DEPRECATED // NOT IN USE ANYMORE

  let requestUser = await signUp.findOne({
    _id: res.locals.id.id,
  });

  const consistent = [requestUser.email, req.body.username].sort();
  const groupName = `${consistent[0]},${consistent[1]}`; // reference to 'messages' section of DB

  await signUp.findOneAndUpdate(
    {
      _id: res.locals.id.id,
    },
    {
      $addToSet: {
        friends: req.body.username,
        chats: { name: groupName, isDM: true },
      },
      $pullAll: {
        friendRequests: [{to: req.body.username},{from: req.body.username}],
      },
    }
  );
  await signUp.findOneAndUpdate(
    {
      email: req.body.username,
    },
    {
      $addToSet: {
        friends: requestUser.email,
        chats: { name: groupName, isDM: true },
      },
      $pullAll: {
        friendRequests: [{to: requestUser.email},{from: requestUser.email}],
      },
    }
  );

  let isDuplicate = await messages.findOne({
    groupName: groupName,
  });

  if (!isDuplicate) {
    groupChatOrDM = new messages({
      groupNickname: groupName,
      groupName: groupName,
      isDM: true,
      members: [requestUser.email, req.body.username],
      messages: [],
      owner: req.body.username,
    });
    groupChatOrDM.save();
  }

  return res.status(201).json({ message: "Added friend." });
});

router.put("/list/delete", auth, async (req, res) => {

  const requestUser = await signUp.findOne({
    _id: res.locals.id.id,
  });  
  const removedUser = await signUp.findOne({
    email: req.body.username,
  });
  let newListOfFriends_REQUESTED_USER = removedUser.friends.filter(friend => friend !== requestUser.email);
  let newListOfFriends_REMOVED_USER = requestUser.friends.filter(friend => friend !== removedUser.email);
  
  console.log(newListOfFriends_REMOVED_USER, newListOfFriends_REQUESTED_USER)

  await signUp.findOneAndUpdate(
    {
      email: req.body.username,
    },
    {
      $set: {
        friends: newListOfFriends_REMOVED_USER,
      },
      // $pull: {
      //   friends: removedUser.email,
      // },
    }
  );
  await signUp.findOneAndUpdate(
    {
      _id: res.locals.id.id,
    },
    {
      $set: {
        friends: newListOfFriends_REQUESTED_USER,
      },
      // $pull: {
      //   friends: requestUser.email,
      // },
    }
  );
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
      $pullAll: {
        friendRequests: [{ from: requestUser.email }, { to: requestUser.email }],
      },
    }
  );
  await signUp.findOneAndUpdate(
    {
      _id: res.locals.id.id,
    },
    {
      $pullAll: {
        friendRequests: [{ to: req.body.username }, { from: req.body.username }],
      },
    }
  );
  // console.log({ from: res.locals.id.id }, { to: req.body.username });
});

router.post("/search", auth, async (req, res) => {
  let isDuplicate = await signUp.findOne({
    email: req.body.search,
  });

  let requestUser = await signUp.findOne({
    _id: res.locals.id.id,
  });

  if (isDuplicate) {
    // check if user is trying to add themselves
    if (isDuplicate.id === res.locals.id.id) {
      return res.status(401).json({ message: "You can't add yourself!" });
    }
    // check if user is already friends
    // with who they are trying to add
    for (let i = 0; i < requestUser.friends.length; i++) {
      // console.log(requestUser.friends[i].name);
      // console.log(isDuplicate.email);
      if (requestUser.friends[i].name === isDuplicate.email) {
        return res
          .status(401)
          .json({ message: "This person is already your friend!" });
      }
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
