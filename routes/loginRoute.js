const router = require("express").Router();
const signUp = require("../models/signUpModel");
const bcrypt = require("bcrypt");

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
    return res.status(201).json({ message: "Logged in" });
  } else {
    // email not found
    return res.status(400).json({ message: "Login Error" });
  }
});

module.exports = router;
