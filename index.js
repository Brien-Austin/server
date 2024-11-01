const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const session = require("express-session");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const instructorRouter = require("./routes/instructor.route");
const errorHandler = require("./middlewares/errorHandler");
const ErrorHandler = require("./utils/error");
const passport = require("passport");
require("./config/passport");
const {
  verifyToken,
  verifyInstructorToken,
  verifyAdminToken,
} = require("./utils/jwt");
const cookieparser = require("cookie-parser");
const upload = require("./config/upload");
const { imageUploadHandler } = require("./controller/course.controller");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true, 
}));
app.use(cookieparser());

app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS in production
    httpOnly: true, // Restrict cookie access to HTTP requests only
    sameSite: "None", // Enables cross-site requests
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
}));

app.use(passport.initialize());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (message) => {
    console.log(message);
    socket.emit("resp", `Message received: ${message}`);
  });
});

app.get("/", (req, res) => {
  res.send("ACQUEL LMS BACKEND");
});

// authentication
app.use("/api/v1/auth/user", authRouter);

//user data
app.use("/api/v1/user", verifyToken, userRouter);

// admin

app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/admin", verifyAdminToken, adminRouter);

//instructor
app.use("/api/v1/auth/instructor", instructorRouter);
app.use("/api/v1/instructor", verifyInstructorToken, instructorRouter);

// image uploader

app.post("/api/v1/admin/image", upload.single("file"), imageUploadHandler);

server.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Listening on ${process.env.PORT}`);
});
