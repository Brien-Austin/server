const { Chapters, Questions } = require("../models/chapter.model");
const Courses = require("../models/course.model");
const Instructor = require("../models/instructor.model");
const { loginUser } = require("../services/auth.service");
const { compareValue, hashValue } = require("../utils/bcrypt");
const { generateAcessToken, generateRefreshToken } = require("../utils/jwt");
const mongoose = require("mongoose");

// Authentication
async function instructorRegisterHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password is required",
    });
  }

  try {
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(400).json({
        success: false,
        message: "Instructor Already Registered",
      });
    }

    const hashedPassword = await hashValue(password);
    const instructor = new Instructor({
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.status(200).json({
      message: "Instructor registered successfully",
    });
  } catch (error) {
    console.log("[ERROR_CREATING_INSTRUCTOR(CONTROLLER)]", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
async function InstructorSignInHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required",
    });
  }

  try {
    const user = await Instructor.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
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
      message: "Instructor Logged In Successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
      instructor: {
        id: user.id,
      },
    });
  } catch (error) {
    console.log("[LOGIN_CONTROLLER_ERROR]:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
// Chapter creation
async function createChapter(req, res) {
  const courseId = req.params.courseId;
  const instructorId = req.params.instructorId;
  const { title, imageurl, description, videourl } = req.body;
  if (!title || !description || !videourl || !imageurl) {
    return res.status(400).json({
      success: false,
      message: "Title or description or videourl or imageurl is required",
    });
  }

  if (courseId === undefined || instructorId === undefined) {
    return res.status(400).json({
      success: false,
      message: "CourseId or InstructorId is required",
    });
  }

  try {
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course does not exist",
      });
    }
    const newChapter = new Chapters({
      title,
      description,
      imageurl,
      videourl,
      courseId: courseId,
    });

    await newChapter.save();
    course.chapters.push(newChapter._id);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Chapter Creatded",
      chapter: {
        courseId: courseId,
        instructorId: instructorId,
        chapterId: newChapter._id,
      },
    });
  } catch (error) {
    console.log("[CHAPTER_CREATION_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
// multiChapter creation
async function createMultipleChapters(req, res) {
  const { courseId, instructorId } = req.params;
  const { chapters } = req.body;

  if (!Array.isArray(chapters) || chapters.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid chapters data. Expected a non-empty array of chapters.",
    });
  }

  if (courseId === undefined || instructorId === undefined) {
    return res.status(400).json({
      success: false,
      message: "CourseId and InstructorId are required",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Courses.findById(courseId).session(session);
    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Course does not exist",
      });
    }

    const createdChapters = [];

    for (const chapterData of chapters) {
      const { title, description, imageurl, videourl, index } = chapterData;

      if (!title || !description || !videourl) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message:
            "Title, description, and videourl are required for each chapter",
        });
      }

      const newChapter = new Chapters({
        title,
        index,  
        description,
        imageurl,
        videourl,
        courseId: courseId,
      });

      await newChapter.save({ session });
      course.chapters.push(newChapter._id);
    }

    await course.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Chapters Created Successfully",
      courseId: courseId,
      instructorId: instructorId,
      createdChapters: createdChapters,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("[MULTI_CHAPTER_CREATION_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
// create q and a
async function createQuestionAnswers(req, res) {
  try {
    const { question, options } = req.body;
    const { chapterId, courseId } = req.params;
    const userId = req.instructor.id;
    if (!chapterId || !courseId) {
      return res.status(404).json({
        success: false,
        message: "CoureseId and ChapterId are required",
      });
    }

    const chapter = await Chapters.findById(chapterId);
    const qa = new Questions({
      question,
      options,
    });

    chapter.qa.push(qa._id);
    await qa.save();
    await chapter.save();

    return res.status(200).json({
      success: true,
      message: "QA Created",
      data: {
        chapterId,
        userId,
        courseId,
      },
    });
  } catch (error) {
    console.log("[QA_CERATION_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
// instructor profile
async function instructorProfile(req, res) {
  try {
    const instructor = await Instructor.findOne({
      email: req.instructor.email,
    });
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Instructor profile",
      instructor: {
        email: instructor?.email,
        role: instructor?.role,
        courses: instructor?.enrolledCourses,
        isProfileComplete: instructor?.isProfileComplete,
        profileUrl: instructor?.profileUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
// publish course
async function publishCourse(req, res) {
  try {
    const { courseId, instructorId } = req.params;
    const currentCourse = await Courses.findById(courseId);
    const currentStatus = currentCourse.isPublished;
    const course = await Courses.findByIdAndUpdate(courseId, {
      isPublished: !currentStatus,
    });
    await course.save();
    const message = currentStatus ? "Course published" : "Course unpublished !";

    return res.status(200).json({
      success: true,
      message: message,
    });
  } catch (error) {
    console.log("[PUBLISH_COURSE]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

//
module.exports = {
  instructorRegisterHandler,
  InstructorSignInHandler,
  createChapter,
  createMultipleChapters,
  instructorProfile,
  publishCourse,
  createQuestionAnswers,
};
