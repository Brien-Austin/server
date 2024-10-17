const User = require("../models/user.model")
const { hashValue, compareValue } = require("../utils/bcrypt")
const { AuthenticationError } = require("../utils/errors")
const { generateAcessToken, generateRefreshToken } = require("../utils/jwt")



async function loginUser(email, password) {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User does not exist");
        }

        

        return { at, rt };

    } catch (error) {
      
        throw error;
    }
}




module.exports = {loginUser}