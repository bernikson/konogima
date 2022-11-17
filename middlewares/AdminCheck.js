const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/userModel");

const AdminCheck = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return next(new ErrorResponse("მომხმარებელი ვერ მოიძებნა", 400));
    if (user.role !== 1)
      return next(
        new ErrorResponse("მომხმარებელი არ არის ადმინისტრატორი", 400)
      );
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = AdminCheck;
