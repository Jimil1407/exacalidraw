"use client"
import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../../../../packages/ui/src";

export default function CreateRoomPage() {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const trimmed = slug.trim();
      if (!trimmed) throw new Error("Room name is required");

      const existing = await axios.get(`${BACKEND_URL}/room/${trimmed}`);
      if (existing.data?.room) {
        window.location.href = `/canvas/${existing.data.room.slug}`;
        return;
      }

      await axios.post(`${BACKEND_URL}/create-room`, { slug: trimmed });
      const created = await axios.get(`${BACKEND_URL}/room/${trimmed}`);
      if (created.data?.room) {
        window.location.href = `/canvas/${created.data.room.slug}`;
        return;
      }

      throw new Error("Room not found after creation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create/join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors duration-200">
          <span className="mr-2">←</span>
          Back to Home
        </Link>

        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
              <span className="text-2xl font-bold text-black">#</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create or Join a Room</h1>
            <p className="text-gray-400">Enter a room name (slug) to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="slug" className="block text-gray-300 text-md font-medium">
                Room Name<span className="text-red-400 ml-1">*</span>
              </label>
              <input
                id="slug"
                type="text"
                placeholder="e.g. design-sync"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-6 py-4 text-lg bg-gray-800 border-2 text-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 border-gray-600 focus:border-cyan-500"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Continue
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-500 text-sm">
            Rooms help you collaborate and keep drawings organized.
          </div>
        </div>
      </div>
    </div>
  );
}