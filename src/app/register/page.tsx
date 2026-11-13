"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Registration successful. Please check your email for verification."
    );
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
            Create your account
          </h1>

          <p className="text-gray-400 text-sm mb-8">
            Register to access your private client portal.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">

            <div>
              <label className="text-sm text-gray-300">
                Full Name
              </label>

              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                placeholder="Enter your full name"
                className="w-full mt-2 p-4 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Email Address
              </label>

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
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
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
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

            {message && (
              <p className="text-green-400 text-sm">{message}</p>
            )}

            <button
              disabled={loading}
              className="w-full bg-[#C5A46D] text-[#080C12] py-4 font-semibold flex items-center justify-center gap-3 hover:bg-[#D9BC89] disabled:opacity-50 rounded-lg motion-control"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[#D6B77A]">
              Sign In
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
