const Publications = require("../models/Publication");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc  Get all Publicatios
// @route GET /api/v1/publications
// @access Public

exports.getPublications = asyncHandler(async (req, res, next) => {
  const publications = await Publications.find().populate({
    path: "authors",
    select: "name",
  });
  res.status(200).json({
    success: true,
    data: publications,
  });
});
