"use client";
import { useState } from "react";
import Image from "next/image";

const MediaItem = ({ item, index, mediaCount, isLastTile }) => {
  const isVideo = item.type === "video";

  return (
    <div
      className={`relative overflow-hidden ${
        mediaCount === 3 && index === 2 ? "col-span-2" : ""
      }`}
    >
      {isVideo ? (
        <video
          src={item.url}
          poster={item.thumbnail}
          controls
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={item.url}
            alt=""
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
          />
          {isLastTile && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xl font-medium">
                +{mediaCount - 4}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MediaGallery = ({ media }) => {
  console.log(media);
  const allMedia = [...(media?.images || []), ...(media?.videos || [])];
  const mediaCount = allMedia.length;

  console.log(allMedia);

  if (!mediaCount) return null;

  const getLayoutClasses = () => {
    switch (mediaCount) {
      case 1:
        return "grid-cols-1 aspect-[4/3]";
      case 2:
        return "grid-cols-2 aspect-[16/9] gap-1";
      case 3:
        return "grid-cols-2 aspect-[4/3] gap-1";
      case 4:
        return "grid-cols-2 aspect-square gap-1";
      default:
        return "grid-cols-3 aspect-[3/2] gap-1";
    }
  };

  const displayMedia = mediaCount <= 4 ? allMedia : allMedia.slice(0, 4);

  return (
    <div className={`grid ${getLayoutClasses()} p-1`}>
      {displayMedia.map((item, index) => (
        <MediaItem
          key={item.id || index}
          item={item}
          index={index}
          mediaCount={mediaCount}
          isLastTile={index === 3 && mediaCount > 4}
        />
      ))}
    </div>
  );
};

export default MediaGallery;
