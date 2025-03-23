const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { BadRequestError } = require("../core/error.response");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "social_media_posts",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov"],
    resource_type: "auto",
    transformation: [
      { width: 1000, crop: "limit" }, // Resize images to max width 1000px
      { quality: "auto:good" }, // Optimize quality
    ],
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images and videos only
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Invalid file type. Only images and videos are allowed."
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files
  },
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new BadRequestError("File too large. Maximum size is 10MB."));
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return next(new BadRequestError("Too many files. Maximum is 5 files."));
    }
  }
  next(err);
};

module.exports = {
  uploadCloud: upload,
  handleUploadError,
};
