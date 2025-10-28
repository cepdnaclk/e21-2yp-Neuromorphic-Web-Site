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

