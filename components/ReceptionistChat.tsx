"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadData {
  name?: string;
  contact?: string;
  enquiryType?: string;
}

// Public handle so parent components can pre-fill the input
export interface ReceptionistChatHandle {
  setInputValue: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BRAND = {
  background: "#FAFAF8",
  primary: "#1C1E21",
  accent: "#1A73E8",
  surface: "#F0EFEB",
  border: "#D6D5D0",
  secondaryText: "#5F6368",
} as const;

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi there! Thanks for reaching out to Bunbury AI. I'm the AI receptionist — I can help you with a quote, booking, or any questions about our services. What can I help you with today?",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ReceptionistHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.875rem 1.25rem",
        borderBottom: `1px solid ${BRAND.border}`,
        background: "#fff",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: BRAND.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      {/* Name + status */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <span
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: BRAND.primary,
            lineHeight: 1.2,
          }}
        >
          AI Receptionist
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "0.75rem",
            color: BRAND.secondaryText,
          }}
        >
          {/* Online dot */}
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22C55E",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          Online
        </span>
      </div>
    </div>
  );
}

interface ChatBubbleProps {
  message: Message;
}

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          padding: "0.625rem 0.9375rem",
          borderRadius: isUser
            ? "1.125rem 1.125rem 0.25rem 1.125rem"
            : "1.125rem 1.125rem 1.125rem 0.25rem",
          background: isUser ? BRAND.accent : BRAND.surface,
          color: isUser ? "#fff" : BRAND.primary,
          fontSize: "0.9rem",
          lineHeight: 1.55,
          wordBreak: "break-word",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          padding: "0.625rem 0.9375rem",
          borderRadius: "1.125rem 1.125rem 1.125rem 0.25rem",
          background: BRAND.surface,
          fontSize: "0.9rem",
          color: BRAND.secondaryText,
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <span style={{ letterSpacing: "0.15em" }}>•••</span>
      </div>
    </div>
  );
}

interface LeadCapturedBannerProps {
  leadData: LeadData | null;
}

function LeadCapturedBanner({ leadData }: LeadCapturedBannerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.625rem",
        padding: "0.875rem 1.25rem",
        background: "#F0FDF4",
        borderTop: "1px solid #BBF7D0",
      }}
    >
      {/* Checkmark icon */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#22C55E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "0.05rem",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="2 6 5 9 10 3" />
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#166534",
            lineHeight: 1.3,
          }}
        >
          Lead captured
        </span>
        <span style={{ fontSize: "0.8125rem", color: "#15803D", lineHeight: 1.4 }}>
          {leadData?.name
            ? `Great news, ${leadData.name}! We have your details and will be in touch within 24 hours.`
            : "Great news! We have your details and will be in touch within 24 hours."}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const ReceptionistChat = forwardRef<ReceptionistChatHandle>(
  function ReceptionistChat(_props, ref) {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [leadCaptured, setLeadCaptured] = useState(false);
    const [leadData, setLeadData] = useState<LeadData | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose a handle so the parent page can pre-fill the input
    useImperativeHandle(ref, () => ({
      setInputValue(value: string) {
        setInput(value);
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const text = input.trim();
      if (!text || loading) return;

      const userMessage: Message = { role: "user", content: text };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Something went wrong");
        }

        setMessages([
          ...updatedMessages,
          { role: "assistant", content: data.content },
        ]);

        if (data.leadCaptured && !leadCaptured) {
          setLeadCaptured(true);
          setLeadData(data.leadData ?? null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to send message"
        );
      } finally {
        setLoading(false);
      }
    }

    const canSubmit = !loading && input.trim().length > 0;

    return (
      <div
        style={{
          border: `1px solid ${BRAND.border}`,
          borderRadius: "0.875rem",
          overflow: "hidden",
          background: "#fff",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <ReceptionistHeader />

        {/* Messages */}
        <div
          style={{
            height: 420,
            overflowY: "auto",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
            background: BRAND.background,
          }}
        >
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
          ))}

          {loading && <TypingIndicator />}

          {error && (
            <div
              style={{
                padding: "0.625rem 0.9375rem",
                background: "#FEF2F2",
                color: "#DC2626",
                borderRadius: "0.5rem",
                fontSize: "0.8375rem",
                border: "1px solid #FECACA",
              }}
            >
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Lead captured banner */}
        {leadCaptured && <LeadCapturedBanner leadData={leadData} />}

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            borderTop: `1px solid ${BRAND.border}`,
            background: "#fff",
            alignItems: "center",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.625rem 0.9375rem",
              border: `1px solid ${BRAND.border}`,
              borderRadius: "2rem",
              fontSize: "0.9rem",
              background: BRAND.background,
              outline: "none",
              color: BRAND.primary,
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = BRAND.accent;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = BRAND.border;
            }}
          />
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Send message"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: canSubmit ? BRAND.accent : BRAND.border,
              border: "none",
              cursor: canSubmit ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            {/* Paper-plane send icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "0.5rem",
            fontSize: "0.7rem",
            color: BRAND.secondaryText,
            background: BRAND.background,
            borderTop: `1px solid ${BRAND.border}`,
            letterSpacing: "0.01em",
          }}
        >
          Powered by Bunbury AI
        </div>
      </div>
    );
  }
);
