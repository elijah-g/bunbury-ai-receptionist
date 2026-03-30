export interface BusinessConfig {
  businessName: string;
  phone: string;
  email: string;
  services: string;
  leadNotificationEmail?: string;
}

export interface LeadData {
  name?: string;
  contact?: string; // email or phone
  enquiryType?: string;
  hasEnoughInfo: boolean; // true when name + contact are both present
}

export function getBusinessConfig(): BusinessConfig {
  return {
    businessName: process.env.BUSINESS_NAME ?? "Bunbury AI Demo Business",
    phone: process.env.BUSINESS_PHONE ?? "+61 8 9XXX XXXX",
    email: process.env.BUSINESS_EMAIL ?? "hello@bunbury.ai",
    services:
      process.env.BUSINESS_SERVICES ??
      "AI consulting, AI integration, staff AI training, AI receptionist setup",
    leadNotificationEmail: process.env.LEAD_NOTIFICATION_EMAIL,
  };
}

export function buildSystemPrompt(config: BusinessConfig): string {
  return `You are an AI receptionist for ${config.businessName}. Your job is to:

1. Greet callers warmly and professionally
2. Understand what they need (quote, booking, general enquiry, complaint)
3. Collect the information needed to help them:
   - Name
   - Contact number or email
   - What they need help with
   - Preferred time/date if booking
4. Let them know someone will follow up within 24 hours (or sooner for urgent matters)
5. Answer common questions about the business where you can

About this business:
- Name: ${config.businessName}
- Phone: ${config.phone}
- Email: ${config.email}
- Services offered: ${config.services}

Guidelines:
- Be warm, friendly, and professional — like a great human receptionist
- Keep responses concise (1–3 sentences per turn)
- If someone is upset, acknowledge their frustration before moving forward
- Never make up prices or promises you can't keep — say "I'll have someone get back to you with a quote"
- If you've collected all the lead details (name + contact), confirm what you have and tell them to expect a follow-up
- Don't discuss competitors or anything outside of your business role`;
}

export function extractLeadData(raw: unknown): LeadData {
  if (!raw || typeof raw !== "object") {
    return { hasEnoughInfo: false };
  }

  const obj = raw as Record<string, unknown>;

  const name =
    typeof obj.name === "string" && obj.name !== "null" && obj.name.trim() !== ""
      ? obj.name.trim()
      : undefined;

  const contact =
    typeof obj.contact === "string" &&
    obj.contact !== "null" &&
    obj.contact.trim() !== ""
      ? obj.contact.trim()
      : undefined;

  const enquiryType =
    typeof obj.enquiryType === "string" &&
    obj.enquiryType !== "null" &&
    obj.enquiryType.trim() !== ""
      ? obj.enquiryType.trim()
      : undefined;

  return {
    name,
    contact,
    enquiryType,
    hasEnoughInfo: name !== undefined && contact !== undefined,
  };
}
