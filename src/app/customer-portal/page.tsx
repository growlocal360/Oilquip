"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  User,
  Building2,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "request">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request access form state
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqCompany, setReqCompany] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const unauthorizedError = searchParams.get("error") === "unauthorized";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check if user is a portal user
    const { data: portalUser } = await supabase
      .from("portal_users")
      .select("id")
      .eq("email", email)
      .eq("active", true)
      .single();

    if (!portalUser) {
      await supabase.auth.signOut();
      setError(
        "Your account is not authorized to access the customer portal."
      );
      setLoading(false);
      return;
    }

    router.push("/customer-portal/dashboard");
    router.refresh();
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/portal/access-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: reqName,
        email: reqEmail,
        company_name: reqCompany,
        message: reqMessage || null,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Failed to submit request");
      setLoading(false);
      return;
    }

    setRequestSubmitted(true);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Link
        href="/"
        className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to website
      </Link>

      <div className="bg-steel-900 border border-steel-700 rounded-2xl p-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/oilquip-engineering-power-generation-white.svg"
            alt="Oilquip"
            width={180}
            height={45}
            className="h-10 w-auto"
          />
        </div>

        <h1 className="text-2xl font-bold text-steel-100 text-center mb-2">
          Customer Portal
        </h1>
        <p className="text-steel-400 text-center mb-6">
          Access your equipment documentation
        </p>

        {/* Tabs */}
        <div className="flex bg-steel-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => {
              setActiveTab("login");
              setError(null);
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "login"
                ? "bg-steel-700 text-steel-100"
                : "text-steel-400 hover:text-steel-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab("request");
              setError(null);
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "request"
                ? "bg-steel-700 text-steel-100"
                : "text-steel-400 hover:text-steel-300"
            }`}
          >
            Request Access
          </button>
        </div>

        {/* Error messages */}
        {(error || unauthorizedError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
          >
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">
              {error ||
                "Your account is not authorized to access the customer portal."}
            </p>
          </motion.div>
        )}

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-steel-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-steel-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25 disabled:shadow-none"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  setError("Enter your email address first, then click Forgot Password.");
                  return;
                }
                setLoading(true);
                setError(null);
                const supabase = createClient();
                const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
                });
                setLoading(false);
                if (resetError) {
                  setError(resetError.message);
                } else {
                  setError(null);
                  alert("Password reset email sent! Check your inbox.");
                }
              }}
              className="w-full text-sm text-accent-400 hover:text-accent-300 transition-colors"
            >
              Forgot your password?
            </button>
          </form>
        )}

        {/* Request Access Form */}
        {activeTab === "request" && !requestSubmitted && (
          <form onSubmit={handleRequestAccess} className="space-y-5">
            <div>
              <label
                htmlFor="req-name"
                className="block text-sm font-medium text-steel-300 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
                <input
                  id="req-name"
                  type="text"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                  placeholder="John Smith"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="req-email"
                className="block text-sm font-medium text-steel-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
                <input
                  id="req-email"
                  type="email"
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="req-company"
                className="block text-sm font-medium text-steel-300 mb-2"
              >
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
                <input
                  id="req-company"
                  type="text"
                  value={reqCompany}
                  onChange={(e) => setReqCompany(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                  placeholder="Acme Corporation"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="req-message"
                className="block text-sm font-medium text-steel-300 mb-2"
              >
                Message{" "}
                <span className="text-steel-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-steel-500" />
                <textarea
                  id="req-message"
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors resize-none"
                  placeholder="Tell us about your equipment or project..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25 disabled:shadow-none"
            >
              {loading ? "Submitting..." : "Request Access"}
            </button>
          </form>
        )}

        {/* Request Submitted Success */}
        {activeTab === "request" && requestSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/10 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-steel-100 mb-2">
              Request Submitted
            </h3>
            <p className="text-steel-400 text-sm">
              We&apos;ve received your access request. Our team will review it
              and get back to you shortly.
            </p>
          </motion.div>
        )}
      </div>

      <p className="text-center text-steel-500 text-sm mt-6">
        Need help?{" "}
        <a
          href="mailto:sales@oilquip.com"
          className="text-accent-400 hover:text-accent-300"
        >
          Contact us
        </a>
      </p>
    </motion.div>
  );
}

function PortalLoginFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-steel-900 border border-steel-700 rounded-2xl p-8 animate-pulse">
        <div className="flex justify-center mb-8">
          <div className="h-10 w-40 bg-steel-800 rounded" />
        </div>
        <div className="h-8 w-40 bg-steel-800 rounded mx-auto mb-2" />
        <div className="h-4 w-56 bg-steel-800 rounded mx-auto mb-8" />
        <div className="space-y-6">
          <div className="h-12 bg-steel-800 rounded" />
          <div className="h-12 bg-steel-800 rounded" />
          <div className="h-12 bg-steel-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function CustomerPortalPage() {
  return (
    <div className="min-h-screen bg-steel-950 flex items-center justify-center p-4">
      <Suspense fallback={<PortalLoginFallback />}>
        <PortalLoginForm />
      </Suspense>
    </div>
  );
}
