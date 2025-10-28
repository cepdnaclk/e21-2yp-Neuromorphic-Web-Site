const User = require('../models/User');
const Contributor = require('../models/Contributor');
const News = require('../models/News');
const Publication = require('../models/Publication');
const Project = require('../models/Project');
const Blog=require('../models/Blog');
const SystemSettings = require('../models/SystemSettings');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc  Get admin dashboard stats
// @route GET /api/v1/admin/dashboard
// @access Private (admin only)
exports.getDashboardStats=asyncHandler(async(req,res,next)=>{

    // Get counts
    const totalUsers=await User.countDocuments();
    const totalContributors=await Contributor.countDocuments();
    const totalNews=await News.countDocuments();
    const totalPublications=await Publication.countDocuments();
    const totalProjects=await Project.countDocuments();
    const totalBlogs=await Blog.countDocuments();

    // Get recent activities
    const recentNews = await News.find().sort('-date').limit(5);
    const recentPublications = await Publication.find().sort('-year').limit(5);
    const recentProjects = await Project.find().sort('-createdAt').limit(5);
    const recentBlogs = await Blog.find().sort('-date').limit(5);


    const dashboardData = {
        stats: {
            totalUsers,
            totalContributors,
            totalNews,
            totalPublications,
            totalProjects,
            totalBlogs
        },
        recentActivities: {
            news: recentNews,
            publications: recentPublications,
            projects: recentProjects,
            blogs: recentBlogs
            
        }
    };

    res.status(200).json({
        success: true,
        data: dashboardData
    });

})


// @desc    Get all users (Admin view)
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().sort('-createAt');

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc    Update Users
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, role } = req.body;

  // Validate role
  if (!['Student', 'Lecture', 'Admin','Publisher'].includes(role)) {
    return next(
      new ErrorResponse('Invalid role. Must be Student, Lecture, or Admin', 400)
    );
  }

  // Find user by ID
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Update user fields
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
        return next(
            new ErrorResponse(`Admin cannot delete their own account`, 400)
        );
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get system settings
// @route   GET /api/v1/admin/settings
// @access  Private (Admin only)
exports.getSystemSettings = asyncHandler(async (req, res, next) => {
    // In a real application, you would store these in a database
    const settings =await SystemSettings.findOne();

    res.status(200).json({
        success: true,
        data: settings
    });
});


// @desc    Update system settings
// @route   PUT /api/v1/admin/settings
// @access  Private (Admin only)
exports.updateSystemSettings = asyncHandler(async (req, res, next) => {
    // In a real application, you would update these in a database
    let settings = await SystemSettings.findOne();

    // If no settings exit,create new
    if(!settings){
        settings=await SystemSettings.create(req.body);
    }else{
        settings=await SystemSettings.findOneAndUpdate({},req.body,{
            new:true,
            runValidators:true,
        });
    }

    res.status(200).json({
        success: true,
        data: settings,
        message: 'Settings updated successfully'
    });
});

