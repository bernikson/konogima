const Router = require("express").Router();
const userController = require("../controllers/userController");
const ValidateImage = require("../middlewares/ValidateImage");
const verifyToken = require("../middlewares/VerifyToken");
const AdminCheck = require("../middlewares/AdminCheck");
const { getUserData } = require("../controllers/userController");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 10000, // 1 hour
  max: 1, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: { message: "სცადეთ მოგვიანებით" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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

Router.route("/register").post(authLimiter, register);
Router.route("/login").post(authLimiter, login);
Router.route("/refreshToken").get(refreshToken);
Router.route("/logout").get(logout);
Router.route("/forgotPassword").post(authLimiter, forgotPassword);
Router.route("/checkToken/:id").post(checkToken);
Router.route("/resetPassword").patch(authLimiter, resetPassword);
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
