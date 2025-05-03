const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    publishedYear: {
      type: Number,
      required: true,
    },

    genre: {
      type: String,
      enum: [
        "Fiction",
        "Non-fiction",
        "Science",
        "History",
        "Biography",
        "Other",
      ],
      default: "Other",
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

exports.Book = mongoose.model("Book", bookSchema);
