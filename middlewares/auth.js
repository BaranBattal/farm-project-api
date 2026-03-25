const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Access denied. no token provided");
    }
    const token = authHeader.split(" ")[1];
    const SECRETKEY = process.env.SECRETKEY;
    const decode = jwt.verify(token, SECRETKEY);
    req.user = {
      username: decode.username,
      id: decode.id,
      role: decode.role,
    };
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Invalid or expired token!");
  }
};

module.exports = authMiddleware;
