import { cn } from "@/lib/utils";

interface BadgeProps {
    variant?: "admin" | "manager" | "default" | "success" | "warning" | "error";
    children: React.ReactNode;
    className?: string;
}

const variantClasses = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    manager: "bg-blue-100 text-blue-700 border-blue-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                variantClasses[variant],
                className
            )}
        >
            {children}
        </span>
    );
}

export function RoleBadge({ role }: { role: "admin" | "manager" }) {
    return (
        <Badge variant={role}>
            {role === "admin" ? "Admin" : "Manager"}
        </Badge>
    );
}
