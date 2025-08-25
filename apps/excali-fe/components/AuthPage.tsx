"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../packages/ui/src";
import { BACKEND_URL } from "@/app/config";

interface InputProps {
  id?: string;
  type?: "text" | "email" | "password";
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  showPasswordToggle?: boolean;
}

function Input({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  showPasswordToggle = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  const baseClasses = "w-full px-6 py-4 text-lg bg-gray-800 border-2 text-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500";
  
  const stateClasses = isFocused 
    ? "border-cyan-500 focus:border-cyan-500" 
    : "border-gray-600 focus:border-cyan-500";

  const classes = `${baseClasses} ${stateClasses}`;

  return (
    <div className="space-y-3">
      {label && (
        <label htmlFor={id} className="block text-gray-300 text-md font-medium">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={classes}
        />
        
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 p-1 rounded w-6 h-6"
          >
            {showPassword ? (
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function Authpage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignin ? `${BACKEND_URL}/signin` : `${BACKEND_URL}/signup`;
      const body = isSignin ? { email, password } : { email, password, name };

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
        window.location.href = "/rooms";
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
