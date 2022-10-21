const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    username: String,
    animeId: {
      type: Schema.Types.ObjectId,
      ref: "Animes",
    },
    avatar: String,
    comment: {
      type: String,
      maxlength: [1000, "ათას სიმბოლოზე მეტს ვერ დაწერთ კომენტარში"],
    },
    likeRatio: {
      like: [
        {
          type: Schema.Types.ObjectId,
          ref: "Users",
          default: [],
        },
      ],
      dislike: [
        {
          type: Schema.Types.ObjectId,
          ref: "Users",
          default: [],
        },
      ],
      counter: {
        type: Number,
        default: 0,
      },
    },

    reply: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    isChild: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Comment = model("Comments", CommentSchema);

module.exports = Comment;
