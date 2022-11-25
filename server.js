//! Setting up server
const express = require("express");
const fs = require("fs");
const app = express();
const httpsOptions = {
  cert: fs.readFileSync("./ssl/konogima_com.crt"),
  ca: fs.readFileSync("./ssl/konogima_com.ca-bundle"),
  key: fs.readFileSync("./ssl/private.key"),
};

const httpPort = 80;
const httpsPort = 443;
const httpsServer = require("https").createServer(httpsOptions, app);
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "https://konogima.com",
  },
});

//! Importing libraries
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const ErrorHandler = require("./middlewares/ErrorHandler");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const User = require("./models/userModel");
const expressFileUpload = require("express-fileupload");
const Anime = require("./models/animeModel");
const Season = require("./models/seasonModel");
const Comment = require("./models/commentModel");
const compression = require("compression");
const path = require("path");

//! Express middlewares
app.use(compression());
app.set("io", io);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: "https://konogima.com" }));
app.use(cookieParser());
app.use(expressFileUpload({ useTempFiles: true }));
app.use("/api/user", userRoutes);
app.use(ErrorHandler);

app.use((req, res, next) => {
  if (req.protocol === "http") {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

//! Socket.io
io.on("connection", async (socket) => {
  let conenctedUsers = io.engine.clientsCount;

  //?Whenever user connects, server emits data to client event
  socket.on("connectedUsersServer", (data) => {
    socket.emit("connectedUsers", conenctedUsers);
  });

  //?Whenever user disconnects, decrements size of connectedUser and emits data to client event

  socket.on("disconnect", () => {
    socket.emit("connectedUsers", conenctedUsers - 1);
  });

  socket.on("getComments", async ({ animeId, pages }) => {
    try {
      const comments = await Comment.find({ animeId })
        .populate("reply")
        .limit(10)
        .skip(pages * 10)
        .sort({ createdAt: -1 });
      socket.emit("getCommentsClient", {
        success: true,
        payload: comments,
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("createSeasons", async ({ Token, animeSeasons, animeId }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("createAnimeSeason", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      if (user.role !== 1) {
        return socket.emit("createAnimeSeason", {
          success: false,
          message: "მომხმარებელი არ არის ადმინი",
        });
      }
      let season = await Season.findOne({
        animeId,
        index: animeSeasons.season,
      });
      let anime = await Anime.findById(animeId);
      if (!anime)
        return socket.emit("createAnimeSeason", {
          success: false,
          message: "ანიმე ვერ მოიძებნა",
        });
      if (!season) {
        season = await Season.create({
          index: animeSeasons.season,
          series: {
            playerOne: animeSeasons.playerOne,
            playerTwo: animeSeasons.playerTwo,
            playerThree: animeSeasons.playerThree,
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
        });
        await season.save();
      }

      socket.emit("createAnimeSeason", {
        success: true,
        payload: season,
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("updateSeries", async ({ Token, data }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("updateAnimeSerie", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      if (user.role !== 1) {
        return socket.emit("updateAnimeSerie", {
          success: false,
          message: "მომხმარებელი არ არის ადმინი",
        });
      }
      const season = await Season.findById(data.seasonId);
      if (!season) {
        return socket.emit("updateAnimeSerie", {
          success: false,
          message: "სეზონი ვერ მოიძებნა",
        });
      }
      season?.series.map((output) => {
        if (output._id.equals(data?.playerId)) {
          output.playerOne = data.playerOne;
          output.playerTwo = data.playerTwo;
          output.playerThree = data.playerThree;
          return output;
        }
      });

      await season.save();
      socket.emit("updateAnimeSerie", {
        success: true,
        payload: season,
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("deleteSeries", async ({ Token, data }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("deleteAnimeSerie", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      if (user.role !== 1) {
        return socket.emit("deleteAnimeSerie", {
          success: false,
          message: "მომხმარებელი არ არის ადმინი",
        });
      }
      const season = await Season.findById(data.seasonId);
      if (!season) {
        return socket.emit("deleteAnimeSerie", {
          success: false,
          message: "სეზონი ვერ მოიძებნა",
        });
      }
      let serieIndex = season?.series?.findIndex((index) =>
        index._id.equals(data.playerId)
      );
      season?.series.splice(serieIndex, 1);
      await season.save();
      socket.emit("deleteAnimeSerie", {
        success: true,
        payload: season,
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("giveView", async ({ animeId }) => {
    try {
      await Anime.findByIdAndUpdate(
        animeId,
        {
          $inc: { views: 1 },
        },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("giveLike", async ({ Token, animeId, userId }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("giveLikeClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      const anime = await Anime.findById(animeId);
      if (anime.likes.includes(userId)) {
        let index = anime.likes.indexOf(userId);
        anime.likes.splice(index, 1);
      } else {
        if (anime.dislikes.includes(userId)) {
          let index = anime.dislikes.indexOf(userId);
          anime.dislikes.splice(index, 1);
        }
        anime.likes.push(userId);
      }

      await anime.save();
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("giveDislike", async ({ Token, animeId, userId }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("giveDislikeClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      const anime = await Anime.findById(animeId);
      if (anime.dislikes.includes(userId)) {
        let index = anime.dislikes.indexOf(userId);
        anime.dislikes.splice(index, 1);
      } else {
        if (anime.likes.includes(userId)) {
          let index = anime.likes.indexOf(userId);
          anime.likes.splice(index, 1);
        }
        anime.dislikes.push(userId);
      }

      await anime.save();
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("writeComment", async ({ Token, pages, commentData }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("writeCommentClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      if (commentData.comment.length > 1000)
        return socket.emit("writeCommentClient", {
          success: false,
          message: "ათას სიმბოლოზე მეტს ვერ დაწერთ კომენტარში",
        });
      await Comment.create(commentData);
      let comments = await Comment.find({ animeId: commentData?.animeId })
        .populate("reply")
        .limit(10)
        .skip(pages * 10)
        .sort({ createdAt: -1 });
      return socket.emit("writeCommentClient", {
        success: true,
        payload: comments,
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("likeComment", async ({ Token, animeId, commentId, userId }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("likeCommentClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      let comment = await Comment.findById(commentId);
      if (!comment)
        return socket.emit("likeCommentClient", {
          success: false,
          message: "კომენტარი ვერ მოიძებნა",
        });
      if (comment.likeRatio.like.includes(userId)) {
        let index = comment?.likeRatio.like.indexOf(userId);
        comment?.likeRatio.like.splice(index, 1);
        comment.likeRatio.counter -= 1;
      } else {
        if (comment.likeRatio.dislike.includes(userId)) {
          let index = comment.likeRatio.dislike.indexOf(userId);
          comment.likeRatio.dislike.splice(index, 1);
          comment.likeRatio.counter += 1;
        }
        comment.likeRatio.like.push(userId);
        comment.likeRatio.counter += 1;
      }
      await comment.save();
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("dislikeComment", async ({ Token, commentId, userId }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("dislikeCommentClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      let comment = await Comment.findById(commentId);
      if (!comment)
        return socket.emit("dislikeCommentClient", {
          success: false,
          message: "კომენტარი ვერ მოიძებნა",
        });
      if (comment.likeRatio.dislike.includes(userId)) {
        let index = comment?.likeRatio.dislike.indexOf(userId);
        comment?.likeRatio.dislike.splice(index, 1);
        comment.likeRatio.counter += 1;
      } else {
        if (comment.likeRatio.like.includes(userId)) {
          let index = comment.likeRatio.like.indexOf(userId);
          comment.likeRatio.like.splice(index, 1);
          comment.likeRatio.counter -= 1;
        }
        comment.likeRatio.dislike.push(userId);
        comment.likeRatio.counter -= 1;
      }
      await comment.save();
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("replyComment", async ({ Token, commentId, commentData }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("replyCommentClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      if (commentData.comment.length > 1000)
        return socket.emit("replyCommentClient", {
          success: false,
          message: "ათას სიმბოლოზე მეტს ვერ დაწერთ კომენტარში",
        });
      const comment = await Comment.create(commentData);
      await Comment.findByIdAndUpdate(
        commentId,
        { $push: { reply: comment } },
        { new: true }
      );
      return socket.emit("replyCommentClient", {
        success: true,
        payload: { comment, commentId },
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("getCommentsCount", async ({ animeId }) => {
    try {
      const commentsCount = await Comment.find({ animeId }).countDocuments();
      socket.emit("getCommentsCountClient", commentsCount);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("watchLater", async ({ animeId, Token, playerOptions }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      let update = true;
      user?.watchLater?.map((iterator) => {
        if (iterator?.anime.equals(animeId)) {
          iterator.anime = animeId;
          iterator.playerDetails = playerOptions;
          update = false;
          return iterator;
        } else {
          return iterator;
        }
      });
      if (update) {
        user.watchLater.push({
          anime: animeId,
          playerDetails: playerOptions,
        });
      }
      const currentAnime = await Anime.findById(animeId);
      await user.save();
      return socket.emit("watchLaterClient", {
        success: true,
        payload: {
          anime: currentAnime,
          playerDetails: playerOptions,
        },
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("getSpecificUserData", async ({ username }) => {
    try {
      const user = await User.findOne({ username }).populate({
        path: "watchLater.anime",
        populate: { path: "seasons" },
      });
      if (!user)
        return socket.emit("getSpecificUserDataClient", { success: false });
      socket.emit("getSpecificUserDataClient", {
        success: true,
        payload: user,
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("deleteComment", async ({ Token, commentId }) => {
    try {
      const decodedToken = JWT.verify(Token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("deleteCommentClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      await Comment.findByIdAndDelete(commentId);
      socket.emit("deleteCommentClientStuff", {
        success: true,
      });
    } catch (error) {
      console.log(error);
    }
  });
});

app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//! Connections
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`Database connected`))
  .catch((error) => console.log(`Database error: ${error}`));

httpsServer.listen(httpsPort, (error) => {
  error && console.log(`Server error: ${error}`);
  console.log(`https connected`);
});

httpServer.listen(httpPort, (error) => {
  error && console.log(`Server error: ${error}`);
  console.log(`http connected`);
});
