"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/Modal";
import {
    ArrowLeft,
    Building2,
    Loader2,
    Trash2,
    AlertTriangle,
    ShieldCheck,
    Users
} from "lucide-react";

export default function CompaniesPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, updateUser, logout } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!isLoading && user?.role !== "admin") {
            router.push("/dashboard");
        }
    }, [isLoading, user?.role, router]);

    const handleDeleteCompany = async () => {
        if (!user?.companyId) return;

        setDeleting(true);
        setError("");

        try {
            await api.deleteCompany(user.companyId);

            updateUser({ companyId: undefined, role: "manager" });
            setShowDeleteModal(false);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
            setDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (user?.role !== "admin") {
        return null;
    }

    return (
        <main className="min-h-screen pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                            <p className="text-sm text-gray-500">
                                Manage your company settings
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Company #{user?.companyId}
                                    </h2>
                                    <Badge variant="success">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        Active
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    You are the admin of this company
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm">Your Role</span>
                                </div>
                                <Badge variant="admin">Admin</Badge>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Building2 className="w-4 h-4" />
                                    <span className="text-sm">Company ID</span>
                                </div>
                                <p className="font-mono font-semibold text-gray-900">
                                    {user?.companyId}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border-red-200 bg-red-50/50">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900">Danger Zone</h3>
                            <p className="text-sm text-red-700 mt-1">
                                Deleting your company will remove all associations. All users will become unlinked managers.
                                This action cannot be undone.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Company
                            </Button>
                        </div>
                    </div>
                </Card>

                {error && (
                    <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                        {error}
                    </div>
                )}

                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteCompany}
                    title="Delete Company"
                    description="Are you sure you want to delete this company? All users will be unlinked and become managers. This action cannot be undone."
                    confirmText="Yes, Delete Company"
                    cancelText="Cancel"
                    isLoading={deleting}
                    variant="danger"
                />
            </div>
        </main>
    );
}
