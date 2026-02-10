"use client";

import React, { useState } from 'react';
import VideoUploader from '@/components/VideoUploader';
import VideoCanvasPlayer from '@/components/VideoCanvasPlayer';
import FPSController from '@/components/FPSController';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from '@/components/ui/button';
import { X, Video, Info, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Using a more reliable public video source
const DEFAULT_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const Index = () => {
  const [videoSource, setVideoSource] = useState<File | string>(DEFAULT_VIDEO_URL);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState(30);
  const [sourceFPS, setSourceFPS] = useState(30);

  const handleVideoUpload = (file: File) => {
    setVideoSource(file);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setVideoSource("");
    setIsPlaying(false);
    setFps(30);
    setSourceFPS(30);
  };

  const isDefault = typeof videoSource === 'string' && videoSource === DEFAULT_VIDEO_URL;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Video className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FrameControl</h1>
              <p className="text-muted-foreground text-sm">Sequential Frame-by-Frame Player</p>
            </div>
          </div>
          {videoSource && (
            <Button variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-destructive">
              <X size={18} className="mr-2" />
              Clear Video
            </Button>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Player */}
          <div className="lg:col-span-8 space-y-6">
            {!videoSource ? (
              <VideoUploader onVideoUpload={handleVideoUpload} className="h-[400px]" />
            ) : (
              <div className="space-y-4">
                <VideoCanvasPlayer 
                  videoSource={videoSource} 
                  targetFPS={fps} 
                  sourceFPS={sourceFPS}
                  isPlaying={isPlaying} 
                />
                
                <Alert className="bg-blue-500/5 border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-500 font-semibold">No-Skip Mode Active</AlertTitle>
                  <AlertDescription className="text-muted-foreground text-xs">
                    The video speed is locked to your target FPS. Lowering FPS creates a smooth slow-motion effect showing every frame.
                  </AlertDescription>
                </Alert>

                <div className="bg-card border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDefault ? (
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                    <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">
                      {videoSource instanceof File ? videoSource.name : "Demo: Big Buck Bunny"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {videoSource instanceof File ? `${(videoSource.size / (1024 * 1024)).toFixed(2)} MB` : "Sample Video"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <FPSController 
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                fps={fps}
                onFPSChange={setFps}
                sourceFPS={sourceFPS}
                onSourceFPSChange={setSourceFPS}
                onReset={() => {
                  setFps(30);
                  setSourceFPS(30);
                }}
              />
              
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                <h5 className="font-semibold text-sm mb-2">Try it out</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We've loaded a demo video for you. Try sliding the FPS down to <strong>1 FPS</strong> to see the animation progress frame-by-frame!
                </p>
              </div>
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