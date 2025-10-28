const Blog = require("../models/Blog");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const fs = require("fs");
const path = require("path");

// @desc  Get all blogs
// @route GET /api/v1/blogs
// @access Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find().sort("-createdAt");

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs,
  });
});

// @desc   Get single blog
// @route  GET /api/v1/blogs/:id
// @access Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment views
  blog.views += 1;
  await blog.save();

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// @desc   Create new blog
// @route  POST /api/v1/blogs
// @access Private (Admin only)
exports.createBlog = asyncHandler(async (req, res, next) => {
  let data = req.body;

  if (req.file) {
    data.image = `/uploads/blogs/${req.file.filename}`;
  }

  const blog = await Blog.create(data);

  res.status(201).json({
    success: true,
    data: blog,
  });
});

// @desc   Update blog
// @route  PUT /api/v1/blogs/:id
// @access Private (Admin only)
exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id ${req.params.id}`, 404)
    );
  }

  // Handle image replacement
  if (req.file) {
    if (blog.image && blog.image.startsWith("/uploads")) {
      const oldImagePath = path.join(__dirname, "..", blog.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }
    req.body.image = `/uploads/blogs/${req.file.filename}`;
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: blog, 
  });
});

// @desc   Delete blog
// @route  DELETE /api/v1/blogs/:id
// @access Private (Admin only)
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id ${req.params.id}`, 404)
    )
  }

  // Delete image if exists
  if (blog.image && blog.image.startsWith("/uploads")) {
    const imagePath = path.join(__dirname, "..", blog.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});
