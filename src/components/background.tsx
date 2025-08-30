
'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Background() {
  const { resolvedTheme, theme } = useTheme();
  const [isLight, setIsLight] = useState(false);
  const [isFootball, setIsFootball] = useState(false);

  useEffect(() => {
    setIsLight(resolvedTheme === 'light');
    setIsFootball(theme === 'football');
  }, [resolvedTheme, theme]);

  return (
    <div className={cn(
      "fixed inset-0 z-[-2] w-full h-full transition-colors duration-1000",
      isLight ? 'bg-gradient-to-b from-sky-300 to-sky-500' : 'bg-transparent',
       (isFootball || isLight) ? '' : 'bg-transparent'
    )}>
       {/* Night sky */}
      <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          (isLight || isFootball) ? 'opacity-0' : 'opacity-100'
      )}>
        <div id="star-container">
            <div id="stars"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
        </div>
      </div>
      
       {/* Day sky */}
       <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isLight ? 'opacity-100' : 'opacity-0'
       )}>
        <div className="sun"></div>
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      
      {/* Football Theme */}
       <div className={cn(
          "football-theme-bg",
          isFootball ? 'opacity-100' : 'opacity-0'
       )} />
    </div>
  );
}
