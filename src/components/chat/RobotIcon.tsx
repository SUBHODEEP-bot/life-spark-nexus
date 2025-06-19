
import React from 'react';

const RobotIcon = ({ size = 150 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Robot Body */}
      <rect x="35" y="60" width="80" height="70" rx="15" fill="white" stroke="#3B82F6" strokeWidth="2"/>
      
      {/* Robot Head */}
      <circle cx="75" cy="35" r="25" fill="white" stroke="#3B82F6" strokeWidth="2"/>
      
      {/* Antenna */}
      <line x1="75" y1="10" x2="75" y2="18" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="75" cy="8" r="3" fill="#3B82F6"/>
      
      {/* Face Screen */}
      <rect x="60" y="25" width="30" height="20" rx="5" fill="#1F2937"/>
      
      {/* Eyes */}
      <circle cx="68" cy="32" r="3" fill="#3B82F6"/>
      <circle cx="82" cy="32" r="3" fill="#3B82F6"/>
      
      {/* Smile */}
      <path d="M 65 38 Q 75 42 85 38" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round"/>
      
      {/* HI! Text on Chest */}
      <rect x="60" y="75" width="30" height="15" rx="7" fill="#3B82F6"/>
      <text x="75" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">HI!</text>
      
      {/* Left Arm (Down) */}
      <rect x="20" y="70" width="20" height="8" rx="4" fill="#3B82F6"/>
      <circle cx="15" cy="74" r="8" fill="#3B82F6"/>
      
      {/* Right Arm (Waving) */}
      <rect x="110" y="55" width="20" height="8" rx="4" fill="#3B82F6" transform="rotate(25 120 59)"/>
      <circle cx="135" cy="55" r="8" fill="#3B82F6"/>
      
      {/* Legs */}
      <rect x="50" y="125" width="12" height="20" rx="6" fill="#3B82F6"/>
      <rect x="88" y="125" width="12" height="20" rx="6" fill="#3B82F6"/>
      
      {/* Feet */}
      <ellipse cx="56" cy="145" rx="8" ry="4" fill="#3B82F6"/>
      <ellipse cx="94" cy="145" rx="8" ry="4" fill="#3B82F6"/>
      
      {/* Body Details */}
      <circle cx="55" cy="85" r="3" fill="#E5E7EB"/>
      <circle cx="95" cy="85" r="3" fill="#E5E7EB"/>
      <rect x="65" y="100" width="20" height="3" rx="1.5" fill="#E5E7EB"/>
      <rect x="70" y="108" width="10" height="3" rx="1.5" fill="#E5E7EB"/>
    </svg>
  );
};

export default RobotIcon;
