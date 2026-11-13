"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#080C12] flex items-center justify-center px-6 py-12 text-white">

      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-serif tracking-[0.2em] text-[#D6B77A]">
            AURELIA
          </Link>

          <p className="text-gray-500 text-[10px] tracking-[0.4em] mt-2">
            PRIVATE BANKING EXPERIENCE
          </p>
        </div>

        <div className="border border-white/10 bg-[#101720] p-8 md:p-10 rounded-2xl motion-card motion-enter">

          <h1 className="font-serif text-3xl mb-3">
            Welcome Back
          </h1>

          <p className="text-gray-400 text-sm mb-8">
            Sign in to access your account.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label className="text-sm text-gray-300">
                Email Address
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full mt-2 p-4 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-4 pr-12 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D6B77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A46D]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              disabled={loading}
              className="w-full bg-[#C5A46D] text-[#080C12] py-4 font-semibold flex items-center justify-center gap-3 hover:bg-[#D9BC89] disabled:opacity-50 rounded-lg motion-control"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#D6B77A]">
              Register
            </Link>
          </div>

        </div>

        <p className="text-center text-gray-600 text-xs mt-8 flex justify-center gap-2">
          <ShieldCheck size={15} />
          Secure account authentication
        </p>

      </div>
    </main>
  );
}
