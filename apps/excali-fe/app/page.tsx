"use client";

import Link from "next/link";
import { Button } from "../../../packages/ui/src";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg animate-pulse"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            ExcaliDraw
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/signin">
            <Button variant="ghost">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="ghost">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="animate-bounce">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                Draw Together
              </span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
              Real-time collaborative drawing and whiteboarding platform. 
              Create, share, and collaborate with your team in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Drawing Now
                  <span className="ml-2">→</span>
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
              Everything you need for seamless collaboration and creative expression
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✏️</span>
              </div>
              <h3 className="text-cyan-400 text-xl font-semibold mb-2">Real-time Drawing</h3>
              <p className="text-gray-300">
                Draw, sketch, and create with powerful tools in real-time collaboration
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-cyan-400 text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-300">
                Work together with your team in real-time with live cursors and chat
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-cyan-400 text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-300">
                Optimized for speed with instant sync and smooth performance
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-cyan-400 text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-300">
                Your data is protected with enterprise-grade security and privacy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 px-2">
            Join thousands of users who are already collaborating and creating amazing things
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Create Free Account
                <span className="ml-2">→</span>
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded"></div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              ExcaliDraw
            </span>
          </div>
          <p className="text-gray-400">
            © 2024 ExcaliDraw. Built by Jimil for creators everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
