"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-3 text-sm text-gray-500 hover:text-red-400 cursor-pointer transition disabled:opacity-50"
    >
      <LogOut size={19} />
      {loading ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
