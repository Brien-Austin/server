const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Instructor = require("../models/instructor.model");
const { Admin } = require("../models/admin.model");


//  User jwt handlers
async function generateAcessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
}
async function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
}
const createTokensForGoogleUser = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );
  
  return { accessToken, refreshToken };
};
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      success: false,
      message: `No Token Found or Invalid Format`,
    });
  }
 

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else {
      const user = await User.findById(data.id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
      req.user = user;
      next();
    }
  });
}
async function refreshTokenHandler(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "No Refresh Token Found",
    });
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, data) => {
      try {
        const user = await User.findById(data.id);
        if (!user) {
          return res.status(403).json({
            success: false,
            message: "User not found",
          });
        }
        const newAccessToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
          withCredentials: true,
          httpOnly: false,
        });
        return res.status(200).json({
          success: true,
          message: "Acces Token Generated",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }
  );
}




// Instructor jwt handlers
async function generateInstructorAccesToken(instructor) {
  return jwt.sign(
    {
      id: instructor.id,
      email: instructor.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

async function verifyInstructorToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      success: false,
      message: `No Token Found or Invalid Format`,
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else {
      const instructor = await Instructor.findById(data.id);
      if (!instructor) {
        return res.status(400).json({
          success: false,
          message: "Instructor not found",
        });
      }
      req.instructor = instructor;
      next();
    }
  });
}

async function instructorRefreshTokenHandler(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "No Refresh Token Found",
    });
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, data) => {
      try {
        const instructor = await Instructor.findById(data.id);
        if (!instructor) {
          return res.status(403).json({
            success: false,
            message: "Instructor not found",
          });
        }
        const newAccessToken = jwt.sign(
          { id: instructor._id, email: instructor.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30d" }
        );

        res.cookie("accessToken", newAccessToken, {
          withCredentials: true,
          httpOnly: false,
        });
        return res.status(200).json({
          success: true,
          message: "Acces Token Generated",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }
  );
}

async function generateInstructorToken(instructor) {
  return jwt.sign(
    {
      id: instructor.id,
      email: instructor.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
}




// Admin jwt handlers
async function generateAdminAccessToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

async function generateAdminRefreshToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

async function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      success: false,
      message: `No Token Found or Invalid Format`,
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    const admin = await Admin.findById(data.id);
    if (!admin ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access, Admin Only",
      });
    }

    req.admin = admin;
    next();
  });
}

async function adminRefreshTokenHandler(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "No Refresh Token Found",
    });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, data) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid Refresh Token",
        });
      }

      try {
        const admin = await Admin.findById(data.id);
        if (!admin || admin.role !== "admin") {
          return res.status(403).json({
            success: false,
            message: "Unauthorized Access, Admin Only",
          });
        }

        const newAccessToken = jwt.sign(
          {
            id: admin._id,
            email: admin.email,
            role: admin.role,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
          withCredentials: true,
          httpOnly: false,
        });
        return res.status(200).json({
          success: true,
          message: "New Access Token Generated",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }
  );
}



module.exports = {
  refreshTokenHandler,
  instructorRefreshTokenHandler,
  generateInstructorToken,
  createTokensForGoogleUser,
  verifyAdminToken,
  generateAcessToken,
  generateRefreshToken,
  verifyToken,
  generateInstructorAccesToken,
  verifyInstructorToken,
  generateAdminAccessToken,
  generateAdminRefreshToken,
  verifyAdminToken,
  adminRefreshTokenHandler,
};
