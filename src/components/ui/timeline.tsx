"use client";

import React from 'react';
import { cn } from '@/lib/utils';

const Timeline = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn('flex flex-col', className)} {...props} />
));
Timeline.displayName = 'Timeline';

const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('relative flex-1 pb-8', className)}
    {...props}
  />
));
TimelineItem.displayName = 'TimelineItem';

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('absolute left-3 top-3 -ml-px mt-1 h-full w-0.5 bg-border', className)}
    {...props}
  />
));
TimelineConnector.displayName = 'TimelineConnector';

const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative flex items-center gap-4', className)}
    {...props}
  />
));
TimelineHeader.displayName = 'TimelineHeader';

const TimelineIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
TimelineIcon.displayName = 'TimelineIcon';

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold text-card-foreground', className)}
    {...props}
  />
));
TimelineTitle.displayName = 'TimelineTitle';

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('ml-10 mt-1 text-xs text-muted-foreground', className)}
    {...props}
  />
));
TimelineDescription.displayName = 'TimelineDescription';

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('ml-10 mt-2', className)}
    {...props}
  />
));
TimelineContent.displayName = 'TimelineContent';


export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineDescription,
  TimelineContent
};
