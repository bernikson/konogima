const { Schema, model } = require("mongoose");

const SeasonSchema = new Schema(
  {
    index: Number,
    series: [
      {
        playerOne: String,
        playerTwo: String,
        playerThree: String,
        OVA: Boolean,
      },
    ],
    animeId: {
      type: Schema.Types.ObjectId,
      ref: "Animes",
    },
  },
  { timestamps: true }
);

const Season = model("Seasons", SeasonSchema);

module.exports = Season;
