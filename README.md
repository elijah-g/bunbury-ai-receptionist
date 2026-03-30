# Bunbury AI Receptionist — MVP

AI-powered receptionist for local SMBs. Answers customer enquiries, captures leads, and helps book jobs — 24/7, without a human on the phones.

## What it does

- Chat interface simulating an AI receptionist for a configurable business
- Collects visitor name, contact details, and enquiry type
- Powered by Claude (Anthropic) via the `@anthropic-ai/sdk`
- System prompt is dynamically built from business configuration env vars

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **AI SDK:** `@anthropic-ai/sdk` (Claude Haiku for fast, cost-effective responses)
- **Language:** TypeScript (strict mode)
- **Linting:** ESLint with `eslint-config-next`

## Getting started

### Prerequisites

- Node.js 22+
- An [Anthropic API key](https://console.anthropic.com)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/elijah-g/bunbury-ai-receptionist.git
cd bunbury-ai-receptionist

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Try the demo**.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `BUSINESS_NAME` | No | Name shown to visitors (default: Bunbury AI Demo Business) |
| `BUSINESS_PHONE` | No | Business phone number |
| `BUSINESS_EMAIL` | No | Business contact email |
| `BUSINESS_SERVICES` | No | Comma-separated list of services offered |
| `LEAD_NOTIFICATION_EMAIL` | No | Email to notify when a lead is captured (future feature) |

## Project structure

```
app/
  page.tsx              — Landing/home page
  layout.tsx            — Root layout
  globals.css           — Global styles
  demo/
    page.tsx            — Demo chat page
  api/
    chat/
      route.ts          — POST /api/chat — Anthropic API handler
components/
  ReceptionistChat.tsx  — Chat UI component
lib/
  receptionist.ts       — Business config + system prompt builder
.github/
  workflows/
    ci.yml              — Lint, typecheck, build on push/PR
```

## Development

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Roadmap

- [ ] Lead capture → email notification (AWS SES)
- [ ] Business config UI (admin panel to customise without env vars)
- [ ] Conversation history / CRM export
- [ ] Voice interface (Twilio / WebRTC)
- [ ] Multi-business support

## Contributing

This is an internal Bunbury AI product. Questions? Contact [hello@bunbury.ai](mailto:hello@bunbury.ai).
