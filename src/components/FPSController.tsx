"use client";

import React from 'react';
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FPSControllerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  fps: number;
  onFPSChange: (value: number) => void;
  sourceFPS: number;
  onSourceFPSChange: (value: number) => void;
  onReset: () => void;
}

const FPSController = ({ 
  isPlaying, 
  onTogglePlay, 
  fps, 
  onFPSChange, 
  sourceFPS, 
  onSourceFPSChange, 
  onReset 
}: FPSControllerProps) => {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Playback Control</h4>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tabular-nums">{fps}</span>
            <Badge variant="secondary" className="font-mono">Target FPS</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings2 size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Calibration</h4>
                  <p className="text-xs text-muted-foreground">
                    Set the original FPS of your video for accurate playback.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-fps">Source Video FPS</Label>
                  <Input
                    id="source-fps"
                    type="number"
                    value={sourceFPS}
                    onChange={(e) => onSourceFPSChange(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
          <span>Slow Motion</span>
          <span>Real-time ({sourceFPS})</span>
        </div>
        <Slider
          value={[fps]}
          min={1}
          max={Math.max(60, sourceFPS * 2)}
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
          variant={fps === sourceFPS ? "default" : "outline"}
          size="sm"
          onClick={() => onFPSChange(sourceFPS)}
          className="text-xs font-mono col-span-2"
        >
          Match Source ({sourceFPS})
        </Button>
      </div>
    </div>
  );
};

export default FPSController;