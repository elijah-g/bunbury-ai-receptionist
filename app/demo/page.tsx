"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  ReceptionistChat,
  ReceptionistChatHandle,
} from "@/components/ReceptionistChat";

// ---------------------------------------------------------------------------
// Prompt chip suggestions
// ---------------------------------------------------------------------------

const PROMPT_CHIPS = [
  "I need a quote for a hot water system replacement",
  "Can I book an AI audit for my business?",
  "What services do you offer?",
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DemoPage() {
  const chatRef = useRef<ReceptionistChatHandle>(null);

  function handleChipClick(prompt: string) {
    chatRef.current?.setInputValue(prompt);
  }

  return (
    <main
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "2rem 1.5rem 3rem",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Back link */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/"
          style={{
            color: "#1A73E8",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          ← Back
        </Link>
      </div>

      {/* Page heading */}
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "0.25rem",
          color: "#1C1E21",
        }}
      >
        AI Receptionist Demo
      </h1>
      <p
        style={{
          color: "#5F6368",
          fontSize: "0.875rem",
          marginBottom: "1.75rem",
          lineHeight: 1.5,
        }}
      >
        Chat with an AI receptionist configured for a local business. Try
        asking about services, requesting a quote, or booking an appointment.
      </p>

      {/* Prompt chip suggestions */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "#5F6368",
            marginBottom: "0.625rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Try asking something like...
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              style={{
                padding: "0.4375rem 0.875rem",
                background: "#fff",
                border: "1px solid #D6D5D0",
                borderRadius: "2rem",
                fontSize: "0.8375rem",
                color: "#1C1E21",
                cursor: "pointer",
                lineHeight: 1.4,
                transition: "border-color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1A73E8";
                e.currentTarget.style.background = "#EEF4FD";
                e.currentTarget.style.color = "#1A73E8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#D6D5D0";
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#1C1E21";
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat widget */}
      <ReceptionistChat ref={chatRef} />
    </main>
  );
}
