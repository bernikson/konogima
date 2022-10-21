const fs = require("fs");
const ErrorResponse = require("../utils/ErrorResponse.js");

const validateImage = (req, res, next) => {
  try {
    if (!req.files & (Object.keys(req.files).length === 0))
      return next(new ErrorResponse("სურათი არ აიტვირთა", 400));
    let file = req.files.file;
    if (file.size > 1024 * 1024 * 10) {
      removeImage(file.tempFilePath);
      return next(new ErrorResponse("სურათის ზომა დიდია, ატვირთეთ სხვა", 400));
    }
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/webp"
    ) {
      removeImage(file.tempFilePath);
      return next(new ErrorResponse("არასწორი სურათის ფორმატი", 400));
    }
    next();
  } catch (error) {
    return next(error);
  }
};

const removeImage = (path) => {
  fs.unlink(path, (error) => {
    if (error) throw error;
  });
};

module.exports = validateImage;
