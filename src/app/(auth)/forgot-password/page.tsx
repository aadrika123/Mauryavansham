"use client";

import { useToast } from "@/src/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // NEW state
  const router = useRouter();
  const { toast } = useToast();

  async function requestOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP sent to your email");
        setStep("otp");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-reset", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setMessage("OTP verified, enter new password");
        setStep("reset");
      } else {
        setError(data.error || "OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, newPassword }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password updated successfully");

        setStep("email");
        router.push("/sign-in");
        toast({
          title: "Password updated successfully 🎉",
          description: "Welcome back!",
        });
      } else {
        setError(data.error || "Password reset failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-orange-50 p-20">
      <div className="max-w-md mx-auto p-6 bg-yellow-50 rounded-md shadow-md border border-yellow-200">
        <h2 className="text-2xl font-semibold text-center mb-6 text-red-700">
          Forgot Password
        </h2>

        {error && (
          <div className="mb-4 p-3 text-red-800 bg-red-100 rounded border border-red-300">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 text-green-800 bg-green-100 rounded border border-green-300">
            {message}
          </div>
        )}

        {step === "email" && (
          <>
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-red-700"
            >
              Enter your registered email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <button
              onClick={requestOtp}
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded transition duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Request OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="mb-4 text-gray-700 text-center">
              OTP sent to <span className="font-medium">{email}</span>
            </p>
            <label
              htmlFor="otp"
              className="block mb-2 font-medium text-red-700"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded transition duration-300 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === "reset" && (
          <>
            <label
              htmlFor="newPassword"
              className="block mb-2 font-medium text-red-700"
            >
              Enter new password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              onClick={resetPassword}
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded transition duration-300 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="mt-4 text-center">
          <a
            href="/sign-in"
            className="text-sm text-orange-600 hover:text-orange-800 hover:underline flex items-center justify-center gap-1"
          >
            ← Back to Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
