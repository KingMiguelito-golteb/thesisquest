"use client";

import { useState } from "react";
import Link from "next/link";
import { Swords, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)] flex items-center justify-center p-4">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--cyan) 1px, transparent 1px),
            linear-gradient(90deg, var(--cyan) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[var(--cyan)] rounded-full blur-[200px] opacity-[0.03]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[var(--magenta)] rounded-full blur-[200px] opacity-[0.03]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 border border-[var(--cyan)] flex items-center justify-center glow-cyan-subtle"
                 style={{ borderRadius: "4px" }}>
              <Swords className="w-5 h-5 text-[var(--cyan)]" />
            </div>
            <span className="text-2xl font-bold font-[family-name:var(--font-heading)] tracking-tight text-glow-cyan">
              THESISQUEST
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight">
            WELCOME BACK
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Log in to continue your research quest
          </p>
        </div>

        {/* Login Form */}
        <div className="card-cyber-accent p-8" style={{ borderRadius: "4px" }}>
          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 border border-[var(--red)] bg-[var(--red-glow)] text-[var(--red)] text-sm"
                   style={{ borderRadius: "4px" }}>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-[family-name:var(--font-heading)]">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-[family-name:var(--font-heading)]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--cyan)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--cyan)] text-black hover:bg-[var(--cyan-dim)] btn-cyber text-xs py-5 glow-cyan-subtle"
              style={{ borderRadius: "4px" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                "LOG IN"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-dim)] text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[var(--magenta)] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Test Accounts */}
        <div className="mt-6 p-4 border border-[var(--border-subtle)] bg-[var(--bg-card)]"
             style={{ borderRadius: "4px" }}>
          <p className="text-[10px] text-[var(--gold)] font-[family-name:var(--font-heading)] uppercase tracking-widest mb-2">
            ⚡ Test Accounts (password: password123)
          </p>
          <div className="space-y-1 text-xs text-[var(--text-dim)]">
            <p><span className="text-[var(--text-secondary)]">Admin:</span> admin@thesisquest.com</p>
            <p><span className="text-[var(--text-secondary)]">Teacher:</span> garcia@thesisquest.com</p>
            <p><span className="text-[var(--text-secondary)]">Student:</span> king@thesisquest.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}