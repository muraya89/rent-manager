"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import { signIn } from "next-auth/react";
import { FormGroup, Label } from "reactstrap";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const initialValues = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const PlainInput = ({ field, form, ...props }) => {
    return (
      <input
        {...field}
        {...props}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(75,29,41,0.10)]"
        style={{ borderColor: "var(--color-border)" }}
      />
    );
  };
  const PasswordInput = ({
    field,
    form,
    showPassword,
    setShowPassword,
    ...props
  }) => {
    return (
      <div className="relative">
        <input
          {...field}
          {...props}
          type={showPassword ? "text" : "password"}
          className="w-full rounded-xl border bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(75,29,41,0.10)]"
          style={{ borderColor: "var(--color-border)" }}
        />

        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="absolute inset-y-0 right-0 px-4 text-sm font-semibold transition hover:opacity-70"
          style={{ color: "var(--primary)" }}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    );
  };

  async function handleSubmit(values: typeof initialValues) {
    setError("");

    if (values.password !== values.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (values.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create the account.
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "We couldn't create your account.");
        return;
      }

      // Step 2: Sign in using the newly created account.
      const loginResult = await signIn("credentials", {
        identifier: values.username.trim(),
        password: values.password,
        redirect: false,
      });

      // The account exists even if automatic login fails.
      if (!loginResult || loginResult.error || !loginResult.ok) {
        router.push("/login?registered=1");
        return;
      }

      // Step 3: Redirect after successful authentication.
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");

      // Avoid redirecting to an external or protocol-relative URL.
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/dashboard";

      router.push(safeNext);
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-(--background) text-(--main-text) w-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: Signup form */}
        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <a className="brand" href="#top" aria-label="rentwise home">
              <span className="brand-mark">r</span>
              <span>RentWise</span>
            </a>

            <div className="my-6">
              <p
                className="mb-2 text-sm font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--secondary)" }}
              >
                Get started
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Set up your account to get started with RentWise.
              </p>
            </div>

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

            <Formik
              initialValues={initialValues}
              onSubmit={(values) => handleSubmit(values)}
            >
              <Form className="space-y-4">
                <FormGroup>
                  <Label for="name">Full Name</Label>
                  <Field
                    id="name"
                    component={PlainInput}
                    name="name"
                    type="text"
                    required
                    placeholder="e.g., John Doe"
                  ></Field>
                </FormGroup>

                <FormGroup>
                  <Label for="username">Username</Label>
                  <Field
                    id="username"
                    component={PlainInput}
                    name="username"
                    type="text"
                    required
                    placeholder="e.g., johndoe"
                  ></Field>
                </FormGroup>

                <FormGroup>
                  <Label for="email">Email Address</Label>
                  <Field
                    id="email"
                    component={PlainInput}
                    name="email"
                    type="email"
                    required
                    placeholder="e.g., user@example.com"
                  ></Field>
                </FormGroup>

                <FormGroup>
                  <Label for="password">Password</Label>

                  <Field
                    id="password"
                    component={PasswordInput}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create a password (at least 8 characters)"
                    required
                    minLength={8}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Field
                    id="confirmPassword"
                    component={PasswordInput}
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    required
                    minLength={8}
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                  />
                </FormGroup>

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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>

                <p className="pt-1 text-center text-xs leading-5 text-gray-500">
                  By creating an account, you agree to use RentWise responsibly
                  and keep your login credentials secure.
                </p>
              </Form>
            </Formik>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold transition hover:underline"
                style={{ color: "var(--secondary)" }}
              >
                Sign in
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-gray-400">
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
              WELCOME TO RENTWISE
            </div>

            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              Better property
              <br />
              management starts
              <br />
              <span style={{ color: "var(--secondary)" }}>right here.</span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-white/75">
              Bring your rental management activities together in one organized
              workspace designed to make your work easier.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <span
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: "var(--secondary)" }}
                >
                  ✓
                </span>
                <p className="font-semibold">Stay organized</p>
                <p className="mt-2 text-sm leading-5 text-white/60">
                  Keep important rental information together.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <span
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: "var(--secondary)" }}
                >
                  ↗
                </span>
                <p className="font-semibold">Work smarter</p>
                <p className="mt-2 text-sm leading-5 text-white/60">
                  Simplify everyday property management tasks.
                </p>
              </div>
            </div>

            <div
              className="mt-12 h-1 w-20 rounded-full"
              style={{ backgroundColor: "var(--secondary)" }}
            />
            <p className="mt-4 text-sm text-white/50">
              Your property management journey starts here.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
