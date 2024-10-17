const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    
    title : {
        type : String,
        required : true,
    },
    imageurl : {
        type : String,

    },
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
        ]
    }
   ,

   chapters : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Chapter',
        required : false
    }
   ]





    
})

const Courses = mongoose.model("Courses",courseSchema) || mongoose.models.Courses
module.exports = Courses