import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ClientSidebar from "@/components/ClientSidebar";
import ConciergeChat, { SupportMessage } from "@/components/ConciergeChat";

export const instant = false;

export default async function ConciergePage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: messagesData } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const messages: SupportMessage[] = messagesData || [];

  return (
    <main className="min-h-screen bg-[#080C12] text-white">
      <ClientSidebar isAdmin={profile?.role === "admin"} />

      <section className="p-6 md:p-12 lg:ml-64">
        <header className="mb-10 motion-enter">
          <p className="text-gray-500 text-sm">24/7 Advisory & Support</p>
          <h2 className="text-3xl font-serif mt-2">Private Concierge</h2>
        </header>

        <div className="max-w-3xl motion-enter motion-enter-delay-1">
          <ConciergeChat userId={user.id} messages={messages} />
        </div>
      </section>
    </main>
  );
}
