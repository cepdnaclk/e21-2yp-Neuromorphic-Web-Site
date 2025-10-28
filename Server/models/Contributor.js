const mongoose = require("mongoose");

const ContributorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  position: {
    type: String,
    required: [true, "Please add a position"],
    trim: true,
    maxlength: [100, "Position cannot be more than 100 characters"],
  },
  phone: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: "no-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contributor", ContributorSchema);
