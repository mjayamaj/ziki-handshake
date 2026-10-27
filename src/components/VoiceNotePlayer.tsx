import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import { VoiceEngine } from '../services/voiceEngine';

interface VoiceNotePlayerProps {
  agentName: string;
  voiceText: string;
  durationSeconds?: number;
  compact?: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  agentName,
  voiceText,
  durationSeconds = 12,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5>(1);
  const timerRef = useRef<any>(null);

  const bars = VoiceEngine.getWaveform(agentName.length * 7, compact ? 16 : 24);

  const handleTogglePlay = () => {
    if (isPlaying) {
      VoiceEngine.stop();
      setIsPlaying(false);
      clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      VoiceEngine.speak(voiceText, agentName, () => {
        setIsPlaying(false);
        setCurrentTime(0);
        clearInterval(timerRef.current);
      });

      const intervalMs = (1000 / playbackSpeed) / 10;
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return Math.min(durationSeconds, prev + 0.1);
        });
      }, intervalMs);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      VoiceEngine.stop();
    };
  }, []);

  const progressPercent = Math.min(100, (currentTime / durationSeconds) * 100);

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs - s) * 10);
    return `0:0${s}.${ms}`.slice(-4);
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #bfdbfe',
        borderRadius: '10px',
        padding: compact ? '8px 12px' : '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 2px 5px rgba(37, 99, 235, 0.04)',
      }}
      role="region"
      aria-label={`Voice note from ${agentName}`}
    >
      {/* Play/Pause Button */}
      <button
        onClick={handleTogglePlay}
        style={{
          width: compact ? '32px' : '36px',
          height: compact ? '32px' : '36px',
          borderRadius: '50%',
          background: isPlaying ? '#1d4ed8' : '#2563eb',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
        title={isPlaying ? 'Pause voice briefing' : 'Play voice briefing'}
        aria-label={isPlaying ? 'Pause voice memo' : 'Play voice memo'}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
      </button>

      {/* Waveform Visualization */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#2563eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Mic size={12} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>Voice Briefing ({agentName})</span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, fontFamily: 'monospace', flexShrink: 0 }}>
            {formatTime(currentTime)} / 0:{durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}
          </span>
        </div>

        {/* Animated Sound Wave Bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '18px', overflow: 'hidden' }}>
          {bars.map((height, i) => {
            const barProgress = (i / bars.length) * 100;
            const isFilled = barProgress <= progressPercent;
            const barHeight = isPlaying
              ? Math.max(3, Math.round(height * 16 * (0.6 + 0.4 * Math.sin(currentTime * 8 + i))))
              : Math.max(3, Math.round(height * 14));

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${barHeight}px`,
                  background: isFilled ? '#2563eb' : '#dbeafe',
                  borderRadius: '2px',
                  transition: 'height 0.15s ease, background 0.1s ease',
                  minWidth: '2px',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Speed pill */}
      <button
        onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : 1))}
        style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#2563eb',
          background: '#eff6ff',
          padding: '4px 7px',
          borderRadius: '4px',
          border: '1px solid #bfdbfe',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        aria-label={`Toggle playback speed, current speed ${playbackSpeed}x`}
      >
        {playbackSpeed}x
      </button>
    </div>
  );
};
