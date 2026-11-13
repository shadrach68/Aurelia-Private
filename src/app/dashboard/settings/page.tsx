import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ClientSidebar from "@/components/ClientSidebar";
import AvatarUploader from "@/components/AvatarUploader";

export const instant = false;

export default async function SettingsPage() {
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
    .select("*")
    .eq("id", user.id)
    .single();

  const fullName =
    profile?.full_name || user.user_metadata?.full_name || "Private Client";

  return (
    <main className="min-h-screen bg-[#080C12] text-white">
      <ClientSidebar isAdmin={profile?.role === "admin"} />

      <section className="md:ml-64 p-6 md:p-12">
        <header className="mb-10">
          <p className="text-gray-500 text-sm">Client Profile & Preferences</p>
          <h2 className="text-3xl font-serif mt-2">Account Settings</h2>
        </header>

        <div className="max-w-2xl space-y-8">
          {/* Profile Photo Section */}
          <div className="bg-[#101720] border border-white/10 p-8">
            <h3 className="text-xl font-serif mb-2">Profile Portrait</h3>
            <p className="text-gray-400 text-xs mb-6">
              Personalize your private banking profile.
            </p>

            <AvatarUploader
              userId={user.id}
              fullName={fullName}
              currentAvatarUrl={profile?.avatar_url || null}
            />
          </div>

          {/* Read-Only Client Credentials */}
          <div className="bg-[#101720] border border-white/10 p-8 space-y-5">
            <h3 className="text-xl font-serif mb-2">Client Credentials</h3>

            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              <div className="bg-[#080C12] border border-white/10 p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Full Name
                </p>
                <p className="text-white mt-1.5">{fullName}</p>
              </div>

              <div className="bg-[#080C12] border border-white/10 p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Account Number
                </p>
                <p className="font-mono text-[#D6B77A] mt-1.5">
                  {profile?.account_number || "Pending"}
                </p>
              </div>

              <div className="bg-[#080C12] border border-white/10 p-4 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Registered Email
                </p>
                <p className="text-gray-300 mt-1.5">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
