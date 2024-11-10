

const { redisClient, connectRedisCache } = require("../config/redis-cache");
const { Chapters } = require("../models/chapter.model");
const { Courses } = require("../models/course.model");

const Instructor = require("../models/instructor.model");
const Users = require("../models/user.model");

// async function 
// userProfileHandler(req, res, next) {
//   try {
//     await connectRedisCache()
//     const cacheKey = `user:profile:${req.user.email}`
//     const cachedUser = await redisClient.get(cacheKey)
//     if (cachedUser) {
//       return res.status(200).json({
//         success: true,
//         message: "User profile",
//         user: JSON.parse(cachedUser)
//       });
//     }
//     const user = await Users.findOne({ email: req.user.email })
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//         email : req.user.email
//       });
//     }
    
//     const userData = {
//       username: user?.username,
//       email: user?.email,
//       age: user?.age,
//       contactNumber: user?.contactNumber,
//       profileUrl: user?.profileUrl,
//       isProfileComplete: user?.isProfileComplete,
//       courses: user?.enrolledCourses,
    
//     };
//     await redisClient.setEx(cacheKey, 3600, JSON.stringify(userData));

//     return res.status(200).json({
//       success: true,
//       message: "User profile",
//       user: userData
//     });
//   } catch (error) {
//     console.log('[USER_PROFILE_ERROR]', error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// }






async function 
userProfileHandler(req, res, next) {
  try {
    const user = await Users.findOne({ email: req.user.email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        email : req.user.email
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile",
      user: {
        username: user?.username,
        email: user?.email,
        age: user?.age,
        contactNumber: user?.contactNumber,
        profileUrl: user?.profileUrl,
        isProfileComplete: user?.isProfileComplete,

        courses: user?.enrolledCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function fetchInstructors(req, res, next) {
  try {
    const instructors = await Instructor.find()
      .select("email canCreateCourse profileUrl")
      .populate({
        path: "courses",
        select: "title chapters",
      });

    return res.status(200).json({
      success: true,
      message: "Instructors fetched successfully",
      instructors: instructors,
    });
  } catch (error) {
    console.log("[FETCH_INSTRUCTORS]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function fetchEnrolledCourse(req,res){
  try {
    const {courseId} = req.params
    const user = await Users.findOne({email : req.user.email , enrolledCourses : {
      $elemMatch : {
        course : courseId 
      }
    } }).populate({
      path : "enrolledCourses.course",
      populate :[
        {  
          path : "instructor", 
          select : "email profileUrl"
        }, 
        {  
          path : "chapters"
        },
     
      ]
    })
    

    if(!user){
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const specificCourse = user.enrolledCourses.find((e)=>e.course._id.toString() === courseId)
    console.log(specificCourse)

    return res.status(200).json({
      success: true,
      specificCourse
      
    })
    

    
  } catch (error) {
    console.log('[FETCH_ENROLLED_COURSE_BY_ID]',error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
    
  }
}

async function followInstructor(req, res) {}

async function enrollFreeCourse(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const courseToBeEnrolled = await Courses.findById(id);
    if (!courseToBeEnrolled.isFree) {
      return res.status(404).json({
        success: false,
        message: "Free courses can be only enrolled",
      });
    }

    const userToBeEnrolled = await Users.findById(userId);
    const alreadyEnrolled = userToBeEnrolled.enrolledCourses.some(
      (course) => String(course.course) === String(id),
    );
    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "User already enrolled in the course",
      });
    }

    userToBeEnrolled.enrolledCourses.push({
      course: id,
      enrolledDate: new Date(),
    });

    await userToBeEnrolled.save();

    return res.status(200).json({
      success: true,
      message: "User enrolled successfully",
      id: id,
      userToBeEnrolled,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function completeChapter(req, res) {
  try {
    const { chapterId, courseId } = req.params;
    const userId = req.user.id;

    // Find user
    const user = await Users.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the specific enrolled course
    const enrolledCourse = user.enrolledCourses.find(
      enrollment => String(enrollment.course) === String(courseId)
    );

    if (!enrolledCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found in user's enrolled courses",
      });
    }

    // Check if chapter is already completed
    const isAlreadyCompleted = enrolledCourse.completedChapters.some(
      chapter => String(chapter) === String(chapterId)
    );

    if (isAlreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: "Chapter already completed!",
      });
    }

    // Update the user document with the completed chapter
    const updatedUser = await Users.findOneAndUpdate(
      { 
        _id: userId,
        "enrolledCourses.course": courseId 
      },
      { 
        $addToSet: { 
          "enrolledCourses.$.completedChapters": chapterId 
        } 
      },
      { 
        new: true 
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Failed to update completion status",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chapter completed successfully",
    });

  } catch (error) {
    console.log('[CHAPTER_COMPLETION_ERROR]', error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}



//my-courses
async function getMyCourses(req, res) {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId).populate({
      path: "enrolledCourses.course",
      populate: {
        path: "chapters",
        model: "Chapters",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: user.enrolledCourses,
    });
  } catch (error) {
    console.log("[GET_MY_COURSES_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error : error?.message
    });
  }
}

//profile completion
async function completeProfile(req, res) {
  try {
    const { age, username, contactNumber } = req.body;
    const userId = req.user._id;
    const user = await Users.findByIdAndUpdate(userId, {
      age,
      username,
      contactNumber,
    });

    if (user) {
      user.isProfileComplete = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile Completed",
    });
  } catch (error) {
    console.log("[PROFILE_COMPLETION_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

//profile edit
async function profileEdit(req, res) {
  try {
    const { age, username, contactNumber } = req.body;
    const userId = req.user._id;
    const user = await Users.findByIdAndUpdate(userId, {
      age,
      username,
      contactNumber,
    });

    if (user) {
      user.isProfileComplete = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile Completed",
    });
  } catch (error) {
    console.log("[PROFILE_COMPLETION_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// reset password
async function resetPassword(req, res) {
  try {
    
  } catch (error) {
    console.log("[PASSWORD_RESET_ERROR]", error);
    
  }
}

// find chapter by id

async function findChapterById(req,res) {
 try {
  const {chapterId} = req.params;
  const chapter = await Chapters.findById(chapterId);
  return res.status(200).json({
    success: true,
    message: "Chapter fetched successfully",
    chapter
  })

  
 } catch (error) {
  console.log("[CHAPTER_FETCH_ERROR]",error)
  return res.staus(400).json({
    success : false,
    message : "Internal Server Error"
  })
  
 }

}

module.exports = {
  completeProfile,
findChapterById,
  userProfileHandler,
  getMyCourses,
  fetchInstructors,
  enrollFreeCourse,
  fetchEnrolledCourse,
  completeChapter
};
