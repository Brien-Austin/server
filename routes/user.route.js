const express = require("express");
const { userProfileHandler } = require("../controller/user.controller");
const { verifyToken } = require("../utils/jwt");


const router = express.Router();

router.get("/profile",userProfileHandler)



module.exports = router;
