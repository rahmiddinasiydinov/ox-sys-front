"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowLeft, Loader2, Building2, Key, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { Badge } from "@/components/Badge";

export default function RegisterCompanyPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, updateUser } = useAuth();
    const [subdomain, setSubdomain] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState<{ role: string; companyId: number } | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await api.registerCompany(subdomain, token);
            setSuccess({ role: data.role, companyId: data.companyId });
            // Update user context with new company info
            updateUser({ companyId: data.companyId, role: data.role as "admin" | "manager" });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Company Registered!</h2>
                        <p className="mt-2 text-gray-600">
                            Your company <strong>{subdomain}</strong> has been successfully registered.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Your Role</p>
                                <Badge variant={success.role === "admin" ? "admin" : "manager"} className="mt-1">
                                    {success.role === "admin" ? "Admin" : "Manager"}
                                </Badge>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div>
                                <p className="text-sm text-gray-500">Company ID</p>
                                <p className="font-mono font-medium text-gray-900">{success.companyId}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Link href="/dashboard">
                            <Button>Go to Dashboard</Button>
                        </Link>
                        <Link href="/products">
                            <Button variant="outline">View Products</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Register Company
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Connect your OX System company to this dashboard.
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-1">
                                Company Subdomain
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="subdomain"
                                    name="subdomain"
                                    type="text"
                                    required
                                    value={subdomain}
                                    onChange={(e) => setSubdomain(e.target.value)}
                                    className="block w-full rounded-xl border-0 py-4 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm bg-white"
                                    placeholder="my-company"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Your OX subdomain (e.g., <strong>my-company</strong>.ox-sys.com)
                            </p>
                        </div>

                        <div>
                            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                                OX API Token
                            </label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="token"
                                    name="token"
                                    type="password"
                                    required
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="block w-full rounded-xl border-0 py-4 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm bg-white font-mono"
                                    placeholder="ox_xxxxxxxxxxxxxx"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Get this from your OX System dashboard settings
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register Company"}
                        </Button>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> The first user to register a company becomes its <strong>Admin</strong>.
                            Subsequent users joining the same company will be <strong>Managers</strong>.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
