const Course = require("../models/course.model")
async function createCourseHandler(
    req,res
){
    const {title , imageurl, description , tags} = req.body
    try {

        const course = await Course.create({
            title,
            imageurl,
            description,
            tags
        })

        await course.save()

        return res.status(201).json({
            success: true,
            message : "Course created successfully"
        })
        
    } catch (error) {
        console.log('[COURSE_CREATION_ERRROR]',error)
        return res.status(500).json({
            success: false,
            message : "Internal Server Error"
        })
        
    }
    
}

module.exports = {createCourseHandler}