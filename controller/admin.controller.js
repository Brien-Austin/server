const { Admin } = require("../models/admin.model");
const Courses = require("../models/course.model");
const Instructor = require("../models/instructor.model");
const Users = require("../models/user.model");
const { compareValue, hashValue } = require("../utils/bcrypt");
const {
  generateAcessToken,
  generateRefreshToken,
  generateAdminAccessToken,
  generateAdminRefreshToken,
} = require("../utils/jwt");

//auth
async function adminRegisterHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin Already Registered",
      });
    }

    const hashedPassword = await hashValue(password);
    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();
    return res.status(200).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.log("[ERROR_CREATING_ADMIN(CONTROLLER)]", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function adminSignInHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const validPassword = await compareValue(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const accessToken = await generateAdminAccessToken(admin);
    const refreshToken = await generateAdminRefreshToken(admin);

    return res.status(200).json({
      success: true,
      message: "Admin Logged In Successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log("[ADMIN_LOGIN_ERROR]:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// give instructor course creation access
async function giveInstructorAccess(req, res) {
  const { instructorId } = req.body;
  try {
    const grantedAccessInstructor = await Instructor.findByIdAndUpdate(
      instructorId,
      {
        canCreateCourse: true,
        verifiedBy: req.admin._id,
      },
      {
        new: true,
      },
    );

    const instructorName = grantedAccessInstructor.email;

    await grantedAccessInstructor.save();

    return res.status(200).json({
      success: true,
      message: `${instructorName} Instructor can create and publish course !!! `,
    });
  } catch (error) {}
}

// get user data
async function getUsersData(req, res) {
  try {
    const users = await Users.find()
      .select("email profileUrl contactNumber age username enrolledCourses ")
      .populate({
        path: "enrolledCourses.course",
      })
      .populate({
        path: "enrolledCourses.course.chapters",
      });

    return res.status(200).json({
      success: true,
      message: "Users data fetched successfully !!!",
      users,
    });
  } catch (error) {
    console.log("[USERS_DATA_FETCH_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

//delete user
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    const deactivateInstructor = await Users.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: " User deleted Successfully",
    });
  } catch (error) {
    console.log("[DELETION_OF_USER_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

//deactivate user
async function deactivateUser(req, res) {
  try {
    const { userId } = req.params;
    const deactivate = await Users.findByIdAndUpdate(userId, {
      isAccountDeactivated: true,
    });

    return res.status(200).json({
      success: true,
      message: " User deactivated Successfully",
    });
  } catch (error) {
    console.log("[DELETION_OF_USER_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function getInstructorData(req, res) {
  try {
    const instructors = await Instructor.find().select(
      "email profileUrl contactNumber age username canCreateCourse ",
    );

    return res.status(200).json({
      success: true,
      message: "Instructor data fetched successfully !!!",
      instructors,
    });
  } catch (error) {
    console.log("[INSTRUCTOR_DATA_FETCH_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function deleteInstructor(req, res) {
  try {
    const { instructorId } = req.params;
    const deleteInstructor = await Users.findByIdAndDelete(instructorId);

    return res.status(200).json({
      success: true,
      message: " User deleted Successfully",
    });
  } catch (error) {
    console.log("[DELETION_OF_USER_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
//deactivate instructor
async function deactivateInstructor(req, res) {
  try {
    const { userId } = req.params;
    const deactivateInstructor = await Users.findByIdAndUpdate(userId, {
      isAccountDeactivated: true,
    });

    return res.status(200).json({
      success: true,
      message: " User deactivated Successfully",
    });
  } catch (error) {
    console.log("[DEACTIVATION_OF_INSTRUCTOR_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// get All courses
async function getCourses(req, res) {
  try {
    const courses = await Courses.find()
      .populate({
        path: "instructor",
        select: "email",
      })
      .populate("chapters");

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.log("[GET_COURSES_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  adminRegisterHandler,
  adminSignInHandler,
  giveInstructorAccess,
  getUsersData,
  deleteUser,
  deactivateUser,
  deactivateInstructor,
  getInstructorData,
  getCourses,
  deleteInstructor,
};
