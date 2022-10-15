const ErrorResponse = require("../utils/ErrorResponse");
const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

const RefreshToken = async (req, res, next) => {
  try {
    const { Token } = req.cookies;
    if (!Token) return next(new ErrorResponse("ტოკენს ვადა გაუვიდა", 400));
    const { _id } = JWT.verify(Token, process.env.JWT_SECRET);
    res.clearCookie(Token);
    const user = await User.findById(_id);
    const newToken = user.createToken();
    user.createCookie(res, newToken);
    req.user = _id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = RefreshToken;
