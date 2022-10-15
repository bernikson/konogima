//! Setting up server
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
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

//! Express middlewares
app.set("io", io);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(expressFileUpload({ useTempFiles: true }));
app.use("/api/user", userRoutes);
app.use(ErrorHandler);

//! Socket.io
io.on("connection", async (socket) => {
  socket.on("getUserData", async (token) => {
    try {
      const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken._id);
      if (!user)
        return socket.emit("getUserDataClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });

      socket.emit("getUserDataClient", {
        success: true,
        payload: user,
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("getAnimes", async () => {
    try {
      const animes = await Anime.find().populate("seasons");
      io.emit("getAnimesClient", {
        success: true,
        payload: animes,
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
        return socket.emit("getUserDataClient", {
          success: false,
          message: "მომხმარებელი ვერ მოიძებნა",
        });
      if (user.role !== 1) {
        return socket.emit("getUserDataClient", {
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
        return socket.emit("getUserDataClient", {
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
        anime.seasons.push(season);
        await anime.save();
      }

      socket.emit("createAnimeSeason", {
        success: true,
        payload: season,
      });
    } catch (error) {
      console.log(error);
    }
  });
});

//! Connections
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`Database connected`))
  .catch((error) => console.log(`Database error: ${error}`));

server.listen(process.env.PORT || 5000, (error) => {
  error && console.log(`Server error: ${error}`);
  console.log(`Server connected`);
});
