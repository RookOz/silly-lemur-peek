"use client";

import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FPSControllerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  fps: number;
  onFPSChange: (value: number) => void;
  onReset: () => void;
}

const FPSController = ({ isPlaying, onTogglePlay, fps, onFPSChange, onReset }: FPSControllerProps) => {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Playback Control</h4>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tabular-nums">{fps}</span>
            <Badge variant="secondary" className="font-mono">FPS</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onReset} className="rounded-full">
            <RotateCcw size={18} />
          </Button>
          <Button 
            size="lg" 
            onClick={onTogglePlay} 
            className="rounded-full w-12 h-12 p-0 shadow-lg shadow-primary/20"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>Slow (1 FPS)</span>
          <span>Real-time / Fast (60 FPS)</span>
        </div>
        <Slider
          value={[fps]}
          min={1}
          max={60}
          step={1}
          onValueChange={(val) => onFPSChange(val[0])}
          className="py-4"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[12, 24, 30, 60].map((preset) => (
          <Button
            key={preset}
            variant={fps === preset ? "default" : "outline"}
            size="sm"
            onClick={() => onFPSChange(preset)}
            className="text-xs font-mono"
          >
            {preset} FPS
          </Button>
        ))}
        <Button
          variant={fps === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onFPSChange(1)}
          className="text-xs font-mono"
        >
          1 FPS
        </Button>
      </div>
    </div>
  );
};

export default FPSController;