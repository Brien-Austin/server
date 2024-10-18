const express = require("express");

const { adminRegisterHandler, adminSignInHandler, giveInstructorAccess } = require("../controller/admin.controller");
const { adminRefreshTokenHandler, verifyInstructorToken, verifyAdminToken } = require("../utils/jwt");


const router = express.Router();

//auth
router.post("/register", adminRegisterHandler)
router.post("/login",adminSignInHandler)
router.get("/refresh",adminRefreshTokenHandler)

//admin course access

router.put("/instructor-access",verifyAdminToken,giveInstructorAccess)



module.exports = router;
