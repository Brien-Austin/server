const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  isProfileComplete: {
    type: Boolean,
    default : false
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema) || mongoose.models.User;

module.exports = User;
