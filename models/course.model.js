const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    
    title : {
        type : String,
        required : true,
    },
    isPublished : {
        type : Boolean,
        default : false,

    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",  
        required: true,
      },
    imageurl : {
        type : String,

    },
    price : {
        type : Number,
        required : false

    },

    isFree : {
        type : Boolean,
        default : true

    },

    isYoutubeCourse : {
        type : Boolean,
        default : false 
    },

    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",  
      }],
    description : {
        type : String,

    },
   tags : 
    {
        domain : {
            type : String,
        },
        languages : [
            {
                name : String
            }
        ],
        
    }
   ,

   chapters : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Chapters',
        required : false
    }
   ]





    
})

const Courses = mongoose.model("Courses",courseSchema) || mongoose.models.Courses
module.exports = Courses