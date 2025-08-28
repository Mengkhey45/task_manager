// app/auth/signin/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resp = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setError(json.message ?? json.status ?? "Sign in failed");
        setLoading(false);
        return;
      }

      // success
      router.push("/");
    } catch (e) {
      setError((e as Error).message ?? "Sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Don't have an account? {" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
