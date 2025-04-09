'use client'

import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string;
  speed?: string;
  bgOpacity?: number;
}

const Loading: React.FC<SpinnerProps> = ({
  size = 38,
  color = "var(--primary)",
  speed = "2s",
  bgOpacity = 0.2,
}) => {
  return (
    <svg
      className="overflow-visible"
      viewBox="0 0 40 40"
      height={size}
      width={size}
      style={{
        transformOrigin: "center",
        animation: `rotate ${speed} linear infinite`,
      }}
    >
      {/* Background Track */}
      <circle
        cx="20"
        cy="20"
        r="17.5"
        pathLength="100"
        strokeWidth="5"
        fill="none"
        stroke={color}
        opacity={bgOpacity}
      />
      {/* Animated Stroke */}
      <circle
        cx="20"
        cy="20"
        r="17.5"
        pathLength="100"
        strokeWidth="5"
        fill="none"
        stroke={color}
        strokeDasharray="1, 200"
        strokeDashoffset="0"
        strokeLinecap="round"
        style={{
          animation: `stretch calc(${speed} * 0.75) ease-in-out infinite`,
          transition: "stroke 0.5s ease",
        }}
      />
      <style>
        {`
          @keyframes rotate {
            100% { transform: rotate(360deg); }
          }

          @keyframes stretch {
            0% {
              stroke-dasharray: 0, 150;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 75, 150;
              stroke-dashoffset: -25;
            }
            100% {
              stroke-dashoffset: -100;
            }
          }
        `}
      </style>
    </svg>
  );
};

export default Loading;
