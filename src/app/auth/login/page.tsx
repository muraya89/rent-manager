"use client";

import { useEffect, useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("registered") === "1") {
      setSuccess("Your account has been created. You can now sign in.");
    }

    if (params.get("error")) {
      setError("Your session could not be verified. Please sign in again.");
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/dashboard";

      const result = await signIn("credentials", {
        identifier: identifier.trim(),
        password,
        redirect: false,
        callbackUrl: next,
      });

      if (result?.error) {
        setError("Invalid username/email or password. Please try again.");
        return;
      }

      if (result?.ok) {
        router.push(result.url || next);
        router.refresh();
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--main-text)] w-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: Login form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <a className="brand" href="#top" aria-label="rentwise home">
              <span className="brand-mark">r</span>
              <span>RentWise</span>
            </a>

            <div className="my-8">
              <p
                className="mb-3 text-sm font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--secondary)" }}
              >
                Welcome back
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sign in to your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Manage your properties, tenants, and rental activities from one
                convenient place.
              </p>
            </div>

            {success && (
              <div
                role="status"
                className="mb-5 rounded-xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "rgba(25,135,84,0.25)",
                  backgroundColor: "rgba(25,135,84,0.08)",
                  color: "var(--success)",
                }}
              >
                {success}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "rgba(220,53,69,0.25)",
                  backgroundColor: "rgba(220,53,69,0.07)",
                  color: "var(--danger)",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-sm font-semibold"
                >
                  Username or email
                </label>

                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full rounded-xl border bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(75,29,41,0.10)]"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </label>

                  {/* Add a forgot-password route here if your app supports it. */}
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border bg-white px-4 py-3.5 pr-20 text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(75,29,41,0.10)]"
                    style={{ borderColor: "var(--color-border)" }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 px-4 text-sm font-semibold transition hover:opacity-70"
                    style={{ color: "var(--primary)" }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: "var(--primary)" }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor =
                      "var(--primary-active)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                }}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-bold transition hover:underline"
                style={{ color: "var(--secondary)" }}
              >
                Create an account
              </Link>
            </p>

            <p className="mt-10 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} RentWise. All rights reserved.
            </p>
          </div>
        </section>

        {/* Right: Brand panel */}
        <aside
          className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

          <div className="relative z-10 max-w-lg px-12 py-16 text-white xl:px-16">
            <div className="mb-8 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide">
              PROPERTY MANAGEMENT, REIMAGINED
            </div>

            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              Your properties.
              <br />
              Your people.
              <br />
              <span style={{ color: "var(--secondary)" }}>
                All in one place.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-white/75">
              Keep track of tenants, manage rental records, and stay on top of
              your property operations with less hassle.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Keep your property records organized",
                "Manage tenants and rental information",
                "Access your workspace in one place",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: "var(--secondary)" }}
                  >
                    ✓
                  </span>
                  <span className="text-sm text-white/90">{item}</span>
                </div>
              ))}
            </div>

            <div
              className="mt-14 h-1 w-20 rounded-full"
              style={{ backgroundColor: "var(--secondary)" }}
            />
            <p className="mt-4 text-sm text-white/50">
              A smarter way to manage your rentals.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
