
'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Background() {
  const { resolvedTheme } = useTheme();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(resolvedTheme === 'light');
  }, [resolvedTheme]);

  return (
    <div className={cn(
      "fixed inset-0 z-[-2] w-full h-full transition-colors duration-1000",
      isLight ? 'bg-gradient-to-b from-sky-200 to-sky-400' : 'bg-transparent'
    )}>
       {/* Night sky */}
      <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isLight ? 'opacity-0' : 'opacity-100'
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
    </div>
  );
}
