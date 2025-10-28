const mongoose = require("mongoose");
const slugify = require("slugify");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  slug: { type: String, unique: true },
  author: {
    type: String,
    required: [true, "Please add an author name"],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: String,
    required: [true, "Please add read time"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  image: {
    type: String,
    default: "img/blog.png",
  },
  link: {
    type: String,
    default: "#",
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create blog slug from the title
BlogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);
