const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const allowedFileTypes = ["image/png", "image/jpg", "image/jpeg", "video/mp4", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Base configuration for all file types
    const baseConfig = {
      folder: "uploads/lms",
      resource_type: "auto", // Let Cloudinary auto-detect the resource type
      use_filename: true,
      unique_filename: true
    };

    // Special handling for PDFs and other documents
    if (file.mimetype === "application/pdf" || 
        file.mimetype === "application/msword" || 
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return {
        ...baseConfig,
        resource_type: "raw",
        format: file.mimetype === "application/pdf" ? "pdf" : 
               file.mimetype === "application/msword" ? "doc" : "docx",
        public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
        flags: "attachment"
      };
    }

    // Handle images and videos
    return {
      ...baseConfig,
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
      format: file.mimetype.split('/')[1],
      public_id: `${Date.now()}_${file.originalname.split('.')[0]}`
    };
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
});

module.exports = upload;