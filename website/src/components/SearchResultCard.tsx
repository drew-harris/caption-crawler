import React, { useState } from "react";
import { TypesenseMoment } from "shared/types";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResultCardProps {
  hit: {
    document: TypesenseMoment;
  };
}

export function SearchResultCard({ hit }: SearchResultCardProps) {
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex mb-4">
        <div className="w-40 h-24 flex-shrink-0 mr-4">
          <img
            src={hit.document.thumbnailUrl}
            alt={hit.document.videoTitle}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-navy font-bold text-[18px] mb-2">
            {hit.document.videoTitle}
          </div>
        </div>
      </div>
      <div className="text-[14px] text-gray-700 mb-4">
        {hit.document.content}
      </div>

      <button
        className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
        onClick={() => setIsVideoVisible(!isVideoVisible)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
          />
        </svg>
        {isVideoVisible ? "Close Video" : "Show In Video"}
      </button>

      <AnimatePresence>
        {isVideoVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <iframe
              className="w-full aspect-video rounded-md"
              src={`https://www.youtube.com/embed/${hit.document.youtubeVideoId}?start=${hit.document.start}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
