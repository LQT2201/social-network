export const formatMediaFiles = (mediaFiles = []) => {
  try {
    if (!Array.isArray(mediaFiles) || !mediaFiles.length) {
      return { images: [], videos: [] };
    }

    return mediaFiles.reduce(
      (acc, media) => {
        if (!media?.url) return acc;

        const mediaType = media.type?.toLowerCase();
        const baseMedia = {
          url: media.url,
          width: media.dimensions?.width || 0,
          height: media.dimensions?.height || 0,
          id: media._id,
          thumbnail: media.thumbnail,
        };

        if (mediaType === "image") {
          acc.images.push({
            ...baseMedia,
            type: media.metadata?.format || "jpg",
          });
        } else if (mediaType === "video") {
          acc.videos.push({
            ...baseMedia,
            type: media.metadata?.format || "mp4",
            size: media.metadata?.size || 0,
          });
        }
        return acc;
      },
      { images: [], videos: [] }
    );
  } catch (error) {
    console.error("Error formatting media files:", error);
    return { images: [], videos: [] };
  }
};
