"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/auth-context";
import {
  ArrowRight,
  ShieldCheck,
  Package,
  Building2,
  Zap,
  Lock,
  Users
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            OX System Integration Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">OX Business</span>
            <br />From One Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect your OX System account, register companies, and manage products all in one place.
          </p>

          <div className="flex justify-center gap-4">
            {isLoading ? (
              <div className="h-11 w-32 animate-pulse rounded-full bg-gray-200" />
            ) : isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                {!user?.companyId && (
                  <Link href="/register">
                    <Button variant="outline" size="lg">
                      Register Company
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            A complete solution for managing your OX System integration
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure Authentication
              </h3>
              <p className="text-gray-600 text-sm">
                Email-based OTP login with JWT tokens. No passwords to remember or leak.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Company Management
              </h3>
              <p className="text-gray-600 text-sm">
                Register companies with OX API tokens. First user becomes Admin, others become Managers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-100">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Product Listings
              </h3>
              <p className="text-gray-600 text-sm">
                View paginated products directly from your OX System. Real-time sync with your inventory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Role-Based Access
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Admin</h3>
                  <p className="text-sm text-gray-500">Full company control</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  View products from OX System
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Manage company settings
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Delete company (irreversible)
                </li>
              </ul>
            </div>

            {/* Manager */}
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Manager</h3>
                  <p className="text-sm text-gray-500">Product access</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  View products from OX System
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Access company dashboard
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="line-through">Company management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-5xl text-center text-sm text-gray-500">
          <p>OX System Integration Platform • Built for retailers</p>
        </div>
      </footer>
    </main>
  );
}
