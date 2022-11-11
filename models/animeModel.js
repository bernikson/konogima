const { Schema, model } = require("mongoose");

const AnimeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "შეიყვანეთ ანიმეს სახელი"],
      minlength: [3, "ანიმეს სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [200, "ანიმეს სახელი უნდა შეიცავდეს მაქსიმუმ 200 სიმბოლოს"],
    },
    year: {
      type: String,
    },
    voiceover: {
      type: String,
      required: [true, "შეიყვანეთ გამხმოვანებლის სახელი"],
      minlength: [3, "გამხმოვანებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [
        54,
        "გამხმოვანებლის სახელი უნდა შეიცავდეს მაქსიმუმ 50 სიმბოლოს",
      ],
    },
    translator: {
      type: String,
      required: [true, "შეიყვანეთ მთარგმნელის სახელი"],
      minlength: [3, "მთარგმნელის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [54, "მთარგმნელის სახელი უნდა შეიცავდეს მაქსიმუმ 54 სიმბოლოს"],
    },
    totaltime: Number,
    genres: {
      type: [String],
      validate: [(value) => value.length > 0, "შეიყვანეთ ჟანრები"],
    },
    director: {
      type: String,
      required: [true, "შეიყვანეთ რეჟისორის სახელი"],
      minlength: [3, "რეჟისორის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [54, "რეჟისორის სახელი უნდა შეიცავდეს მაქსიმუმ 54 სიმბოლოს"],
    },
    studio: {
      type: String,
      required: [true, "შეიყვანეთ სტუდიის სახელი"],
      minlength: [3, "სტუდიის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [54, "სტუდიის სახელი უნდა შეიცავდეს მაქსიმუმ 54 სიმბოლოს"],
    },
    age: {
      type: Number,
      min: [0, "ასაკი მინიმუმ 0 უნდა იყოს"],
      max: [100, "ასაკი მაქსიმუმ 100 უნდა იყოს"],
    },
    description: {
      type: String,
      required: [true, "შეიყვანეთ აღწერა"],
      minlength: [3, "აღწერა უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [8000, "აღწერა უნდა შეიცავდეს მაქსიმუმ 3000 სიმბოლოს"],
    },
    background: {
      type: String,
      required: [true, "მიუთითეთ ანიმეს სურათი"],
    },
    uploadDate: {
      type: String,
      required: [true, "მიუთითეთ განრიგი"],
    },
    status: {
      type: String,
      required: [true, "მიუთითეთ სტატუსი"],
    },
    series: Number,
    seasons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Seasons",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Anime = model("Animes", AnimeSchema);

module.exports = Anime;
