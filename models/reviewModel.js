const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    username: {
      type: String,
    },
    comment: {
      type: String,
      required: [true, "შეიყვანეთ კომენტარი"],
      minlength: [3, "კომენტარი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"],
      maxlength: [200, "კომენტარი უნდა შეიცავდეს მაქსიმუმ 1000 სიმბოლოს"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = model("Reviews", ReviewSchema);

module.exports = Review;
