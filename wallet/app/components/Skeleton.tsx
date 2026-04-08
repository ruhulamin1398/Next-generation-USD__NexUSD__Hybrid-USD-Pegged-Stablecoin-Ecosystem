'use client'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-slate-200 shadow-sm shadow-slate-200/50 dark:bg-slate-700 ${className}`}
    />
  )
}
