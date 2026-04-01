"use client";

import { useState } from "react";
import Link from "next/link";
import { Swords, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");
    const result = await registerAction(formData);
    if (result?.error) setError(result.error);
    if (result?.success) setSuccess(result.success);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)] flex items-center justify-center p-4">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--magenta) 1px, transparent 1px),
            linear-gradient(90deg, var(--magenta) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[var(--magenta)] rounded-full blur-[200px] opacity-[0.03]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 border border-[var(--magenta)] flex items-center justify-center glow-magenta-subtle"
                 style={{ borderRadius: "4px" }}>
              <Swords className="w-5 h-5 text-[var(--magenta)]" />
            </div>
            <span className="text-2xl font-bold font-[family-name:var(--font-heading)] tracking-tight text-glow-magenta">
              THESISQUEST
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight">
            CREATE ACCOUNT
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Begin your research quest today
          </p>
        </div>

        {/* Register Form */}
        <div className="card-cyber-accent p-8" style={{ borderRadius: "4px" }}>
          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 border border-[var(--red)] bg-[var(--red-glow)] text-[var(--red)] text-sm"
                   style={{ borderRadius: "4px" }}>
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 border border-[var(--emerald)] bg-[var(--emerald-glow)] text-[var(--emerald)] text-sm flex items-center gap-2"
                   style={{ borderRadius: "4px" }}>
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-[family-name:var(--font-heading)]">
                Full Name
              </Label>
              <Input id="name" name="name" type="text" placeholder="Juan Dela Cruz" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-[family-name:var(--font-heading)]">
                Email
              </Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-[family-name:var(--font-heading)]">
                Role
              </Label>
              <Select name="role" defaultValue="STUDENT">
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--bg-card)] border-[var(--border-subtle)]">
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="TEACHER">Teacher</SelectItem>
                </SelectContent>
              </Select>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--magenta)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[var(--text-secondary)] text-xs uppercase tracking-wider font-[family-name:var(--font-heading)]">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--magenta)] text-white hover:bg-[var(--magenta-dim)] btn-cyber text-xs py-5 glow-magenta-subtle"
              style={{ borderRadius: "4px" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-dim)] text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--cyan)] hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}