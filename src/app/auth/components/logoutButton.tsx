"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await signOut({
        callbackUrl: "/auth/login",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition hover:text-red-600 disabled:opacity-60"
      style={{ color: "var(--foreground)" }}
    >
      <span aria-hidden="true">↪</span>
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
