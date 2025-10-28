const fs = require("fs");
const path = require("path");
const Projects = require("../models/Project");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc  Get all projects
// @route GET /api/v1/projects
// @access Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Projects.find().populate({
    path: "projectContributors",
    select: "name position image",
  });

  res.status(200).json({
    success: true,
    data: projects,
  });
});

// @desc   Get single project
// @route  GET /api/v1/projects/:id
// @access Public
exports.getSingleProject = asyncHandler(async (req, res, next) => {
  const project = await Projects.findById(req.params.id).populate({
    path: "projectContributors",
    select: "name position image",
  });

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc   Get project by slug
// @route  GET /api/v1/projects/slug/:slug
// @access Public
exports.getProjectsBySlug = asyncHandler(async (req, res, next) => {
  const project = await Projects.findOne({ slug: req.params.slug });

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with slug of ${req.params.slug}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc   Create new project
// @route  POST /api/v1/projects
// @access Private (Admin only)
exports.createProjects = asyncHandler(async (req, res, next) => {
  const {title,tags,details,link,overview,objectives,outcomes,technicalApproach,duration,funding,projectContributors,repositories} = req.body;
  
  // Parse repositories if it's a string
  if (repositories && typeof repositories === "string") {
    try {
      repositories = JSON.parse(repositories);
    } catch (err) {
      return next(new ErrorResponse("Invalid repositories JSON", 400));
    }
  }

  let imageUrl=null;

  if (req.file) {
    imageUrl = `https://2ypprojectfullstackwebsite-production.up.railway.app/uploads/projects/${req.file.filename}`;
  }

  const project = await Projects.create({
    title,
    tags,
    details,
    link,
    overview,
    objectives,
    outcomes,
    technicalApproach,
    duration,
    funding,
    projectContributors,
    repositories,
    image:imageUrl || `https://2ypprojectfullstackwebsite-production.up.railway.app/uploads/projects/projects.jpg`,
  });

  res.status(201).json({
    success: true,
    data: project,
  });
});


// @desc   Update project
// @route  PUT /api/v1/projects/:id
// @access Private (Admin only)
exports.updateProjects = asyncHandler(async (req, res, next) => {
  let project = await Projects.findById(req.params.id);
  console.log(req.body);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id ${req.params.id}`, 404)
    );
  }

  // Parse repositories if it's a string
  if (req.body.repositories && typeof req.body.repositories === "string") {
    try {
      req.body.repositories = JSON.parse(req.body.repositories);
    } catch (err) {
      return next(new ErrorResponse("Invalid repositories JSON", 400));
    }
  }

  // Handle image replacement
  if (req.file) {
    if (project.image && project.image.includes("/uploads/projects/")) {
      const oldImageFilename=path.basename(project.image);
      const oldImagePath = path.join(__dirname, "..", "uploads","projects",oldImageFilename);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }
    req.body.image = `https://2ypprojectfullstackwebsite-production.up.railway.app/uploads/projects/${req.file.filename}`;
  }

  project = await Projects.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc   Delete project
// @route  DELETE /api/v1/projects/:id
// @access Private (Admin only)
exports.deleteProjects = asyncHandler(async (req, res, next) => {
  const project = await Projects.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id ${req.params.id}`, 404)
    );
  }

  // Delete image if exists
  if (project.image && project.image.startsWith("/uploads")) {
    const imagePath = path.join(__dirname, "..", project.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Add contributor to project
// @route   PUT /api/v1/projects/:id/team-members
// @access  Private (Admin only)
exports.addTeamMember = asyncHandler(async (req, res, next) => {
  const project = await Projects.findById(req.params.id);
  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  const { contributorId } = req.body; // the ID of the contributor to add

  // Check if member already exists
  const existingMember = project.projectContributors.find(
    (id) => id.toString() === contributorId
  );

  if (existingMember) {
    return next(new ErrorResponse(`Contributor is already part of this project`, 400));
  }

  project.projectContributors.push(contributorId);

  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});


// @desc    Remove contributor from project
// @route   DELETE /api/v1/projects/:id/team-members/:contributorId
// @access  Private (Admin only)
exports.removeTeamMember = asyncHandler(async (req, res, next) => {
  const project = await Projects.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  project.projectContributors = project.projectContributors.filter(
    (id) => id.toString() !== req.params.contributorId
  );

  await project.save();

  res.status(200).json({
    success: true,
    data: project,
  });
});

