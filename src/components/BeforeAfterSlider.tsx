"use client";

import { useState } from 'react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  treatment: string;
}

export default function BeforeAfterSlider({
  before,
  after,
  treatment,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div>
      <div
        className="relative w-full h-80 overflow-hidden rounded-3xl border"
        style={{
          borderColor: "var(--border-light)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Before Image */}
        <img
          src={before}
          alt="Before"
          className="absolute w-full h-full object-cover"
        />

        {/* After Image */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={after}
            alt="After"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 h-full w-1 bg-white"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        />

        {/* Range Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-ew-resize"
        />

        {/* Labels */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
          After
        </div>

        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
          Before
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <h4 className="font-semibold">{treatment}</h4>
        <p className="text-sm text-[var(--text)] mt-2">
          Amazing transformation achieved through expert dental care.
        </p>
      </div>
    </div>
  );
}



