"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // In a real app, you shouldn't expose the OTP, but for this demo/mock backend it returns it
    const [debugOtp, setDebugOtp] = useState("");

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await api.login(email);
            // Backend returns { otp: "..." }
            setDebugOtp(data.otp);
            setStep("otp");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await api.verify(email, otp);
            // Save token via auth context
            login(data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        {step === "email" ? "Sign In" : "Enter OTP"}
                    </h2>
                    {step === "otp" && (
                        <p className="mt-2 text-sm text-gray-600">
                            Code sent to {email}
                        </p>
                    )}
                </div>

                {step === "email" ? (
                    <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
                        <div className="rounded-md shadow-sm">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="relative block w-full rounded-xl border-0 py-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-4 bg-white"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}

                        <div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Continue"}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
                        {debugOtp && (
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl text-sm text-yellow-800 border border-yellow-200">
                                <strong>Demo Mode:</strong> Your OTP is <span className="font-mono font-bold">{debugOtp}</span>
                            </div>
                        )}

                        <div className="rounded-md shadow-sm">
                            <div>
                                <label htmlFor="otp" className="sr-only">
                                    OTP Code
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="relative block w-full rounded-xl border-0 py-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-4 tracking-[0.5em] text-center text-xl font-mono bg-white"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify & Login"}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => { setStep("email"); setOtp(""); setDebugOtp(""); }}
                                className="w-full"
                            >
                                Use different email
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
