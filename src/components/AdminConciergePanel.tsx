"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";
import { SupportMessage } from "@/components/ConciergeChat";

interface ClientBasic {
  id: string;
  full_name: string | null;
  email: string | null;
  account_number: string | null;
}

export default function AdminConciergePanel({
  clients,
  allMessages,
}: {
  clients: ClientBasic[];
  allMessages: SupportMessage[];
}) {
  const supabase = createClient();
  const router = useRouter();

  const defaultClientId =
    allMessages[allMessages.length - 1]?.user_id || clients[0]?.id || "";

  const [selectedClientId, setSelectedClientId] = useState(defaultClientId);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const thread = allMessages.filter((m) => m.user_id === selectedClientId);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClientId || !reply.trim()) return;

    setLoading(true);

    await supabase.from("messages").insert({
      user_id: selectedClientId,
      sender_role: "admin",
      subject: "Aurelia Concierge Response",
      body: reply.trim(),
    });

    setLoading(false);
    setReply("");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs uppercase tracking-widest text-gray-400">
          Select Client Thread
        </label>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="w-full mt-2 p-3.5 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm text-white rounded-lg"
        >
          {clients.map((client) => {
            const count = allMessages.filter(
              (m) => m.user_id === client.id
            ).length;
            return (
              <option key={client.id} value={client.id}>
                {client.full_name || client.email} ({client.account_number}) —{" "}
                {count} {count === 1 ? "message" : "messages"}
              </option>
            );
          })}
        </select>
      </div>

      <div className="bg-[#080C12] border border-white/10 p-5 max-h-72 overflow-y-auto space-y-4 rounded-xl">
        {thread.length === 0 ? (
          <p className="text-xs text-gray-500">
            No messages from this client yet.
          </p>
        ) : (
          thread.map((msg) => {
            const isAdmin = msg.sender_role === "admin";
            return (
              <div
                key={msg.id}
                className={`p-3.5 border text-sm rounded-xl ${
                  isAdmin
                    ? "bg-[#C5A46D]/10 border-[#C5A46D]/30 ml-6"
                    : "bg-[#101720] border-white/10 mr-6"
                }`}
              >
                <p className="text-[10px] uppercase tracking-widest text-[#D6B77A] mb-1">
                  {isAdmin ? "Aurelia Concierge (You)" : "Client"}
                </p>
                <p className="text-gray-200 whitespace-pre-wrap">{msg.body}</p>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleReply} className="flex gap-3">
        <input
          required
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type an official concierge response..."
          className="flex-1 p-3.5 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
        />
        <button
          disabled={loading || !selectedClientId}
          className="bg-[#C5A46D] text-[#080C12] px-5 font-semibold text-sm inline-flex items-center gap-2 hover:bg-[#D9BC89] transition disabled:opacity-50 cursor-pointer rounded-lg motion-control"
        >
          {loading ? "..." : "Reply"}
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
