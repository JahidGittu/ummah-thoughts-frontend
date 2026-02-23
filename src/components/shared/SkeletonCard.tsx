"use client";

import { cn } from "@/lib/utils";

interface SkeletonBoxProps {
    className?: string;
}

export function SkeletonBox({ className }: SkeletonBoxProps) {
    return (
        <div
            className={cn("shimmer rounded-lg", className)}
            aria-hidden="true"
        />
    );
}

/**
 * Debate-style skeleton card for loading states.
 */
export function SkeletonDebateCard() {
    return (
        <div
            className="rounded-2xl border border-border bg-card p-6 space-y-4"
            aria-hidden="true"
            role="presentation"
        >
            {/* Status + topic badges */}
            <div className="flex items-center gap-2">
                <SkeletonBox className="h-5 w-14 rounded-full" />
                <SkeletonBox className="h-5 w-24 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-2">
                <SkeletonBox className="h-5 w-full" />
                <SkeletonBox className="h-5 w-3/4" />
            </div>

            {/* Arabic sub-title */}
            <SkeletonBox className="h-4 w-1/2 ml-auto" />

            {/* Participants */}
            <div className="flex items-center gap-3">
                <SkeletonBox className="h-8 w-8 rounded-xl flex-shrink-0" />
                <SkeletonBox className="h-4 w-28" />
                <SkeletonBox className="h-4 w-4 rounded-full mx-auto" />
                <SkeletonBox className="h-4 w-28" />
                <SkeletonBox className="h-8 w-8 rounded-xl flex-shrink-0" />
            </div>

            {/* Footer stats */}
            <div className="flex items-center justify-between pt-1">
                <SkeletonBox className="h-3 w-20" />
                <SkeletonBox className="h-7 w-16 rounded-lg" />
            </div>
        </div>
    );
}

/**
 * Grid of skeleton debate cards — shown while content loads.
 */
export function SkeletonDebateGrid({ count = 3 }: { count?: number }) {
    return (
        <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="Loading debates…"
            aria-busy="true"
        >
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonDebateCard key={i} />
            ))}
        </div>
    );
}

/**
 * Simple stat card skeleton.
 */
export function SkeletonStatCard() {
    return (
        <div
            className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4"
            aria-hidden="true"
            role="presentation"
        >
            <SkeletonBox className="w-12 h-12 rounded-2xl flex-shrink-0" />
            <div className="space-y-2 flex-1">
                <SkeletonBox className="h-6 w-12" />
                <SkeletonBox className="h-3 w-24" />
            </div>
        </div>
    );
}
