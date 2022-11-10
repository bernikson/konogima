const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/userModel");
const Anime = require("../models/animeModel");
const JWT = require("jsonwebtoken");
const sendEmail = require("../utils/EmailSend");
const cloudinary = require("cloudinary");
const fs = require("fs");

//! ENV variables არ მუშაობს ამაზე რატომღაც
cloudinary.config({
  cloud_name: "dpwr0nkcw",
  api_key: "471119865116464",
  api_secret: "ZFmGVDF0TaG5isrg7qdJeIMAnAE",
});

const userController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      if (!username && !email && !password)
        return next(new ErrorResponse("შეიყვანეთ ყველა მონაცემი", 400));
      const user = await User.create(req.body);
      if (req.cookies["Token"]) req.cookies["Token"] = "";
      const accessToken = user.createToken("access");
      const refreshToken = user.createToken("refresh");
      user.createCookie(res, refreshToken);
      return res.status(200).json({
        message: "მომხმარებელი წარმატებულად დარეგისტრირდა",
        payload: accessToken,
      });
    } catch (error) {
      return next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return next(new ErrorResponse("შეიყვანეთ მონაცემები", 400));
      const user = await User.findOne({ email }).select("+password");
      if (!user) return next(new ErrorResponse("არასწორი ელ-ფოსტა", 400));
      const isMatch = await user.comparePasswords(password);
      if (!isMatch) return next(new ErrorResponse("არასწორი პაროლი", 400));
      if (req.cookies["Token"]) req.cookies["Token"] = "";
      const accessToken = user.createToken("access");
      const refreshToken = user.createToken("refresh");
      console.log(refreshToken);
      user.createCookie(res, refreshToken);
      return res.status(200).json({
        message: "წარმატებულად შევიდა მომხმარებელი",
        payload: accessToken,
      });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { Token } = req.cookies;
      if (!Token) return next(new ErrorResponse("ტოკენს ვადა გაუვიდა", 400));
      const { _id } = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(_id);
      if (!user)
        return next(
          new ErrorResponse(
            "მომხმარებელი ვერ მოიძებნა მოცემული იდენტიფიკაციის კოდით",
            400
          )
        );
      const accessToken = user.createToken("access");
      return res.status(200).json({ payload: accessToken });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("Token");
      res.status(200).json({ message: "Succesfully logged out" });
    } catch (error) {
      next(error);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) return next(new ErrorResponse("შეიყვანეთ ელ-ფოსტა", 400));
      const user = await User.findOne({ email });
      if (!user)
        return next(
          new ErrorResponse("ვერ მოიძებნა მომხმარებელი მოცემული ელ-ფოსტით", 400)
        );
      const Token = user.createToken();
      let url = `${process.env.CLIENT_URL}/reset_password/${Token}`;
      let message = `
	            <a href=${url} style="background: violet; font-weight: bold; text-decoration: none; color: black; padding: 10px 20px; margin: 10px 0; display: inline-block;">პაროლის აღდგენა</a>
	        `;
      sendEmail({
        to: email,
        subject: "პაროლის აღდგენა",
        html: message,
      });
      return res.status(200).json({
        message: "ელ-ფოსტა გაიგზავნა",
      });
      //jwppwsnntsfzdbvx
      //konogimacom@gmail.com
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { password, Token } = req.body;
      if (!password) return next(new ErrorResponse("შეიყვანეთ პაროლი", 400));
      if (!Token) return next(new ErrorResponse("დაფიქსირდა შეცდომა", 400));
      const { _id } = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(_id);
      if (!user)
        return next(new ErrorResponse("მომხარებელი ვერ მოიძებნა", 400));
      user.password = password;
      //? ასეთ შენახვას იმიტომ ვიყენებ რომ პაროლი დაიჰაშოს, მოდელს გადახედე და მიხვდები
      await user.save();
      return res.status(200).json({ message: "პაროლი განახლდა" });
    } catch (error) {
      next(error);
    }
  },
  checkToken: async (req, res, next) => {
    try {
      const Token = req.params.id;
      if (!Token) return next(new ErrorResponse("დაფიქსირდა შეცდომა", 400));
      const { _id } = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(_id);
      if (!user)
        return next(new ErrorResponse("მომხარებელი ვერ მოიძებნა", 400));
      return res.status(200).json({ message: "Token is valid" });
    } catch (error) {
      next(error);
    }
  },
  uploadAvatar: async (req, res, next) => {
    try {
      const { file } = req.files;
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: "Konogima", format: "webp", quality: "auto:eco" },
        async (error, result) => {
          error && console.log(error);
          removeImage(file.tempFilePath);
          await User.findByIdAndUpdate(
            req.user,
            { avatar: result.secure_url },
            { new: true }
          );

          res.status(200).json({
            message: "სურათი შეიცვალა",
            payload: result.secure_url,
          });
        }
      );
    } catch (error) {
      return next(error);
    }
  },
  uploadAnimeImage: async (req, res, next) => {
    try {
      const { file } = req.files;
      console.log(file.tempFilePath);
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { folder: "Konogima", format: "webp", quality: "auto:eco" },
        async (error, result) => {
          error && console.log(error);
          removeImage(file.tempFilePath);
          res.status(200).json({
            message: "ანიმეს სურათი შეიცვალა",
            payload: result?.secure_url,
          });
        }
      );
    } catch (error) {
      return next(error);
    }
  },
  createAnime: async (req, res, next) => {
    try {
      let io = req.app.get("io");
      let { year, totaltime, age, series } = req.body;
      if (totaltime === "NaN") req.body.totaltime = "";
      if (age === "NaN") req.body.age = "";
      if (series === "NaN") req.body.age = "";
      const anime = await Anime.create(req.body);
      res.status(200).json({ message: "ანიმე წარმატებულად შეიქმნა" });
      return io.emit("createAnimeClient", {
        success: true,
        payload: anime,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteAnime: async (req, res, next) => {
    try {
      const { animeId } = req.body;
      let io = req.app.get("io");
      console.log(req.body);
      await Anime.findByIdAndDelete(animeId);
      res.status(200).json({ message: "ანიმე წარმატებულად წაიშალა" });
      return io.emit("deleteAnimeClient", {
        success: true,
        payload: animeId,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateAnime: async (req, res, next) => {
    try {
      const { id } = req.params;
      let io = req.app.get("io");
      let {
        year,
        totaltime,
        age,
        name,
        voiceover,
        translator,
        genres,
        director,
        studio,
        description,
        background,
        series,
        uploadDate,
      } = req.body;
      if (totaltime === "NaN") totaltime = "";
      if (age === "NaN") age = "";
      let anime = await Anime.findById(id).populate("seasons comments");
      anime.year = year;
      anime.totaltime = totaltime;
      anime.age = age;
      anime.name = name;
      anime.voiceover = voiceover;
      anime.translator = translator;
      anime.genres = genres;
      anime.director = director;
      anime.studio = studio;
      anime.description = description;
      anime.background = background;
      anime.series = series;
      anime.uploadDate = uploadDate;
      await anime.save();
      res.status(200).json({ message: "ანიმე წარმატებულად განახლდა" });
      return io.emit("updateAnimeClient", {
        success: true,
        payload: anime,
      });
    } catch (error) {
      next(error);
    }
  },
};

const removeImage = (path) => {
  fs.unlink(path, (error) => {
    if (error) throw error;
  });
};

module.exports = userController;
