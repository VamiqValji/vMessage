const router = require("express").Router();
const signUp = require("../models/signUpModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv").config();
require("dotenv").config();
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  signUp
    .find() // finds all as no other parameters are specified
    .then((result) => {
      res.send(result);
    })
    .then((req) => {
      console.log(req);
    });
});

router.post("/", async (req, res) => {
  let isDuplicate = await signUp.findOne({
    email: req.body.email,
    // password: req.body.password,
  });
  if (isDuplicate) {
    console.log("Found email.");
    if (!bcrypt.compareSync(req.body.password, isDuplicate.password)) {
      console.log("Incorrect password.");
      return res.status(400).json({ message: "Incorrect Password" });
    }
    console.log("Correct password.");
    // jwt create & assign token
    const token = jwt.sign(
      { id: isDuplicate._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        // else
        res.json({ message: "Logged in", token /*, id: isDuplicate._id*/ });
      }
    );
    // return (
    //   res
    //     .status(201)
    //     .json({ message: "Logged in" })
    //     // .header("auth-token", token)
    //     .send(token)
    // );
  } else {
    // email not found
    return res.status(400).json({ message: "Login Error" });
  }
});

router.post("/token", auth, async (req, res) => {
  let isDuplicate = await signUp.findOne({
    _id: res.locals.id.id,
  });
  if (isDuplicate) res.send("Logged in");
});

module.exports = router;
