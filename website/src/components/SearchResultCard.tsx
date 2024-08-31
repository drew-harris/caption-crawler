import React, { useState } from "react";
import { TypesenseMoment } from "shared/types";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SearchResultCardProps {
  hit: {
    document: TypesenseMoment;
  };
}

export function SearchResultCard({ hit }: SearchResultCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex">
      <div className="w-40 h-24 flex-shrink-0 mr-4 relative">
        <img
          src={hit.document.thumbnailUrl}
          alt={hit.document.videoTitle}
          className="w-full h-full object-cover rounded-md cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-navy font-bold text-[18px] mb-2 truncate">
          {hit.document.videoTitle}
        </div>
        <div className="text-[14px] text-gray-700 mb-2">
          {hit.document.content}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
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
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
