"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { RoleBadge } from "./Badge";
import { useAuth } from "@/contexts/auth-context";
import { LogOut, LayoutDashboard, Package, Building2 } from "lucide-react";

export function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="font-bold text-xl text-blue-600">
                        OX SYSTEM
                    </Link>

                    {isAuthenticated && (
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            {user?.companyId && (
                                <Link
                                    href="/products"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Package className="w-4 h-4" />
                                    Products
                                </Link>
                            )}
                            {user?.role === "admin" && (
                                <Link
                                    href="/companies"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Building2 className="w-4 h-4" />
                                    Company
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isLoading ? (
                        <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
                    ) : isAuthenticated && user ? (
                        <>
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-sm text-gray-600">{user.email}</span>
                                <RoleBadge role={user.role} />
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button size="sm">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
