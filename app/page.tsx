import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "4rem 1.5rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Bunbury AI Receptionist
      </h1>
      <p style={{ color: "#5F6368", marginBottom: "2rem" }}>
        AI-powered receptionist for local businesses. Answers enquiries, books
        jobs, and follows up leads — 24/7.
      </p>
      <Link
        href="/demo"
        style={{
          display: "inline-block",
          background: "#1A73E8",
          color: "#fff",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Try the demo →
      </Link>
    </main>
  );
}
