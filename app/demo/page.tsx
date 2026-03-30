import Link from "next/link";
import { ReceptionistChat } from "@/components/ReceptionistChat";

export default function DemoPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/"
          style={{ color: "#1A73E8", textDecoration: "none", fontSize: "0.875rem" }}
        >
          ← Back
        </Link>
      </div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        AI Receptionist Demo
      </h1>
      <p style={{ color: "#5F6368", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        Chat with an AI receptionist configured for a local business. Try asking about
        services, requesting a quote, or booking an appointment.
      </p>
      <ReceptionistChat />
    </main>
  );
}
