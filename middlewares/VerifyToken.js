const ErrorResponse = require("../utils/ErrorResponse");
const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token;
    console.log(req.body);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return next(new ErrorResponse("მომხმარებელი არ არის ავტორიზებული", 400));
    const { _id } = JWT.verify(token, process.env.JWT_SECRET);
    req.user = _id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
