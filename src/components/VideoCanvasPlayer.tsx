"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoCanvasPlayerProps {
  videoFile: File;
  targetFPS: number;
  sourceFPS: number;
  isPlaying: boolean;
  className?: string;
}

const VideoCanvasPlayer = ({ videoFile, targetFPS, sourceFPS, isPlaying, className }: VideoCanvasPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const requestRef = useRef<number>();

  useEffect(() => {
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Adjust playback rate to match target FPS relative to source FPS
    // This ensures every frame is shown without skipping
    const rate = targetFPS / sourceFPS;
    video.playbackRate = Math.max(0.0625, Math.min(16, rate)); // Browser limits

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, targetFPS, sourceFPS]);

  const renderFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Draw the current video frame to canvas as fast as the browser allows
    // The video.playbackRate handles the "no skipping" requirement
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    requestRef.current = requestAnimationFrame(renderFrame);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  };

  return (
    <div className={cn("relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10", className)}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="hidden"
        loop
        muted
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium">
            Paused
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCanvasPlayer;