const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    passwordResetRequired : {
      type : Boolean,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
      required: true,
    },
    profileUrl: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg",
      required: true,
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
        completedChapters: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapters",
          },
        ],
      },
    ],

    isAccountDeactivated: {
      type: Boolean,
      default: false,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Users = mongoose.model("Users", userSchema) || mongoose.models.Users;

module.exports = Users;
