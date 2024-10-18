const express = require("express");
const { userProfileHandler, fetchInstructors } = require("../controller/user.controller");
const { verifyToken } = require("../utils/jwt");
const { getCourses } = require("../controller/course.controller");


const router = express.Router();

router.get("/profile",userProfileHandler)
router.get("/courses",getCourses)
router.get("/instructors",fetchInstructors)



module.exports = router;
