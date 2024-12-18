const express = require("express");
const {
  userProfileHandler,
  fetchInstructors,
  enrollFreeCourse,
  getMyCourses,
  completeProfile,
  fetchEnrolledCourse,
  completeChapter,
  findChapterById,
} = require("../controller/user.controller");
const { verifyToken } = require("../utils/jwt");
const {
  getCourses,
  getCourseById,
} = require("../controller/course.controller");

const router = express.Router();

router.get("/profile", userProfileHandler);
router.get("/courses", getCourses);
router.get("/course/:courseId", getCourseById);
router.get("/instructors", fetchInstructors);
router.post("/enroll/:id", enrollFreeCourse);
router.get("/my-courses", getMyCourses);
router.patch("/complete-profile", completeProfile);
router.get("/my-course/:courseId",fetchEnrolledCourse)

// chapter complete 
router.post("/complete-chapter/:courseId/:chapterId", completeChapter)

//find chap by id
router.get("/chapter/:chapterId",findChapterById)

module.exports = router;
