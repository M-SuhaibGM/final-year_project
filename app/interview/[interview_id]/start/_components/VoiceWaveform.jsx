"use client";
import React from "react";

function VoiceWaveform({ volume = 0, isSpeaking = false }) {
  // We create 9 bars for the waveform
  const bars = Array.from({ length: 9 });

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((_, i) => {
        // Create a pseudo-random height based on volume for each bar
        const randomFactor = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 0.8, 0.4][i];
        const height = isSpeaking ? Math.max(10, volume * 100 * randomFactor) : 4;

        return (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-100 ${
              isSpeaking ? "bg-primary" : "bg-gray-300"
            }`}
            style={{
              height: `${height}%`,
              opacity: isSpeaking ? 1 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

export default VoiceWaveform;