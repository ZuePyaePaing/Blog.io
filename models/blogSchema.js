const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const blogScheam = new Schema(
  {
    title: {
      type: String,
      minLength: [3, "Title must be at least 3 characters long"],
      maxLength: [35, "Title must be at most 16 characters long"],
      required: [true, "User is required."],
    },
    imgUrl: { type: String, required: [true, "User is required."] },
    description: {
      type: String,
      required: [true, "User is required."],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
  },
  { timestamps: true }
);

module.exports = model("Blog", blogScheam);
