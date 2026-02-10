"use client";

import React, { useState } from 'react';
import VideoUploader from '@/components/VideoUploader';
import VideoCanvasPlayer from '@/components/VideoCanvasPlayer';
import FPSController from '@/components/FPSController';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from '@/components/ui/button';
import { X, Video } from 'lucide-react';

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(24);

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setVideoFile(null);
    setIsPlaying(false);
    setFps(24);
  };

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
              <p className="text-muted-foreground text-sm">Precision FPS Video Player</p>
            </div>
          </div>
          {videoFile && (
            <Button variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-destructive">
              <X size={18} className="mr-2" />
              Clear Video
            </Button>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Player */}
          <div className="lg:col-span-8 space-y-6">
            {!videoFile ? (
              <VideoUploader onVideoUpload={handleVideoUpload} className="h-[400px]" />
            ) : (
              <div className="space-y-4">
                <VideoCanvasPlayer 
                  videoFile={videoFile} 
                  targetFPS={fps} 
                  isPlaying={isPlaying} 
                />
                <div className="bg-card border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">
                      {videoFile.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
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
                onReset={() => setFps(24)}
              />
              
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                <h5 className="font-semibold text-sm mb-2">How it works</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This player uses a custom rendering engine to limit the visual output to your target FPS. 
                  The video source plays at normal speed, but the display only updates at the frequency you choose.
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