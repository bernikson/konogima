const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/userModel");
const Anime = require("../models/animeModel");
const Season = require("../models/seasonModel");
const Comment = require("../models/commentModel");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const JWT = require("jsonwebtoken");
const sendEmail = require("../utils/EmailSend");
const cloudinary = require("cloudinary");
const fs = require("fs");
const ImageKit = require("imagekit");

//! ENV variables არ მუშაობს ამაზე რატომღაც
cloudinary.config({
  cloud_name: "dpwr0nkcw",
  api_key: "471119865116464",
  api_secret: "ZFmGVDF0TaG5isrg7qdJeIMAnAE",
});

var imagekit = new ImageKit({
  publicKey: "public_x3ARmEEdmkgz2mJ52AhpsA7ZVg0=",
  privateKey: "private_dfzHgDmLgAd+8LKraTQ86nOZBPA=",
  urlEndpoint: "https://ik.imagekit.io/rn3rkibio",
});

const userController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      if (!username && !email && !password)
        return next(new ErrorResponse("შეიყვანეთ ყველა მონაცემი", 400));
      const user = await User.create(req.body);
      if (req.cookies["Token"]) req.cookies["Token"] = "";
      const refreshToken = user.createToken();
      user.createCookie(res, refreshToken);
      return res.status(200).json({
        message: "მომხმარებელი წარმატებულად დარეგისტრირდა",
        payload: refreshToken,
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
      const refreshToken = user.createToken();
      user.createCookie(res, refreshToken);
      return res.status(200).json({
        message: "წარმატებულად შევიდა მომხმარებელი",
        payload: refreshToken,
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
      return res.status(200).json({ payload: Token });
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
      console.log(req.body);
      if (!req.body.image)
        return next(new ErrorResponse("სურათი ვერ მოიძებნა", 400));
      imagekit
        .upload({
          file: req.body.image, //required
          fileName: "test.jpg", //required
        })
        .then(async (response) => {
          await User.findByIdAndUpdate(
            req.user,
            { avatar: response.url },
            { new: true }
          );
          return res.status(200).json({
            message: "სურათი შეიცვალა",
            payload: response.url,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
  uploadAnimeImage: async (req, res, next) => {
    try {
      if (!req.body.image)
        return next(new ErrorResponse("სურათი ვერ მოიძებნა", 400));
      imagekit
        .upload({
          file: req.body.image, //required
          fileName: "test.jpg", //required
        })
        .then(async (response) => {
          res.status(200).json({
            message: "სურათი შეიცვალა",
            payload: response.url,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      return next(error);
    }
  },
  createAnime: async (req, res, next) => {
    try {
      let { totaltime, age, series } = req.body;
      if (totaltime === "NaN") req.body.totaltime = "";
      if (age === "NaN") req.body.age = "";
      if (series === "NaN") req.body.age = "";
      const anime = await Anime.create(req.body);
      return res.status(200).json({
        message: "ანიმე წარმატებულად შეიქმნა",
        success: true,
        payload: anime,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteAnime: async (req, res, next) => {
    try {
      const { animeId } = req.body;
      let io = req.app.get("io");
      await Anime.findByIdAndDelete(animeId);
      res.status(200).json({
        message: "ანიმე წარმატებულად წაიშალა",
        success: true,
        payload: animeId,
      });
    } catch (error) {
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
        status,
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
      anime.status = status;
      anime.realUpdate = Date.now();
      await anime.save();
      res.status(200).json({
        message: "ანიმე წარმატებულად განახლდა",
        success: true,
        payload: anime,
      });
    } catch (error) {
      next(error);
    }
  },
  getAnimes: async (req, res, next) => {
    try {
      const animes = await Anime.find()
        .sort({ realUpdate: -1 })
        .populate("seasons");
      return res.status(200).json({
        success: true,
        payload: animes,
      });
    } catch (error) {
      next(error);
    }
  },
  getUserData: async (req, res, next) => {
    try {
      const user = await User.findById(req.user)
        .populate("watchLater.anime")
        .populate({ path: "watchLater.anime", populate: { path: "seasons" } });
      if (!user)
        return next(new ErrorResponse("მომხმარებელი ვერ მოიძებნა", 400));
      return res.status(200).json({
        success: true,
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  },
  createAnimeSeason: async (req, res, next) => {
    try {
      const { animeSeasons, animeId } = req.body;
      let season = await Season.findOne({
        animeId,
        index: animeSeasons.season,
      });
      let anime = await Anime.findById(animeId);
      if (!anime) return next(new ErrorResponse("ანიმე ვერ მოიძებნა", 400));
      if (!season) {
        season = await Season.create({
          index: animeSeasons.season,
          series: {
            playerOne: animeSeasons.playerOne,
            playerTwo: animeSeasons.playerTwo,
            playerThree: animeSeasons.playerThree,
            OVA: animeSeasons.OVA,
          },
          animeId,
        });
        anime.seasons.push(season);
        await anime.save();
      } else {
        season.series.push({
          playerOne: animeSeasons.playerOne,
          playerTwo: animeSeasons.playerTwo,
          playerThree: animeSeasons.playerThree,
          OVA: animeSeasons.OVA,
        });
        await season.save();
      }
      return res.status(200).json({
        success: true,
        payload: season,
        message: "სერია წარმეტებით დაემატა",
      });
    } catch (error) {
      next(error);
    }
  },
  uploadProductImage: async (req, res, next) => {
    try {
      if (!req.body.image)
        return next(new ErrorResponse("სურათი ვერ მოიძებნა", 400));
      imagekit
        .upload({
          file: req.body.image, //required
          fileName: "test.jpg", //required
        })
        .then(async (response) => {
          res.status(200).json({
            message: "სურათი შეიცვალა",
            payload: response.url,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      return next(error);
    }
  },
  createProduct: async (req, res, next) => {
    try {
      const {
        name,
        type,
        price,
        quantity,
        salePrice,
        saleExpirery,
        description,
        background,
        sold,
      } = req.body;
      if (
        !name &&
        !type &&
        !price &&
        !quantity &&
        !salePrice &&
        !saleExpirery &&
        !description &&
        !background &&
        !sold
      ) {
        return next(new ErrorResponse("შეიყვანეთ ინფორმაცია", 400));
      }
      const product = await Product.create({
        name,
        type,
        price,
        quantity,
        salePrice,
        saleExpirery,
        description,
        background,
      });
      return res.status(200).json({
        success: true,
        message: "პროდუქტი წარმატებულად შეიქმნა",
        payload: product,
      });
    } catch (error) {
      return next(error);
    }
  },
  getProducts: async (req, res, next) => {
    try {
      const products = await Product.find();
      return res.status(200).json({
        success: true,
        message: "წარმატებულად მივიღეთ პროდუქტები",
        payload: products,
      });
    } catch (error) {
      return next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        type,
        price,
        quantity,
        salePrice,
        saleExpirery,
        description,
        background,
        sold,
      } = req.body;
      if (
        !name &&
        !type &&
        !price &&
        !quantity &&
        !salePrice &&
        !saleExpirery &&
        !description &&
        !background &&
        !sold
      ) {
        return next(new ErrorResponse("შეიყვანეთ ინფორმაცია", 400));
      }
      const product = await Product.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            type,
            price,
            quantity,
            salePrice,
            saleExpirery,
            description,
            background,
            sold,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "პროდუქტი წარმატებულად განახლდა",
        payload: product,
      });
    } catch (error) {
      return next(error);
    }
  },
  createReview: async (req, res, next) => {
    try {
      const { username, userId, comment, rating, avatar, productId } = req.body;
      const review = await Review.create({
        username,
        userId,
        comment,
        rating,
        productId,
        avatar,
      });
      const product = await Product.findById(productId);
      let counter = 0;
      product.reviews.push(rating);
      product.reviews.forEach((review) => {
        console.log(review);
        counter += review;
      });
      let result = counter / product.reviews.length;
      product.rating = result;
      console.log(result);
      console.log(product);
      await product.save();
      return res.status(200).json({
        message: "პროდუქტის შეფასება წარმატებით დაიდო",
        success: true,
        payload: review,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
  getReview: async (req, res, next) => {
    try {
      const { id } = req.params;
      const reviews = await Review.find({ productId: id }).sort({
        createdAt: -1,
      });
      return res.status(200).json({
        message: "პროდუქტის შეფასებები წარმატებით მივიღეთ",
        success: true,
        payload: reviews,
      });
    } catch (error) {
      return next(error);
    }
  },
};

const removeImage = (path) => {
  fs.unlink(path, (error) => {
    if (error) throw error;
  });
};

module.exports = userController;
