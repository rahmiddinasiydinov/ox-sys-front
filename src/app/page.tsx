"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/auth-context";
import {
  ArrowRight,
  Zap,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <main className="min-h-screen flex flex-col">
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            OX System Integration Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r bg-blue-600 ">OX Business</span>
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

      <footer className="mt-auto py-8 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-5xl text-center text-sm text-gray-500">
          <p>OX System Integration Platform • Built for retailers</p>
        </div>
      </footer>
    </main>
  );
}
