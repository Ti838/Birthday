import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

export const CrownIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M4 19h16v2H4v-2zm1-8l4 3 3-7 3 7 4-3-2 6H7l-2-6z" fill={color} />
    <circle cx="5" cy="10" r="1.5" fill={color} />
    <circle cx="12" cy="6" r="1.5" fill={color} />
    <circle cx="19" cy="10" r="1.5" fill={color} />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M12 2l2.4 6.8L21 11.2l-6.6 2.4L12 20.4l-2.4-6.8L3 11.2l6.6-2.4L12 2z" fill={color} />
    <circle cx="19" cy="5" r="1.5" fill={color} opacity="0.8" />
    <circle cx="5" cy="19" r="1.2" fill={color} opacity="0.8" />
  </svg>
);

export const GiftIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M20 7h-3.17A3 3 0 0012 4.41 3 3 0 007.17 7H4a1 1 0 00-1 1v4a1 1 0 001 1h1v7a2 2 0 002 2h10a2 2 0 002-2v-7h1a1 1 0 001-1V8a1 1 0 00-1-1zM9.5 6a1.5 1.5 0 012.44 1H8.06A1.5 1.5 0 019.5 6zm5 0a1.5 1.5 0 011.44 1h-3.88a1.5 1.5 0 012.44-1zM5 9h6v2H5V9zm2 4h4v7H7v-7zm10 7h-4v-7h4v7zm2-9h-6V9h6v2z" fill={color} />
  </svg>
);

export const CakeIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M12 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm-4 7a1 1 0 011-1h6a1 1 0 011 1v1H8V9zm-3 4a1 1 0 011-1h12a1 1 0 011 1v1H5v-1zm-1 3h16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" fill={color} />
    <circle cx="8" cy="4" r="0.8" fill="#F2B5A5" />
    <circle cx="12" cy="2.5" r="0.8" fill="#F2B5A5" />
    <circle cx="16" cy="4" r="0.8" fill="#F2B5A5" />
  </svg>
);

export const BalloonIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#F2B5A5', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M12 2C7.58 2 4 5.58 4 10c0 4.14 3.09 7.57 7.13 7.95L10 20h4l-1.13-2.05C16.91 17.57 20 14.14 20 10c0-4.42-3.58-8-8-8z" fill={color} />
    <path d="M12 20v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 8c0-2.21 1.79-4 4-4" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const FlowerIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <circle cx="12" cy="12" r="3" fill="#E8C872" />
    <path d="M12 4a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z" fill={color} opacity="0.85" />
    <path d="M12 14a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z" fill={color} opacity="0.85" />
    <path d="M4 12a3 3 0 013-3 3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3z" fill={color} opacity="0.85" />
    <path d="M14 12a3 3 0 013-3 3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3z" fill={color} opacity="0.85" />
  </svg>
);

export const FireworksIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#E8C872', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <circle cx="12" cy="12" r="2.5" fill={color} />
    <path d="M12 3v4m0 10v4M3 12h4m10 0h4m-12.66-6.66l2.83 2.83m7.66 7.66l2.83 2.83m-13.32 0l2.83-2.83m7.66-7.66l2.83-2.83" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const MusicIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M9 18V5l10-2v13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="18" r="3" fill={color} />
    <circle cx="16" cy="16" r="3" fill={color} />
  </svg>
);

export const EnvelopeIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" stroke={color} strokeWidth="1.5" />
    <path d="M3 7l9 6 9-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M7 11a4 4 0 100-8 4 4 0 000 8zm0 0l10 10m-3-3l3 3m0-6l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 18, className = '', color = '#FFE5A4', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} />
  </svg>
);
