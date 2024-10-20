const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const instructorRouter = require("./routes/instructor.route")
const errorHandler = require("./middlewares/errorHandler");
const ErrorHandler = require("./utils/error");
const { verifyToken, verifyInstructorToken, verifyAdminToken } = require("./utils/jwt");
const cookieparser = require("cookie-parser");
const upload = require("./config/upload");
const { imageUploadHandler } = require("./controller/course.controller");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieparser());

// authentication
app.use("/api/v1/auth/user", authRouter);

//user data
app.use("/api/v1/user", verifyToken, userRouter);

// admin

app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/admin",verifyAdminToken,adminRouter)

//instructor
app.use("/api/v1/auth/instructor", instructorRouter);
app.use("/api/v1/instructor",verifyInstructorToken,instructorRouter)

// image uploader

app.post("/api/v1/admin/image", upload.single("file"), imageUploadHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Listening on ${process.env.PORT}`);
});
