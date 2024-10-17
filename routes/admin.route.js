const express = require("express");
const { createCourseHandler } = require("../controller/course.controller");


const router = express.Router();
router.post('/create-course',createCourseHandler)


module.exports = router;
