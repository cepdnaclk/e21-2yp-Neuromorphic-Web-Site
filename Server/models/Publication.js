const mongoose = require("mongoose");
const slugify = require("slugify");

const PublicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },

  authors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Contributor",
      required: true,
    },
  ],
  journal: {
    type: String,
    required: [true, "Please add publication venue"],
    trim: true,
    maxlength: [200, "Venue cannot be more than 200 characters"],
  },
  year: {
    type: Number,
    required: [true, "Please add publication year"],
    min: [1900, "Year must be at least 1900"],
    max: [
      new Date().getFullYear() + 5,
      "Year cannot be more than 5 years in the future",
    ],
  },