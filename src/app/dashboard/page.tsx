"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardGrid } from "@/components/Card";
import { RoleBadge, Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
    User,
    Building2,
    Package,
    Plus,
    ArrowRight,
    ShieldCheck,
    Loader2
} from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back! 👋
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage your OX System account and company.
                    </p>
                </div>

                <CardGrid className="md:grid-cols-2 lg:grid-cols-2">
                    <Card title="Your Account" className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <User className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{user.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <RoleBadge role={user.role} />
                                        {user.role === "admin" && (
                                            <Badge variant="success">
                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Company Status">
                        {user.companyId ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Company Connected</p>
                                        <p className="text-sm text-gray-500">ID: {user.companyId}</p>
                                    </div>
                                </div>
                                {user.role === "admin" && (
                                    <Link href="/companies">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Building2 className="w-4 h-4 mr-2" />
                                            Manage Company
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">No Company</p>
                                        <p className="text-sm text-gray-500">Register to get started</p>
                                    </div>
                                </div>
                                <Link href="/register">
                                    <Button size="sm" className="w-full">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Register Company
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </CardGrid>

                {user.companyId && (
                    <div className="mt-8">
                        <Card>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Products</h3>
                                        <p className="text-sm text-gray-500">
                                            View and manage your OX products
                                        </p>
                                    </div>
                                </div>
                                <Link href="/products">
                                    <Button>
                                        View Products
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                )}

                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Quick Info</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <strong>Manager:</strong> Can view products from OX System
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            <strong>Admin:</strong> Can manage company and delete it if needed
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            First user to register a company becomes its <strong>Admin</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
