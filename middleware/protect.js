const jwt = require("jsonwebtoken");
const User = require("../model/user");
const protect = async (req, res, next) => {
  let token;
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Not Authorized, Token missing",
    });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById( decodedToken.id ).select("-password");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not exist",
    });
  }
  req.user = user;

  next();
};
module.exports = protect;
