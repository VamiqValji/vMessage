const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send("Access Denied.");
  // does have token at this point
  try {
    // verify if token is correct
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.id = verified;
    // console.log(req.id);
    res.locals.id = req.id;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token.");
  }
};

module.exports = auth;
