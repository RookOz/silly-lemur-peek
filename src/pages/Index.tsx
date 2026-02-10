"use client";

import React, { useState, useRef } from 'react';
import VideoUploader from '@/components/VideoUploader';
import VideoCanvasPlayer, { VideoCanvasPlayerHandle } from '@/components/VideoCanvasPlayer';
import FPSController from '@/components/FPSController';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from '@/components/ui/button';
import { X, Video, Sparkles, Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const DEFAULT_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Index = () => {
  const [videoSource, setVideoSource] = useState<File | string>(DEFAULT_VIDEO_URL);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState(24);
  const [sourceFPS, setSourceFPS] = useState(24);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const playerRef = useRef<VideoCanvasPlayerHandle>(null);

  const handleVideoUpload = (file: File) => {
    setVideoSource(file);
    setIsPlaying(true);
    setSourceFPS(30);
    setFps(30);
  };

  const handleReset = () => {
    setVideoSource("");
    setIsPlaying(false);
    setFps(24);
    setSourceFPS(24);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    playerRef.current?.seek(newTime);
  };

  const isDefault = typeof videoSource === 'string' && videoSource === DEFAULT_VIDEO_URL;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Video className="text-primary-foreground w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">FrameControl</h1>
            <p className="text-muted-foreground text-sm">Sequential Frame-by-Frame Player</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Player */}
          <div className="lg:col-span-8 space-y-6">
            {!videoSource ? (
              <VideoUploader onVideoUpload={handleVideoUpload} className="h-[400px]" />
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <VideoCanvasPlayer 
                    ref={playerRef}
                    videoSource={videoSource} 
                    targetFPS={fps} 
                    sourceFPS={sourceFPS}
                    isPlaying={isPlaying}
                    onTimeUpdate={(curr, dur) => {
                      setCurrentTime(curr);
                      setDuration(dur);
                    }}
                  />
                  
                  {/* Progress Crawler */}
                  <div className="bg-card border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{formatTime(currentTime)}</span>
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={0.01}
                      onValueChange={handleSeek}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-card border rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {isDefault ? (
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {videoSource instanceof File ? videoSource.name : "Demo: Big Buck Bunny (24fps)"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {videoSource instanceof File ? `${(videoSource.size / (1024 * 1024)).toFixed(2)} MB` : "Sample Video"}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset} 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0"
                  >
                    <X size={16} className="mr-2" />
                    Clear Video
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <FPSController 
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                fps={fps}
                onFPSChange={setFps}
                sourceFPS={sourceFPS}
                onSourceFPSChange={setSourceFPS}
                onReset={() => {
                  setFps(isDefault ? 24 : 30);
                  setSourceFPS(isDefault ? 24 : 30);
                }}
              />
            </div>
          </div>
        </main>

        <footer className="pt-12 border-t">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;