"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi there! Thanks for reaching out to Bunbury AI. I'm the AI receptionist — I can help you with a quote, booking, or any questions about our services. What can I help you with today?",
};

export function ReceptionistChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        border: "1px solid #D6D5D0",
        borderRadius: "0.75rem",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Messages */}
      <div
        style={{
          height: 420,
          overflowY: "auto",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "0.625rem 0.875rem",
                borderRadius:
                  msg.role === "user"
                    ? "1rem 1rem 0.25rem 1rem"
                    : "1rem 1rem 1rem 0.25rem",
                background: msg.role === "user" ? "#1A73E8" : "#F0EFEB",
                color: msg.role === "user" ? "#fff" : "#1C1E21",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "0.625rem 0.875rem",
                borderRadius: "1rem 1rem 1rem 0.25rem",
                background: "#F0EFEB",
                color: "#5F6368",
                fontSize: "0.9rem",
              }}
            >
              Typing…
            </div>
          </div>
        )}
        {error && (
          <div
            style={{
              padding: "0.5rem 0.875rem",
              background: "#fef2f2",
              color: "#dc2626",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "0.75rem 1rem",
          borderTop: "1px solid #D6D5D0",
          background: "#FAFAF8",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.625rem 0.875rem",
            border: "1px solid #D6D5D0",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
            background: "#fff",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: "0.625rem 1.125rem",
            background: loading || !input.trim() ? "#D6D5D0" : "#1A73E8",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: loading || !input.trim() ? "default" : "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
