const express = require("express");
const {registerHandler,signInHandler} = require("../controller/auth.controller");
const { refreshTokenHandler } = require("../utils/jwt");

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", signInHandler);
router.post("/refresh-token",refreshTokenHandler)

module.exports = router;
