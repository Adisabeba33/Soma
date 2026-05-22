"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Sparkles,
  Trash2,
} from "lucide-react";
import { ResultsView } from "@/components/results-view";
import { FeedbackControl } from "@/components/feedback-control";
import { buttonClass } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { SessionDetail } from "@/lib/types";

export default function SavedPage() {
  const [sessions, setSessions] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  async function toggleSaved(session: SessionDetail) {
    const next = !session.saved;
    setSessions((prev) =>
      prev.map((s) => (s.id === session.id ? { ...s, saved: next } : s)),
    );
    await fetch("/api/recommendations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id, saved: next }),
    }).catch(() => {});
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this analysis? This cannot be undone.")) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/recommendations?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => {});
  }

  const saved = sessions.filter((s) => s.saved);
  const history = sessions.filter((s) => !s.saved);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Saved</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Saved recommendations
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Every analysis you run is kept here. Save the ones worth returning to,
        and log how each pick actually landed — that feedback sharpens future
        matching.
      </p>

      {loading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
      ) : sessions.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-brass" />
          <p className="mt-3 font-display text-lg">No analyses yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run your first Taste Match to start building a history.
          </p>
          <Link
            href="/taste-match"
            className={cn("mt-5", buttonClass("primary", "md"))}
          >
            Start Taste Match
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {saved.length > 0 && (
            <Group
              title="Saved"
              sessions={saved}
              expanded={expanded}
              onExpand={setExpanded}
              onToggleSaved={toggleSaved}
              onRemove={remove}
            />
          )}
          {history.length > 0 && (
            <Group
              title="Recent analyses"
              sessions={history}
              expanded={expanded}
              onExpand={setExpanded}
              onToggleSaved={toggleSaved}
              onRemove={remove}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Group({
  title,
  sessions,
  expanded,
  onExpand,
  onToggleSaved,
  onRemove,
}: {
  title: string;
  sessions: SessionDetail[];
  expanded: string | null;
  onExpand: (id: string | null) => void;
  onToggleSaved: (session: SessionDetail) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">
        {title}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          {sessions.length}
        </span>
      </h2>
      <div className="space-y-3">
        {sessions.map((session) => {
          const isOpen = expanded === session.id;
          const top = session.recommendations[0];
          return (
            <div
              key={session.id}
              className="rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 p-5">
                <button
                  type="button"
                  onClick={() => onExpand(isOpen ? null : session.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {session.title ?? `Menu — ${formatDate(session.createdAt)}`}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {session.strainCount} strain
                      {session.strainCount === 1 ? "" : "s"}
                      {top && ` · Top: ${top.strainName} (${top.matchScore}%)`}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSaved(session)}
                  aria-label={session.saved ? "Unsave" : "Save"}
                  className="shrink-0 text-muted-foreground hover:text-accent"
                >
                  {session.saved ? (
                    <BookmarkCheck className="h-5 w-5 text-accent" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(session.id)}
                  aria-label="Delete"
                  className="shrink-0 text-muted-foreground hover:text-[#a23b2c]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-border p-5">
                  <ResultsView
                    recommendations={session.recommendations}
                    renderExtra={(rec) => (
                      <FeedbackControl
                        recommendationId={rec.id}
                        initial={rec.feedback}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
