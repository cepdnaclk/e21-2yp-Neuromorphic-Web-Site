const mongoose = require("mongoose");
const slugify = require("slugify");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  slug: String,
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  details: {
    type: String,
    required: [true, "Please add project details"],
    maxlength: [1000, "Details cannot be more than 1000 characters"],
  },
  image: {
    type: String,
    default: "img/projects/project-1.jpg",
  },
  link: {
    type: String,
    default: "project_folder/project.html",
  },
  // Detailed project information
  overview: {
    type: String,
    maxlength: [5000, "Overview cannot be more than 5000 characters"],
  },
  objectives: [
    {
      type: String,
      trim: true,
    },
  ],
  outcomes: [
    {
      type: String,
      trim: true,
    },
  ],
  technicalApproach: {
    type: String,
    maxlength: [5000, "Technical approach cannot be more than 5000 characters"],
  },
  status: {
    type: String,
    enum: ["Planning", "Active", "Completed", "On-Hold"],
    default: "Active",
  },
  duration: {
    type: String,
    trim: true,
  },
  funding: {
    type: String,
    trim: true,
  },
  technologies: [
    {
      type: String,
      trim: true,
    },
  ],
  projectContributors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Contributor",
    },
  ],
  repositories: [
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      link: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        enum: ["GitHub", "Web Page", "Documentation"],
        default: "GitHub",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create project slug from the title
ProjectSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Project", ProjectSchema);
