const mongoose = require("mongoose");
const instructorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileUrl: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=626&ext=jpg",
    required: true,
  },

  canCreateCourse: {
    type: Boolean,
    default: false,
  },
  isAccountDeactivated: {
    type: Boolean,
    default: false,
  },

  password: {
    type: String,
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

  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

const Instructor =
  mongoose.model("Instructor", instructorSchema) || mongoose.models.Instructor;
module.exports = Instructor;
