const Courses = require("../models/course.model");
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
    const instructors = await Instructor.find()
      .select("email canCreateCourse profileUrl")
      .populate({
        path: "courses",
        select: "title chapters",
      });

    return res.status(200).json({
      success: true,
      message: "Instructors fetched successfully",
      instructors: instructors,
    });
  } catch (error) {
    console.log("[FETCH_INSTRUCTORS]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function followInstructor(req, res) {}

async function enrollFreeCourse(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const courseToBeEnrolled = await Courses.findById(id)
    if(!courseToBeEnrolled.isFree) {
      return res.status(404).json({
        success: false,
        message : "Free courses can be only enrolled"
      })
    }

    const userToBeEnrolled = await Users.findById(userId)
    const alreadyEnrolled = userToBeEnrolled.enrolledCourses.some(course => String(course.course) === String(id))
    if(alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message : "User already enrolled in the course"
      })

    }

    userToBeEnrolled.enrolledCourses.push({
      course : id,
      enrolledDate : new Date()
    })

    await userToBeEnrolled.save()

    


    return res.status(200).json({
      success: true,
      message: "User enrolled successfully",
      id: id,
      userToBeEnrolled

    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


module.exports = { userProfileHandler, fetchInstructors, enrollFreeCourse };
