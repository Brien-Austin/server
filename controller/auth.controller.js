const User = require("../models/user.model");
const { createAccount, loginUser } = require("../services/auth.service");
const { compareValue, hashValue } = require("../utils/bcrypt");
const {
  generateAcessToken,
  generateRefreshToken,
  createTokensForGoogleUser,
} = require("../utils/jwt");
const dotenv = require("dotenv")
dotenv.config()

async function registerHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password is required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Registered",
      });
    }

    const hashedPassword = await hashValue(password);
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("[ERROR_CREATING_USER(CONTROLLER)]", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function signInHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesnt exist",
      });
    }

    const validPassword = await compareValue(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const accessToken = await generateAcessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log("[LOGIN_CONTROLLER_ERROR]:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

const googleAuthCallback = async (req, res) => {
  try {
    const { accessToken, refreshToken } = createTokensForGoogleUser(req.user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true for production
      sameSite: "None",
      maxAge: 20 * 24 * 60 * 60 * 1000, // 20 days
      path: '/',
      domain : process.env.FRONTEND_URL
    });
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      domain : process.env.FRONTEND_URL
    });
    

    res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    console.log("[GOOGLE_OAUTH_ERROR]", error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

module.exports = { registerHandler, signInHandler, googleAuthCallback };
