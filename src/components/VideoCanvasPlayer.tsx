"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoCanvasPlayerProps {
  videoFile: File;
  targetFPS: number;
  isPlaying: boolean;
  className?: string;
}

const VideoCanvasPlayer = ({ videoFile, targetFPS, isPlaying, className }: VideoCanvasPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const requestRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  const renderFrame = (time: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameInterval = 1000 / targetFPS;
    const deltaTime = time - lastFrameTimeRef.current;

    if (deltaTime >= frameInterval) {
      // Draw the current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      lastFrameTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(renderFrame);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [targetFPS]);

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
        onLoadedMetadata={handleLoadedMetadata}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all">
          <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium">
            Paused
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCanvasPlayer;