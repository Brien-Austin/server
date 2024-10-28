const mongoose = require("mongoose");

const optionSchema  = new mongoose.Schema({
    text : {
        type : String,
        required : true
    }
})

const questionSchema = new mongoose.Schema({

    question : {
        type : String,
        required : true

    },
    options : [optionSchema],
    answer : {
        type : mongoose.Schema.Types.ObjectId,
        required : false,
        ref : 'Options'
    }
})

const chapterSchema = new mongoose.Schema({
  index : {
    type : Number,
    unique : true,

  },
  title: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    required : false
  },
  description: {
    type: String,
    required: true,
  },
  courseId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Courses'

  },

  videoUrl: {
    type: String,
  },

  qa : [
    {
        type : mongoose.Schema.Types.ObjectId,
        required : false,
        ref : 'Questions'
      }
  ]
});


const Questions = mongoose.model("Questions",questionSchema) || mongoose.models.Questions

const Options = mongoose.model("Options",optionSchema) || mongoose.models.Options

const Chapters =
  mongoose.model("Chapters", chapterSchema) || mongoose.models.Chapters;
module.exports = {
    Chapters,Questions,Options
};
