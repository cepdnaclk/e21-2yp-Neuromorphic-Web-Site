const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// Get token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
  });
};

// @desc Register user
// @route POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  console.log(name, email, password, role);

  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponse(user, 200, res);
});

// @desc Login User
// @route Post/api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  //Valid email and password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provided an email and password", 400)
    );
  }

  //Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //check if password matched
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid password", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc Get current logged in user
// @route GET /api/v1/auth/me
// @access private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
// exports.logout = asyncHandler(async (req, res, next) => {
//   res.cookie("token", "none", {
//     expires: new Date(Date.now() + 10 * 1000), // expire in 10 seconds
//     httpOnly: true,
//   });

//   res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// });

