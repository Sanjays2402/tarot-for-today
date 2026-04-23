"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCw, Share2, Sparkles } from "lucide-react";
import { toPng } from "html-to-image";
import { TarotCard } from "@/components/tarot-card";

type Card = { card: string; glyph: string; upright: string; asks: string };

export default function Home() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!mood.trim() || loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mood }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "The deck slipped.");
      else setCard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setCard(null); setError(null); setMood(""); };

  const download = async () => {
    if (!cardRef.current) return;
    const png = await toPng(cardRef.current, { pixelRatio: 1, cacheBust: true });
    const a = document.createElement("a");
    a.href = png;
    a.download = `tarot-${Date.now()}.png`;
    a.click();
  };

  const share = async () => {
    if (!card) return;
    const text = `${card.glyph} ${card.card} — ${card.asks}`;
    if (navigator.share) { try { await navigator.share({ title: card.card, text }); return; } catch {} }
    await navigator.clipboard.writeText(text);
    alert("Card copied");
  };

  return (
    <main className="flex-1 grid lg:grid-cols-2 min-h-screen">
      {/* LEFT — the deck */}
      <section className="relative flex flex-col justify-center px-8 sm:px-16 py-16 border-b lg:border-b-0 lg:border-r border-accent/15">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 mb-8 text-xs font-mono text-accent uppercase tracking-[0.4em]">
            <Sparkles className="h-3 w-3" /> the deck
          </div>
          <h1 className="text-5xl sm:text-7xl tracking-tight text-ink leading-[0.95]">
            One card.<br/>
            <span className="font-display italic text-arcane">For now.</span>
          </h1>
          <p className="mt-6 text-ink-dim">
            Tell the deck what&rsquo;s going on. It will invent the card you need.
          </p>

          <form onSubmit={submit} className="mt-10">
            <textarea
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="I keep saying yes to plans I don't want to go to…"
              rows={3}
              maxLength={240}
              disabled={!!card}
              className="w-full bg-bg-2/60 border border-ink-dim/20 rounded-2xl px-5 py-4 text-ink placeholder-ink-dim font-display text-lg focus:border-arcane/60 focus:outline-none resize-none disabled:opacity-50"
            />
            <div className="mt-1 text-right text-xs text-ink-dim">{mood.length}/240</div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={!mood.trim() || loading || !!card}
                className="px-6 py-3 rounded-xl bg-accent text-bg font-semibold hover:bg-accent-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Shuffling…" : card ? "Card drawn" : "Draw a card"}
              </button>
              {card && (
                <button
                  type="button"
                  onClick={reset}
                  className="px-5 py-3 rounded-xl border border-ink-dim/30 text-ink hover:border-accent/60 hover:text-accent transition inline-flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Shuffle
                </button>
              )}
            </div>
            {error && <p className="mt-3 text-sm text-rust">{error}</p>}
          </form>
        </div>
      </section>

      {/* RIGHT — the drawn card */}
      <section className="relative flex flex-col items-center justify-center px-6 sm:px-12 py-16">
        <AnimatePresence mode="wait">
          {!card ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* card back */}
              <div
                className="mx-auto rounded-3xl flex items-center justify-center"
                style={{
                  width: 280,
                  height: 420,
                  background:
                    "linear-gradient(140deg, #16113a 0%, #0c0820 100%)",
                  border: "2px solid rgba(201,169,110,0.5)",
                  boxShadow:
                    "0 0 0 8px rgba(12,8,32,0.6), 0 0 60px rgba(138,125,240,0.18)",
                }}
              >
                <div className="font-display text-6xl text-accent/70">✦</div>
              </div>
              <p className="mt-8 text-ink-dim font-mono text-xs uppercase tracking-[0.4em]">
                awaiting your shuffle
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="drawn"
              initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm"
              style={{ perspective: 1200 }}
            >
              <div
                className="rounded-3xl p-8 text-center"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(22,17,58,0.95) 0%, rgba(12,8,32,0.95) 100%)",
                  border: "1px solid rgba(201,169,110,0.4)",
                  boxShadow: "0 0 60px rgba(138,125,240,0.18)",
                }}
              >
                <div className="text-xs font-mono uppercase tracking-[0.5em] text-accent">
                  drawn today
                </div>
                <div className="text-7xl mt-6">{card.glyph}</div>
                <h2 className="mt-4 font-display text-3xl text-ink" style={{ letterSpacing: "0.04em" }}>
                  {card.card}
                </h2>
                <div className="mx-auto mt-4 h-px w-16 bg-accent/50" />
                <p className="mt-4 text-ink/90 leading-relaxed">{card.upright}</p>
                <div className="mt-6 pt-6 border-t border-accent/25">
                  <div className="text-xs font-mono uppercase tracking-[0.4em] text-accent">
                    it asks of you
                  </div>
                  <p className="mt-2 font-display italic text-accent-2 text-lg">{card.asks}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button onClick={download} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-bg text-sm font-semibold hover:bg-accent-2 transition">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
                <button onClick={share} className="inline-flex items-center gap-2 rounded-xl border border-ink-dim/30 px-4 py-2.5 text-ink text-sm hover:border-accent/60 hover:text-accent transition">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>

              <div aria-hidden style={{ position: "fixed", left: "-99999px", top: 0, pointerEvents: "none" }}>
                <TarotCard ref={cardRef} {...card} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="absolute bottom-6 left-0 right-0 text-center text-xs text-ink-dim">
          🃏 tarot-for-today · the deck is infinite
        </footer>
      </section>
    </main>
  );
}
