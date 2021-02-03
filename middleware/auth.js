const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("Access Denied.");
  console.log(req.body);
  // does have token at this point
  try {
    // verify if token is correct
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.id = verified;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token.");
  }
};
