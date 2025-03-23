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
    // Determine resource type based on mimetype
    const resourceType = file.mimetype.startsWith("image/") ? "image" : "video";

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType,
      folder: "social_media_uploads",
      transformation:
        resourceType === "image"
          ? [{ width: 1000, crop: "limit" }, { quality: "auto:good" }]
          : [{ quality: "auto:good" }],
    });

    // Generate thumbnail for videos
    let thumbnail = null;
    if (resourceType === "video") {
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

    return {
      url: result.secure_url,
      publicId: result.public_id,
      thumbnail: thumbnail ? thumbnail.secure_url : null,
      dimensions: {
        width: result.width,
        height: result.height,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw new BadRequestError("File upload failed");
  }
};

module.exports = {
  uploadFile,
};
