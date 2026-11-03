'use client';
import React, { useState } from 'react';

// Deterministic gradients based on name for consistent studio branding
const GRADIENTS = [
  'from-amber-600 to-amber-700 text-white',
  'from-zinc-800 to-zinc-950 text-amber-300',
  'from-blue-600 to-indigo-700 text-white',
  'from-emerald-600 to-teal-700 text-white',
  'from-rose-600 to-pink-700 text-white',
  'from-violet-600 to-purple-800 text-white',
  'from-cyan-600 to-blue-700 text-white',
  'from-orange-600 to-red-600 text-white',
];

function getGradientForName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export function Avatar({
  src,
  name = 'Production House',
  className = 'w-10 h-10 rounded-xl text-base',
  alt,
}) {
  const [imgError, setImgError] = useState(false);

  const hasValidImage = Boolean(src && typeof src === 'string' && src.trim() && !imgError);
  const initial = (name?.trim()?.charAt(0) || 'P').toUpperCase();
  const gradient = getGradientForName(name);

  if (hasValidImage) {
    return (
      <img
        src={src}
        alt={alt || name}
        onError={() => setImgError(true)}
        className={`object-cover bg-zinc-100 border border-zinc-200/80 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      title={name}
      aria-label={name}
      className={`bg-gradient-to-br ${gradient} font-black flex items-center justify-center select-none shrink-0 shadow-xs border border-black/10 ${className}`}
    >
      <span>{initial}</span>
    </div>
  );
}

export default Avatar;
