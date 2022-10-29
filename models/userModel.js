const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "შეიყვანეთ სახელი"],
      unique: [true, "ამ სახელით უკვე დარეგისტრირებულია მომხმარებელი"],
      minlength: [3, "მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [
        24,
        "მომხმარებლის სახელი უნდა შეიცავდეს მაქსიმუმ 24 სიმბოლოს",
      ],
    },
    email: {
      type: String,
      required: [true, "შეიყვანეთ ელ-ფოსტა"],
      unique: [true, "ამ ელ-ფოსტით უკვე დარეგისტრირებულია მომხმარებელი"],
      maxlength: [40, "ელ-ფოსტა არ უნდა აღემატებოდეს 40 სიმბოლოს"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "ელ-ფოსტა სწორი ფორმატით უნდა იყოს წარმოდგენილი",
      ],
    },
    password: {
      type: String,
      required: [true, "შეიყვანეთ პაროლი"],
      minlength: [7, "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს"],
      select: false,
    },
    role: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: "https://freesvg.org/img/abstract-user-flat-4.png",
    },
    status: {
      type: [String],
      default: ["მომხმარებელი"],
    },
    watchLater: [
      {
        anime: {
          type: Schema.Types.ObjectId,
          ref: "Animes",
        },
        playerDetails: {
          season: Number,
          series: Number,
          player: Number,
          playerToUse: String,
        },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = await bcrypt.genSalt(3);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createToken = function (tokenType) {
  let expireTime = tokenType === "access" ? "35s" : "7d";
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: expireTime,
  });
};

UserSchema.methods.createCookie = function (res, Token) {
  return res.cookie("Token", Token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 1000 * 60 * 24 * 365,
  });
};

UserSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("Users", UserSchema);

module.exports = User;
