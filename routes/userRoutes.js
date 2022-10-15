const Router = require("express").Router();
const userController = require("../controllers/userController");
const ValidateImage = require("../middlewares/ValidateImage");
const verifyToken = require("../middlewares/VerifyToken");
const AdminCheck = require("../middlewares/AdminCheck");

const {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  checkToken,
  uploadAvatar,
  uploadAnimeImage,
  createAnime,
  updateAnime,
} = userController;

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/refreshToken").get(refreshToken);
Router.route("/logout").get(logout);
Router.route("/forgotPassword").post(forgotPassword);
Router.route("/checkToken/:id").post(checkToken);
Router.route("/resetPassword").patch(resetPassword);
Router.route("/uploadImage").post(ValidateImage, verifyToken, uploadAvatar);
Router.route("/uploadAnimeImage").post(
  ValidateImage,
  verifyToken,
  uploadAnimeImage
);
Router.route("/createAnime").post(verifyToken, AdminCheck, createAnime);
Router.route("/updateAnime/:id").patch(verifyToken, AdminCheck, updateAnime);

module.exports = Router;
