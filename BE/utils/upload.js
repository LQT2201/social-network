const cloudinary = require("cloudinary").v2;
const { BadRequestError } = require("../core/error.response");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file) => {
  try {
    console.log("file", file);

    // Validate file
    if (!file || !file.path) {
      throw new BadRequestError("Invalid file: missing file path");
    }

    // Validate file type
    if (
      !file.mimetype ||
      (!file.mimetype.startsWith("image/") &&
        !file.mimetype.startsWith("video/"))
    ) {
      throw new BadRequestError(
        "Invalid file type: only images and videos are allowed"
      );
    }

    // Determine resource type and options
    const isImage = file.mimetype.startsWith("image/");
    const uploadOptions = {
      resource_type: isImage ? "image" : "video",
      folder: "social_media_uploads",
      transformation: isImage
        ? [{ width: 1000, crop: "limit" }, { quality: "auto:good" }]
        : [{ quality: "auto:good" }],
    };

    // Upload main file
    const result = await cloudinary.uploader.upload(file.path, uploadOptions);

    // Generate thumbnail for videos
    let thumbnail = null;
    if (!isImage) {
      thumbnail = await cloudinary.uploader.upload(file.path, {
        resource_type: "video",
        folder: "social_media_uploads/thumbnails",
        transformation: [
          { width: 300, crop: "limit" },
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      });
    }

    // Return structured response
    return {
      type: isImage ? "image" : "video",
      url: result.secure_url,
      publicId: result.public_id,
      thumbnail: thumbnail?.secure_url || null,
      dimensions: {
        width: result.width,
        height: result.height,
      },
      metadata: {
        format: result.format,
        size: result.bytes,
        originalName: file.originalname,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up if upload failed
    if (error.public_id) {
      try {
        await cloudinary.uploader.destroy(error.public_id);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    throw new BadRequestError(error.message || "File upload failed");
  }
};

const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
