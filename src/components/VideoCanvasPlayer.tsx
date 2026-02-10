"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { showError } from '@/utils/toast';

interface VideoCanvasPlayerProps {
  videoSource: File | string;
  targetFPS: number;
  sourceFPS: number;
  isPlaying: boolean;
  className?: string;
}

const VideoCanvasPlayer = ({ videoSource, targetFPS, sourceFPS, isPlaying, className }: VideoCanvasPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const requestRef = useRef<number>();

  useEffect(() => {
    let url = "";
    if (videoSource instanceof File) {
      url = URL.createObjectURL(videoSource);
    } else {
      url = videoSource;
    }
    
    setVideoUrl(url);
    
    return () => {
      if (videoSource instanceof File) {
        URL.revokeObjectURL(url);
      }
    };
  }, [videoSource]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const rate = targetFPS / sourceFPS;
    video.playbackRate = Math.max(0.0625, Math.min(16, rate));

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback failed:", error);
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, targetFPS, sourceFPS, videoUrl]);

  const renderFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.paused || video.ended || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(renderFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      // This usually happens if CORS is not set up correctly on the remote video server
      console.error("Canvas draw error:", e);
    }
    
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

  const handleVideoError = () => {
    showError("Failed to load video. Please try a different file or URL.");
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
        crossOrigin="anonymous"
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleVideoError}
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