const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const userRouter= require("./routes/user.route");
const errorHandler = require("./middlewares/errorHandler");
const ErrorHandler = require("./utils/error");
const { verifyToken } = require("./utils/jwt");
const cookieparser = require("cookie-parser")

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieparser())


// authentication
app.use("/api/v1/auth/user", authRouter);


//user data
app.use("/api/v1/user",verifyToken,userRouter)



app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Listening on ${process.env.PORT}`);
});
