import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
}

export function Card({ children, className, title, subtitle }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
                className
            )}
        >
            {(title || subtitle) && (
                <div className="mb-4">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
}

export function CardGrid({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
            {children}
        </div>
    );
}
