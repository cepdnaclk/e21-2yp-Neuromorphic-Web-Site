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

// @desc   Get single publication
// @route  GET /api/v1/publications/:id
// @access Public
exports.getPublication = asyncHandler(async (req, res, next) => {
  const Publication = await Publications.findById(req.params.id).populate({
    path: "authors",
    select: "name",
  });

  if (!Publication) {
    return next(
      new ErrorResponse(
        `Publication not found with id of ${req.params.id}`,
        404
      )
    );
  }