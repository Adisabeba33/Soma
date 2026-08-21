// Reading a menu page that only exists once a browser has drawn it.
//
// A dispensary menu arrives as an empty shell plus a script; the strain names
// appear after that script has run and the page has been scrolled to the end.
// Downloading the URL therefore returns nothing useful, and Soma's own page
// cannot read another origin. What is left is a real browser somewhere Soma can
// reach, which opens the page, scrolls it, reads the text and hands back lines.
//
// That browser is deliberately behind this one small interface. Whether it runs
// on a laptop during the pilot, a box at home, or a paid service later is an
// operational choice, and nothing above this file should have to know.

export type MenuReadFailure =
  | "NOT_CONFIGURED"
  | "ROBOTS_DISALLOWED"
  | "ACCESS_CONTROL"
  | "UNREACHABLE"
  | "TIMEOUT"
  | "EMPTY";

export class MenuReadError extends Error {
  constructor(
    message: string,
    readonly code: MenuReadFailure,
  ) {
    super(message);
    this.name = "MenuReadError";
  }
}

/** What a reader hands back: the page as lines, plus what it cost to get them. */
export interface RenderedMenu {
  finalUrl: string;
  /** One line per element that owned text, in the order the page shows them. */
  lines: string[];
  bytes: number;
  durationMs: number;
}

export interface MenuRenderer {
  read(url: URL, signal?: AbortSignal): Promise<RenderedMenu>;
}

const FAILURE_CODES = new Set<string>([
  "NOT_CONFIGURED",
  "ROBOTS_DISALLOWED",
  "ACCESS_CONTROL",
  "UNREACHABLE",
  "TIMEOUT",
  "EMPTY",
]);

/**
 * A renderer running as its own service, reached over HTTP.
 *
 * It is given a URL and returns lines. It is never given a user, a profile or a
 * session: it has no reason to know who asked, and keeping it ignorant means
 * the machine running the browser holds nothing worth stealing.
 */
class HttpMenuRenderer implements MenuRenderer {
  constructor(
    private readonly endpoint: string,
    private readonly token: string | null,
    private readonly timeoutMs: number,
  ) {}

  async read(url: URL, signal?: AbortSignal): Promise<RenderedMenu> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    signal?.addEventListener("abort", () => controller.abort(), { once: true });

    let response: Response;
    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
        body: JSON.stringify({ url: url.toString() }),
        signal: controller.signal,
        cache: "no-store",
      });
    } catch (error) {
      const aborted = (error as Error).name === "AbortError";
      throw new MenuReadError(
        aborted ? "The menu took too long to read." : "The reader could not be reached.",
        aborted ? "TIMEOUT" : "UNREACHABLE",
      );
    } finally {
      clearTimeout(timer);
    }

    const body: unknown = await response.json().catch(() => null);
    const payload = (body ?? {}) as Record<string, unknown>;

    if (typeof payload.error === "string" && FAILURE_CODES.has(payload.error)) {
      throw new MenuReadError(
        typeof payload.message === "string" ? payload.message : "That page could not be read.",
        payload.error as MenuReadFailure,
      );
    }
    if (!response.ok) {
      throw new MenuReadError("The reader returned an error.", "UNREACHABLE");
    }

    const lines = Array.isArray(payload.lines)
      ? payload.lines.filter((line): line is string => typeof line === "string")
      : [];
    if (lines.length === 0) {
      throw new MenuReadError("That page came back empty.", "EMPTY");
    }

    return {
      finalUrl: typeof payload.finalUrl === "string" ? payload.finalUrl : url.toString(),
      lines,
      bytes: typeof payload.bytes === "number" ? payload.bytes : 0,
      durationMs: typeof payload.durationMs === "number" ? payload.durationMs : 0,
    };
  }
}

/**
 * The renderer this deployment has, or none.
 *
 * No renderer configured is an ordinary state, not a broken one: reading a link
 * is the fast path, and pasting the text always works without it.
 */
export function getMenuRenderer(): MenuRenderer | null {
  const endpoint = process.env.MENU_RENDER_URL?.trim();
  if (!endpoint) return null;
  const timeoutMs = Number(process.env.MENU_RENDER_TIMEOUT_MS ?? 60_000);
  return new HttpMenuRenderer(
    endpoint,
    process.env.MENU_RENDER_TOKEN?.trim() || null,
    Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 60_000,
  );
}
