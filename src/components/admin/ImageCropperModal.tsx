import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Crop } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File, croppedPreviewUrl: string) => void;
  aspectRatio?: number; // e.g. 16/10 = 1.6
  title?: string;
}

function getClampedOffset(
  rawX: number,
  rawY: number,
  zoomVal: number,
  containerEl: HTMLDivElement | null
) {
  if (!containerEl || zoomVal <= 1) return { x: 0, y: 0 };
  const rect = containerEl.getBoundingClientRect();
  const maxOffsetX = (rect.width * (zoomVal - 1)) / 2;
  const maxOffsetY = (rect.height * (zoomVal - 1)) / 2;

  return {
    x: Math.max(-maxOffsetX, Math.min(maxOffsetX, rawX)),
    y: Math.max(-maxOffsetY, Math.min(maxOffsetY, rawY)),
  };
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 1.6, // Default card aspect ratio 16:10
  title = 'Crop & Adjust Image',
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setOffset(getClampedOffset(newX, newY, zoom, containerRef.current));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    setOffset(getClampedOffset(newX, newY, zoom, containerRef.current));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    setOffset((prev) => getClampedOffset(prev.x, prev.y, newZoom, containerRef.current));
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleCrop = () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const cropFrame = containerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    // Target output dimensions based on crop frame aspect ratio
    const outputWidth = 1280;
    const outputHeight = Math.round(outputWidth / aspectRatio);

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Calculate source rect on original natural image
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const sourceX = (cropFrame.left - imgRect.left) * scaleX;
    const sourceY = (cropFrame.top - imgRect.top) * scaleY;
    const sourceWidth = cropFrame.width * scaleX;
    const sourceHeight = cropFrame.height * scaleY;

    // Fill with white background before drawing
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    ctx.drawImage(
      img,
      Math.max(0, sourceX),
      Math.max(0, sourceY),
      Math.min(img.naturalWidth, sourceWidth),
      Math.min(img.naturalHeight, sourceHeight),
      0,
      0,
      outputWidth,
      outputHeight
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], `cropped_${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        const croppedPreviewUrl = URL.createObjectURL(blob);
        onCropComplete(croppedFile, croppedPreviewUrl);
        onClose();
      },
      'image/jpeg',
      0.92
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md animate-fade-in">
      <div className="flex max-h-[92dvh] w-[95vw] sm:w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0C2147] border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold)]">
              <Crop className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--navy)] dark:text-white">{title}</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-300">
                Fit image to card dimensions (16:10 Aspect Ratio)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 sm:p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gray-900 p-4 sm:p-6 min-h-[260px]">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-xl border-2 border-[var(--gold)] shadow-2xl touch-none select-none"
            style={{
              width: '100%',
              maxWidth: '460px',
              aspectRatio: `${aspectRatio}`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Dark Mask Grid Lines */}
            <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 border border-white/20">
              <div className="border-[0.5px] border-white/15"></div>
              <div className="border-[0.5px] border-white/15"></div>
              <div className="border-[0.5px] border-white/15"></div>
              <div className="border-[0.5px] border-white/15"></div>
              <div className="border-[0.5px] border-white/15"></div>
              <div className="border-[0.5px] border-white/15"></div>
              <div className="border-[0.5px] border-white/15"></div>
              <div className="border-[0.5px] border-white/15"></div>
              <div className="border-[0.5px] border-white/15"></div>
            </div>

            {/* Draggable & Scalable Image */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              className="absolute select-none cursor-move transition-transform duration-75"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                maxHeight: 'none',
                maxWidth: 'none',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <p className="mt-2.5 text-[11px] sm:text-xs text-gray-400 text-center">
            💡 Drag to reposition • Use slider to zoom
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-[#071530] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={handleZoomChange}
              className="h-2 w-32 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[var(--teal)] dark:bg-gray-700"
            />
            <ZoomIn className="h-4 w-4 text-gray-500 dark:text-gray-400" />

            <button
              type="button"
              onClick={handleReset}
              className="ml-2 inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCrop}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--teal)] px-5 py-2 text-sm font-bold text-white shadow-lg hover:bg-[var(--teal-dark)] transition-all"
            >
              <Check className="h-4 w-4" />
              Crop & Apply Image
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
