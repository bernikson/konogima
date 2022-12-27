const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "შეიყვანეთ პროდუქტის სახელი"],
      minlength: [3, "პროდუქტის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [200, "პროდუქტის სახელი უნდა შეიცავდეს მაქსიმუმ 200 სიმბოლოს"],
    },
    type: {
      type: String,
      required: [true, "შეიყვანეთ ტიპი"],
      minlength: [3, "ტიპის სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"],
      maxlength: [200, "ტიპის სახელი უნდა შეიცავდეს მაქსიმუმ 30 სიმბოლოს"],
    },
    price: {
      type: Number,
      required: [true, "შეიყვანეთ ფასი"],
      min: [3, "ცოტა აუწიეთ ფასს"],
      max: [1000, "მეტაფეტამინს ხომ არ ყიდით?"],
    },
    quantity: {
      type: Number,
      required: [true, "შეიყვანეთ რაოდენობა"],
    },
    salePrice: {
      type: Number,
      max: [90, "წაგებაში წახვალ მეგობარო"],
    },
    saleExpirery: {
      type: Number,
    },
    description: {
      type: String,
      required: [true, "შეიყვანეთ პროდუქტის აღწერა"],
      minlength: [3, "პროდუქტის აღწერა უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს"],
      maxlength: [
        200,
        "პროდუქტის აღწერა უნდა შეიცავდეს მაქსიმუმ 10000 სიმბოლოს",
      ],
    },
    background: {
      type: String,
      required: [true, "შეიყვანეთ პროდუქტის სურათი"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    reviews: { type: [Number], default: [5] },
  },
  { timestamps: true }
);

const Product = model("Products", ProductSchema);

module.exports = Product;
