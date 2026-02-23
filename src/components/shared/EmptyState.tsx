"use client";

import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

/**
 * Reusable empty state component for when lists/grids have no content.
 */
export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div
            role="status"
            aria-label={title}
            className={cn(
                "flex flex-col items-center justify-center py-20 text-center px-4",
                className
            )}
        >
            {Icon && (
                <div
                    className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5"
                    aria-hidden="true"
                >
                    <Icon className="h-8 w-8 text-muted-foreground opacity-60" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <Button
                    variant="outline"
                    className="mt-6 gap-2 rounded-xl"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
