/**
 * Resend domain management API wrapper.
 * Handles domain creation, verification, and DNS record retrieval.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_URL = "https://api.resend.com";

interface ResendDnsRecord {
  record: string;    // "SPF" | "DKIM" | "DMARC" etc
  name: string;      // DNS record name
  type: string;      // "TXT" | "MX" | "CNAME"
  ttl: string;       // "Auto"
  status: string;    // "not_started" | "verified"
  value: string;     // DNS record value
  priority?: number;
}

interface ResendDomain {
  id: string;
  name: string;
  status: string;
  records: ResendDnsRecord[];
  region: string;
  created_at: string;
}

export interface DomainCreateResult {
  success: boolean;
  domain?: ResendDomain;
  error?: string;
}

export interface DomainVerifyResult {
  success: boolean;
  status?: string;
  records?: ResendDnsRecord[];
  error?: string;
}

function getHeaders() {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
  return {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * Add a domain to Resend for email sending.
 */
export async function createDomain(domain: string): Promise<DomainCreateResult> {
  if (!RESEND_API_KEY) {
    // Mock mode for development
    return {
      success: true,
      domain: {
        id: "mock_domain_" + Math.random().toString(36).slice(2, 10),
        name: domain,
        status: "pending",
        region: "us-east-1",
        created_at: new Date().toISOString(),
        records: [
          {
            record: "SPF",
            name: domain,
            type: "TXT",
            ttl: "Auto",
            status: "not_started",
            value: "v=spf1 include:resend.com ~all",
          },
          {
            record: "DKIM",
            name: `resend._domainkey.${domain}`,
            type: "CNAME",
            ttl: "Auto",
            status: "not_started",
            value: `resend._domainkey.${domain}.resend.com`,
          },
          {
            record: "Return-Path",
            name: `bounce.${domain}`,
            type: "CNAME",
            ttl: "Auto",
            status: "not_started",
            value: `feedback-smtp.us-east-1.resend.com`,
          },
        ],
      },
    };
  }

  try {
    const res = await fetch(`${RESEND_API_URL}/domains`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name: domain }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }

    const data = await res.json();
    return { success: true, domain: data };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Verify a domain's DNS records in Resend.
 */
export async function verifyDomain(resendDomainId: string): Promise<DomainVerifyResult> {
  if (!RESEND_API_KEY) {
    return {
      success: true,
      status: "verified",
      records: [],
    };
  }

  try {
    const res = await fetch(`${RESEND_API_URL}/domains/${resendDomainId}/verify`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }

    // After triggering verify, fetch the domain to get updated status
    const domainRes = await fetch(`${RESEND_API_URL}/domains/${resendDomainId}`, {
      headers: getHeaders(),
    });

    if (domainRes.ok) {
      const domain = await domainRes.json();
      return {
        success: true,
        status: domain.status,
        records: domain.records,
      };
    }

    return { success: true, status: "pending" };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Get domain details from Resend.
 */
export async function getDomain(resendDomainId: string): Promise<ResendDomain | null> {
  if (!RESEND_API_KEY) return null;

  try {
    const res = await fetch(`${RESEND_API_URL}/domains/${resendDomainId}`, {
      headers: getHeaders(),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Delete a domain from Resend.
 */
export async function deleteDomain(resendDomainId: string): Promise<boolean> {
  if (!RESEND_API_KEY) return true;

  try {
    const res = await fetch(`${RESEND_API_URL}/domains/${resendDomainId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}
