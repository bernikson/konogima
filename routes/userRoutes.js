const Router = require("express").Router();
const userController = require("../controllers/userController");
const ValidateImage = require("../middlewares/ValidateImage");
const verifyToken = require("../middlewares/VerifyToken");
const AdminCheck = require("../middlewares/AdminCheck");
const { getUserData } = require("../controllers/userController");

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
  deleteAnime,
  getAnimes,
  createAnimeSeason,
} = userController;

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/refreshToken").get(refreshToken);
Router.route("/logout").get(logout);
Router.route("/forgotPassword").post(forgotPassword);
Router.route("/checkToken/:id").post(checkToken);
Router.route("/resetPassword").patch(resetPassword);
Router.route("/uploadImage").post(ValidateImage, verifyToken, uploadAvatar);
Router.route("/getUserData").get(verifyToken, getUserData);

Router.route("/getAnimes").get(getAnimes);
Router.route("/uploadAnimeImage").post(
  ValidateImage,
  verifyToken,
  uploadAnimeImage
);
Router.route("/createAnime").post(verifyToken, AdminCheck, createAnime);
Router.route("/deleteAnime").post(verifyToken, AdminCheck, deleteAnime);
Router.route("/updateAnime/:id").patch(verifyToken, AdminCheck, updateAnime);
Router.route("/createAnimeSeason").post(
  verifyToken,
  AdminCheck,
  createAnimeSeason
);

module.exports = Router;
