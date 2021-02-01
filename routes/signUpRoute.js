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
  console.log(req.body);
  // let hashedPass = await bcrypt.hash(req.body.password, 10); //lvl of encryption

  let isDuplicate = await signUp.findOne({
    email: req.body.email,
  });
  if (isDuplicate) {
    console.log("Duplicate email.");
    return res.status(400).json({ message: "That email is already used." });
  }
  // else, create new item in database
  item = new signUp({
    email: req.body.email,
    // password: hashedPass,
    password: req.body.password,
  });
  console.log(item);
  item.save();
  return res.status(201).json({ message: "Created." });
});

module.exports = router;
