const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
async function generateAcessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "6h",
    }
  );
}

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

module.exports = {
  refreshTokenHandler,
  generateAcessToken,
  generateRefreshToken,
  verifyToken,
};
