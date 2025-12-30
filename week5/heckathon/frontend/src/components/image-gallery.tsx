"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ImageGalleryProps {
  mainImage: string;
  thumbnails: string[];
  title: string;
  status?: string;
}

export function ImageGallery({
  mainImage,
  thumbnails,
  title,
  status,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div className="space-y-4">
      <div className="bg-[#2E3D83] text-white p-3 rounded-sm flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Star className="w-5 h-5" />
      </div>

<div className="flex flex-col lg:flex-row gap-2.5">
      <div className="relative w-full lg:w-2/3">
        {status && (
          <Badge className="absolute top-2 left-2 z-10 bg-red-500">
            {status}
          </Badge>
        )}
        <img
          src={selectedImage || "/placeholder.svg"}
          alt={title}
          className="w-full h-125 object-cover rounded-lg"
        />
      </div>

<div className="w-full lg:w-1/3">
      <div className="grid   grid-cols-2  gap-2.5">
        {thumbnails.map((thumb, index) => (
          <img
            key={index}
            src={thumb || "/placeholder.svg"}
            alt={`${title} ${index + 1}`}
            className={`w-full h-40 object-cover rounded cursor-pointer border-2 ${
              selectedImage === thumb ? "border-[#4A5FBF]" : "border-gray-200"
            }`}
            onClick={() => setSelectedImage(thumb)}
          />
        ))}
      </div>
</div>
      </div>
    </div>
  );
}
