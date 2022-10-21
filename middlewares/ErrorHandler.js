const ErrorResponse = require("../utils/ErrorResponse");

const ErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (err.code === 11000) {
    let message;
    if (Object.keys(err["keyValue"])[0] === "username") {
      message = "ამ სახელით უკვე დარეგისტრირებულია მომხმარებელი";
    } else if (Object.keys(err["keyValue"])[0] === "email") {
      message = "ამ ელ-ფოსტით უკვე დარეგისტრირებულია მომხმარებელი";
    } else if (Object.keys(err["keyValue"])[0] === "name") {
      message = "ამ სახელით უკვე შექმნილია ანიმე";
    }
    error = new ErrorResponse(message, 400);
  }
  if (err.name === "ValidationError") {
    let errorObj = Object.values(err.errors).map((val) => val.properties);
    let message = errorObj.map((output) => output.message);
    error = new ErrorResponse(message, 400);
  }
  return res.status(error.statusCode || 500).json({
    message: error.message || "წარმოიშვა სერვერის პრობლემა",
  });
};

module.exports = ErrorHandler;
