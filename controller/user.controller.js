const User = require("../models/user.model")

async function userProfileHandler(req,res,next){
    try {
    
        const user = await User.findOne({email :req.user.email})
        
        
        return res.status(200).json({
            success:true,
            message : "User profile",
            user : {
                email : user?.email,
                courses : user?.enrolledCourses,
                isProfileComplete : user?.isProfileComplete
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message : "Internal Server Error"
        })
        
    }


}

module.exports = {userProfileHandler}