"use client"

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid authentication token");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-[var(--panel)] rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-center text-[var(--text)]">VocabRecall</h1>
          <h2 className="mt-2 text-center text-[var(--text-secondary)]">Session invalid/expired. Please login.</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-[var(--text-secondary)]">
              Auth Token
            </label>
            <input
              id="token"
              name="token"
              type="password"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
              placeholder="Enter your authentication token"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
