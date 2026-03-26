import React from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, onClose }: ImageModalProps) => {
  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Upper Controls */}
      <div className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-[110] bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <a 
            href={imageUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer ml-4"
            title="Download"
          >
            <Download size={20} />
          </a>
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="w-full h-full flex items-center justify-center p-4 sm:p-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ease-out shadow-2xl rounded-lg overflow-hidden"
          style={{ transform: `scale(${zoom})` }}
        >
          <img 
            src={imageUrl} 
            alt="full screen preview" 
            className="max-w-[90vw] max-h-[85vh] object-contain select-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
