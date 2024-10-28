const express = require("express");

const { instructorRegisterHandler, InstructorSignInHandler, createChapter, createMultipleChapters, createMultiChapter, instructorProfile, publishCourse, createQuestionAnswers } = require("../controller/instructor.controller");
const {  instructorRefreshTokenHandler } = require("../utils/jwt");
const { createCourseHandler } = require("../controller/course.controller");
const router = express.Router();


// authentication
router.post("/register", instructorRegisterHandler);
router.post("/login", InstructorSignInHandler);
router.post("/refresh-token",instructorRefreshTokenHandler)
router.get("/profile",instructorProfile)

//course data
router.post('/create-course',createCourseHandler)
router.post('/create-chapter/:instructorId/:courseId',createChapter)
router.post('/create-chapters/:instructorId/:courseId',createMultipleChapters)
router.post('/publish-course/:instructorId/:courseId',publishCourse)
router.post('/create/qa/:courseId/:chapterId',createQuestionAnswers)

module.exports = router;