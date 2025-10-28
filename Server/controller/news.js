const News = require("../models/News");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const fs = require("fs");
const path = require("path");

// @desc  Get all News
// @route GET /api/v1/news
// @access Public
exports.getNews = asyncHandler(async (req, res, next) => {
  const news = await News.find().sort("-createdAt");
  res.status(200).json({
    success: true,
    count: news.length,
    data: news,
  });
});

// @desc   Get single News
// @route  GET /api/v1/news/:id
// @access Public
exports.getSingleNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(
      new ErrorResponse(`News not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment views
  news.views += 1;
  await news.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: news,
  });
});

// @desc  Get News by slug
// @route GET /api/v1/news/slug/:slug
// @access Public
exports.getNewsBySlug = asyncHandler(async (req, res, next) => {
  const news = await News.findOne({ slug: req.params.slug });

  if (!news) {
    return next(
      new ErrorResponse(`News not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Increment views
  news.views += 1;
  await news.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: news,
  });
});
// @desc   Create new News
// @route  POST /api/v1/news
// @access Private(Admin only)
exports.createNews = asyncHandler(async (req, res, next) => {
  const {title,brief,fullContent,author,date,link} =req.body;

  let imageUrl=null;

  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/uploads/news/${req.file.filename}`;
  }

  const news = await News.create({
    title,
    brief,
    fullContent,
    author,
    date,
    link,
    image:imageUrl || `${req.protocol}://${req.get("host")}/uploads/news/news.jpg`,
  });

  res.status(201).json({
    success: true,
    data: news,
  });
});

// @desc   Update News
// @route  PUT /api/v1/news/:id
// @access Private (Admin only)
exports.updateNews = asyncHandler(async (req, res, next) => {
  let news = await News.findById(req.params.id);

  if (!news) {
    return next(new ErrorResponse(`News not found with id ${req.params.id}`, 404));
  }

  if (req.file) {
    // Remove old image if it exists and is stored locally
    if (news.image && news.image.includes("/uploads/news/")) {
      const oldImageFilename = path.basename(news.image); 
      const oldImagePath = path.join(__dirname, "..", "uploads", "news", oldImageFilename);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Set new image URL
    req.body.image = `${req.protocol}://${req.get("host")}/uploads/news/${req.file.filename}`;
  }

  news = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: news,
  });
});
