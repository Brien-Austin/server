
const { Admin } = require("../models/admin.model");
const Instructor = require("../models/instructor.model");
const { compareValue, hashValue } = require("../utils/bcrypt");
const { generateAcessToken, generateRefreshToken, generateAdminAccessToken, generateAdminRefreshToken } = require("../utils/jwt");


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


async function giveInstructorAccess(req,res) {
    const {instructorId} = req.body;
    try {
        const grantedAccessInstructor = await Instructor.findByIdAndUpdate(instructorId, {
            canCreateCourse: true,
            verifiedBy : req.admin._id
        },{
          new : true
        });

        const instructorName = grantedAccessInstructor.email

        await grantedAccessInstructor.save();

        return res.status(200).json({
            success: true,
            message : `${instructorName} Instructor can create and publish course !!! `
        })
    
        
    } catch (error) {
        
    }

}

module.exports = { adminRegisterHandler, adminSignInHandler,giveInstructorAccess };
