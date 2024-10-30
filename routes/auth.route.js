const express = require("express");
const {
  registerHandler,
  signInHandler,
  googleAuthCallback,
} = require("../controller/auth.controller");
const { refreshTokenHandler } = require("../utils/jwt");
const passport = require("passport");
const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", signInHandler);
router.post("/refresh-token", refreshTokenHandler);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthCallback,
);

module.exports = router;
