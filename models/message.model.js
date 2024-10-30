const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    ref: "Users",
  },

  instructorId: {
    type: String,
    required: true,
    ref: "Instructors",
  },
  sender: {
    type: String,
    required: true,
  },
  reciever: {
    type: String,

    required: true,
  },

  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Messages =
  mongoose.model("Messages", messageSchema) || mongoose.models.Messages;
module.exports = Messages;
