"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "./ui";
import { HTTP_URL } from "@/app/config";

export function Authpage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignin ? `${HTTP_URL}/signin` : `${HTTP_URL}/signup`;
      const body = isSignin ? { email, password } : { email, password, name, photo };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-200">
          <span className="mr-2">←</span>
          Back to Home
        </Link>

        {/* Auth Card */}
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
              <span className="text-2xl font-bold text-black">
                {isSignin ? "→" : "+"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-400">
              {isSignin 
                ? "Sign in to your account to continue drawing" 
                : "Join thousands of creators and start collaborating"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isSignin && (
              <Input
                id="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChange={setName}
                required
              />
            )}

            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              required
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              required
              showPasswordToggle
            />

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {isSignin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isSignin ? "Don't have an account? " : "Already have an account? "}
              <Link
                href={isSignin ? "/signup" : "/signin"}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
              >
                {isSignin ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
