// Deciding whether a pasted link is safe to hand to a renderer.
//
// The renderer opens whatever it is given in a real browser, so a link is an
// instruction, not data. The checks here are the cheap half: scheme, shape, and
// addresses that are obviously not a dispensary's public menu. They cannot be
// the whole story, because a hostname resolves to an address only at the moment
// of the request — a name that looks ordinary here can point at a private
// address by then. The renderer runs on its own machine with no route to
// anything private, and that separation, not this function, is what actually
// contains the risk. This is here so a mistake is caught early and explained
// clearly rather than becoming a timeout.

export type UrlRejection =
  | "not-a-url"
  | "bad-scheme"
  | "has-credentials"
  | "local-address"
  | "too-long";

export class UnsafeUrlError extends Error {
  constructor(
    message: string,
    readonly rejection: UrlRejection,
  ) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

const MAX_URL_LENGTH = 2048;

/** Hostnames that never belong to a public menu. */
const LOCAL_NAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "metadata",
  "metadata.google.internal",
]);

function isPrivateIPv4(hostname: string): boolean {
  const parts = hostname.split(".");
  if (parts.length !== 4) return false;
  const octets = parts.map((part) => Number(part));
  if (octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  const [a = 0, b = 0] = octets;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true; // link-local, and the cloud metadata address
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
  return a >= 224; // multicast and reserved
}

/**
 * The IPv4 address an IPv4-mapped IPv6 literal actually reaches, if any.
 *
 * Worth spelling out because it is where a check like this usually leaks: URL
 * normalises `::ffff:127.0.0.1` to `::ffff:7f00:1`, so a rule written against
 * the dotted form it was typed in never fires on the form it is stored as.
 */
function mappedIPv4(inner: string): string | null {
  const mapped = /^::ffff:(?:0:)?(.+)$/.exec(inner);
  const tail = mapped?.[1];
  if (!tail) return null;
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(tail)) return tail;

  const groups = tail.split(":");
  if (groups.length !== 2) return null;
  const high = Number.parseInt(groups[0] ?? "", 16);
  const low = Number.parseInt(groups[1] ?? "", 16);
  if (!Number.isInteger(high) || !Number.isInteger(low)) return null;
  if (high < 0 || high > 0xffff || low < 0 || low > 0xffff) return null;
  return [high >> 8, high & 0xff, low >> 8, low & 0xff].join(".");
}

function isPrivateIPv6(hostname: string): boolean {
  // URL keeps IPv6 literals in brackets.
  const inner = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!inner.includes(":")) return false;
  if (inner === "::1" || inner === "::") return true;
  if (inner.startsWith("fe80") || inner.startsWith("fc") || inner.startsWith("fd")) return true;
  const ipv4 = mappedIPv4(inner);
  return ipv4 ? isPrivateIPv4(ipv4) : false;
}

/**
 * Return the URL to read, or explain why it will not be read.
 */
export function assertReadableUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed) throw new UnsafeUrlError("Paste a link to a menu page.", "not-a-url");
  if (trimmed.length > MAX_URL_LENGTH) {
    throw new UnsafeUrlError("That link is too long to be a menu page.", "too-long");
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new UnsafeUrlError("That does not look like a link.", "not-a-url");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Only web links can be read.", "bad-scheme");
  }
  if (url.username || url.password) {
    throw new UnsafeUrlError("A link with a sign-in built into it will not be read.", "has-credentials");
  }

  const hostname = url.hostname.toLowerCase();
  if (
    LOCAL_NAMES.has(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".internal") ||
    isPrivateIPv4(hostname) ||
    isPrivateIPv6(hostname)
  ) {
    throw new UnsafeUrlError("That address is not a public menu page.", "local-address");
  }

  return url;
}
