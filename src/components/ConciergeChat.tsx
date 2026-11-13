"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Send, ShieldCheck, AlertCircle } from "lucide-react";

export interface SupportMessage {
  id: string;
  user_id: string;
  sender_role: "client" | "admin";
  subject: string | null;
  body: string;
  created_at: string;
}

export default function ConciergeChat({
  userId,
  messages,
}: {
  userId: string;
  messages: SupportMessage[];
}) {
  const supabase = createClient();
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!body.trim()) return;

    setLoading(true);

    const { error: insertError } = await supabase.from("messages").insert({
      user_id: userId,
      sender_role: "client",
      subject: subject.trim() || "Client Desk Inquiry",
      body: body.trim(),
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSubject("");
    setBody("");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Message Thread */}
      <div className="bg-[#101720] border border-white/10 p-6 md:p-8 min-h-85 max-h-120 overflow-y-auto space-y-5 rounded-2xl">
        {messages.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <ShieldCheck size={32} className="text-[#D6B77A] mb-3" />
            <p className="text-sm text-gray-300 font-serif">
              Aurelia Private Client Desk
            </p>
            <p className="text-xs text-gray-500 max-w-sm mt-2 leading-relaxed">
              Submit an inquiry below regarding wire authorizations, account
              limits, or private advisory services.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isClient = msg.sender_role === "client";
            return (
              <div
                key={msg.id}
                style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
                className={`flex flex-col ${
                  isClient ? "items-end" : "items-start"
                } motion-enter`}
              >
                <div
                  className={`max-w-lg p-4 border rounded-2xl ${
                    isClient
                      ? "bg-[#C5A46D]/10 border-[#C5A46D]/30 text-white"
                      : "bg-[#080C12] border-white/15 text-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-[#D6B77A]">
                      {isClient ? "You" : "Aurelia Concierge"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(msg.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {msg.subject && isClient && (
                    <p className="text-xs font-semibold text-gray-300 mb-1">
                      {msg.subject}
                    </p>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.body}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Compose Message Form */}
      <form
        onSubmit={handleSendMessage}
        className="bg-[#101720] border border-white/10 p-6 md:p-8 space-y-5 rounded-2xl"
      >
        <div>
          <label className="text-xs uppercase tracking-widest text-gray-400">
            Subject (Optional)
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Wire Transfer Authorization Assistance"
            className="w-full mt-2 p-3.5 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-gray-400">
            Message to Customer Service
          </label>
          <textarea
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe how our private client desk can assist you..."
            className="w-full mt-2 p-3.5 bg-[#080C12] border border-white/10 outline-none focus:border-[#C5A46D] text-sm resize-none rounded-lg"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          disabled={loading}
          className="bg-[#C5A46D] text-[#080C12] px-6 py-3.5 font-semibold text-sm inline-flex items-center gap-2 hover:bg-[#D9BC89] transition disabled:opacity-50 cursor-pointer rounded-lg motion-control"
        >
          {loading ? "Dispatching..." : "Send to Concierge"}
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
