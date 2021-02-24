const router = require("express").Router();
const signUp = require("../models/signUpModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  let hashedPass = await bcrypt.hash(req.body.password, 10); //lvl of encryption

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
    password: hashedPass,
    // password: req.body.password,
  });
  console.log(item);
  item.save();
  // jwt create & assign token
  const token = jwt.sign(
    { id: item._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" },
    (err, token) => {
      if (err) throw err;
      // else
      res.status(201).json({ message: "Created", token, id: item._id });
      console.log(token);
    }
  );
  // return res.status(201).json({ message: "Created." });
});

module.exports = router;
