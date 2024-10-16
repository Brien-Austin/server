const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    role : {
      type: String,
      enum : ['user', 'admin', 'instructor'],
      default : 'user',
      required : true
    }
    ,
    profileUrl : {
      type : String,
      default : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg",
      required : true
    },
    contactNumber: {
      type: String,
    },
    age: {
      type: String,
    },
    username: {
      type: String,
    },
  
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Courses",
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        enrolledDate: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", userSchema) || mongoose.models.Users;

module.exports = Users;
