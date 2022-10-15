const { Schema, model } = require("mongoose");

const AnimeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "შეიყვანეთ ანიმეს სახელი"],
      minlength: [3, "ანიმეს სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [24, "ანიმეს სახელი უნდა შეიცავდეს მაქსიმუმ 80 სიმბოლოს"],
    },
    year: {
      type: Number,
    },
    voiceover: {
      type: String,
      required: [true, "შეიყვანეთ გამხმოვანებლის სახელი"],
      minlength: [3, "გამხმოვანებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [
        24,
        "გამხმოვანებლის სახელი უნდა შეიცავდეს მაქსიმუმ 20 სიმბოლოს",
      ],
    },
    translator: {
      type: String,
      required: [true, "შეიყვანეთ მთარგმელის სახელი"],
      minlength: [3, "მთარგმელის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [24, "მთარგმელის სახელი უნდა შეიცავდეს მაქსიმუმ 20 სიმბოლოს"],
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
      maxlength: [24, "რეჟისორის სახელი უნდა შეიცავდეს მაქსიმუმ 20 სიმბოლოს"],
    },
    studio: {
      type: String,
      required: [true, "შეიყვანეთ სტუდიის სახელი"],
      minlength: [3, "სტუდიის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [24, "სტუდიის სახელი უნდა შეიცავდეს მაქსიმუმ 20 სიმბოლოს"],
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
      maxlength: [24, "აღწერა უნდა შეიცავდეს მაქსიმუმ 3000 სიმბოლოს"],
    },
    background: {
      type: String,
      required: [true, "მიუთითეთ ანიმეს სურათი"],
    },
    seasons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Seasons",
      },
    ],
  },
  { timestamps: true }
);

const Anime = model("Animes", AnimeSchema);

module.exports = Anime;
