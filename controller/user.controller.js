const Instructor = require("../models/instructor.model");
const Users = require("../models/user.model");

async function userProfileHandler(req, res, next) {
  try {
    const user = await Users.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile",
      user: {
        email: user?.email,
        role: user?.role,
        courses: user?.enrolledCourses,
        isProfileComplete: user?.isProfileComplete,
        profileUrl: user?.profileUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function fetchInstructors(req, res, next) {
    try {

        const instructors = await Instructor.find().populate({
            path : 'courses',
            select : "title chapters"
        })

        return res.status(200).json({
            success : true,
            message : "Instructors fetched successfully",
            instructors : instructors
        })

        
    } catch (error) {
        console.log('[FETCH_INSTRUCTORS]',error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
        
    }
}

module.exports = { userProfileHandler ,fetchInstructors};
