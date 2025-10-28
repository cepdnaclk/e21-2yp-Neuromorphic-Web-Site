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
