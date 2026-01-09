import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
    className?: string;
}

export function Table<T>({
    data,
    columns,
    keyExtractor,
    emptyMessage = "No data available",
    className,
}: TableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-8 text-center text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={cn("overflow-hidden rounded-xl border border-gray-100", className)}>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className={cn(
                                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500",
                                    col.className
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.map((item) => (
                        <tr key={keyExtractor(item)} className="transition-colors hover:bg-gray-50">
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className={cn("px-4 py-3 text-sm text-gray-900", col.className)}
                                >
                                    {col.render
                                        ? col.render(item)
                                        : String((item as Record<string, any>)[col.key as string] ?? "")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages?: number;
    hasMore?: boolean;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, hasMore, onPageChange }: PaginationProps) {
    const canGoPrev = currentPage > 1;
    const canGoNext = totalPages ? currentPage < totalPages : hasMore;

    return (
        <div className="flex items-center justify-between px-4 py-3">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrev}
                className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    canGoPrev
                        ? "text-gray-700 hover:bg-gray-100"
                        : "cursor-not-allowed text-gray-300"
                )}
            >
                Previous
            </button>

            <span className="text-sm text-gray-600">
                Page {currentPage}
                {totalPages && ` of ${totalPages}`}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
                className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    canGoNext
                        ? "text-gray-700 hover:bg-gray-100"
                        : "cursor-not-allowed text-gray-300"
                )}
            >
                Next
            </button>
        </div>
    );
}
