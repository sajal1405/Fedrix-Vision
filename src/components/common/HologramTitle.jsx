// src/components/common/HologramTitle.jsx
import React from 'react';

// Animated reflection keyframes
const reflectionKeyframes = `
@keyframes holo-reflect-move {
  0% { left: -65%; }
  100% { left: 110%; }
}
`;

const HologramTitle = ({ title, status }) => (
  <div
    className="relative flex items-center justify-center select-none"
    style={{
      minHeight: 48,
      minWidth: 150,
      maxWidth: 350,
    }}
  >
    {/* Neon Rounded Border */}
    <span
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        borderRadius: '2rem',
        border: '2.5px solid transparent',
        boxShadow: '0 0 0 2.5px #00fff7, 0 0 14px 1px #15f0f0aa inset',
        background:
          'linear-gradient(115deg, #00fff7, #23e9fa 45%, #10c7e2 100%) border-box',
        WebkitMask:
          'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />

    {/* Glassy black "screen" */}
    <span
      aria-hidden
      className="absolute inset-0"
      style={{
        borderRadius: '2rem',
        background: 'linear-gradient(120deg, #0f1721 75%, #1cc9fa18 100%)',
        boxShadow: '0 1px 6px 0 #0de6ff40 inset, 0 0 0 2px #00fff77f inset',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* --- Moving reflection effect (animated) --- */}
      <style>{reflectionKeyframes}</style>
      <span
        className="absolute top-[15%] h-[70%] w-1/3"
        style={{
          borderRadius: '100px',
          background:
            'linear-gradient(105deg,rgba(255,255,255,0.16) 0%,rgba(255,255,255,0.02) 80%)',
          filter: 'blur(2.2px)',
          opacity: 0.85,
          left: '-65%',
          animation: 'holo-reflect-move 2.5s linear infinite',
        }}
      />
      {/* Soft faint screen glow, tighter spread */}
      <span
        className="absolute inset-0"
        style={{
          borderRadius: '2rem',
          background:
            'radial-gradient(circle at 65% 70%,rgba(44,255,250,0.07) 0%,rgba(0,0,0,0) 80%)',
          opacity: 0.93,
        }}
      />
    </span>

    {/* Main Text */}
    <span
      className="
        relative z-10 px-9 py-2
        text-cyan-200 text-lg md:text-xl font-extrabold tracking-wide uppercase
        [text-shadow:0_0_3px_#18f0fa,0_0_7px_#0bc4e2]
      "
      style={{
        letterSpacing: '0.06em',
        fontFamily: 'inherit',
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      {title}
      {status && (
        <span className="ml-4 px-4 py-2 text-xs rounded-full bg-lime-600/20 text-lime-300 font-semibold border border-lime-500/30 shadow-inner animate-pulse">
          {status}
        </span>
      )}
    </span>
  </div>
);

export default HologramTitle;
