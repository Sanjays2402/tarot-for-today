"use client";

import { forwardRef } from "react";

type Props = { card: string; glyph: string; upright: string; asks: string };

export const TarotCard = forwardRef<HTMLDivElement, Props>(function TarotCard(
  { card, glyph, upright, asks },
  ref
) {
  return (
    <div
      ref={ref}
      style={{ width: 1080, height: 1350 }}
      className="relative overflow-hidden flex items-center justify-center"
    >
      {/* outer mystical bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 500px at 30% 10%, rgba(138,125,240,0.30), transparent 65%), radial-gradient(700px 500px at 75% 90%, rgba(201,169,110,0.20), transparent 65%), linear-gradient(180deg, #0c0820 0%, #16113a 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      {/* the card itself */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          width: 760,
          height: 1180,
          padding: 50,
          borderRadius: 32,
          background:
            "linear-gradient(180deg, rgba(22,17,58,0.95) 0%, rgba(12,8,32,0.95) 100%)",
          border: "2px solid rgba(201,169,110,0.55)",
          boxShadow:
            "0 0 0 8px rgba(12,8,32,0.6), 0 0 80px rgba(138,125,240,0.25)",
        }}
      >
        {/* corner ornaments */}
        {(["tl", "tr", "bl", "br"] as const).map((pos) => (
          <div
            key={pos}
            className="absolute"
            style={{
              ...(pos.includes("t") ? { top: 22 } : { bottom: 22 }),
              ...(pos.includes("l") ? { left: 22 } : { right: 22 }),
              width: 60,
              height: 60,
              borderTop: pos.includes("t") ? "1px solid rgba(201,169,110,0.6)" : "none",
              borderBottom: pos.includes("b") ? "1px solid rgba(201,169,110,0.6)" : "none",
              borderLeft: pos.includes("l") ? "1px solid rgba(201,169,110,0.6)" : "none",
              borderRight: pos.includes("r") ? "1px solid rgba(201,169,110,0.6)" : "none",
              borderRadius: pos === "tl" ? "16px 0 0 0" : pos === "tr" ? "0 16px 0 0" : pos === "bl" ? "0 0 0 16px" : "0 0 16px 0",
            }}
          />
        ))}

        <div
          className="font-mono uppercase text-accent"
          style={{ fontSize: 18, letterSpacing: "0.5em", marginTop: 20 }}
        >
          drawn today
        </div>

        <div style={{ fontSize: 240, lineHeight: 1, marginTop: 50 }}>{glyph}</div>

        <h2
          className="font-display text-ink mt-10"
          style={{ fontSize: 64, fontWeight: 600, letterSpacing: "0.04em", lineHeight: 1.1 }}
        >
          {card}
        </h2>

        <div
          className="mx-auto"
          style={{
            width: 60,
            height: 1,
            background: "rgba(201,169,110,0.6)",
            marginTop: 32,
            marginBottom: 32,
          }}
        />

        <p
          className="font-sans text-ink/90 mx-auto"
          style={{ fontSize: 26, lineHeight: 1.5, maxWidth: 600 }}
        >
          {upright}
        </p>

        <div className="flex-1" />

        <div className="w-full mt-8 pt-8 border-t border-accent/30 text-center">
          <div className="font-mono uppercase text-accent" style={{ fontSize: 14, letterSpacing: "0.4em" }}>
            it asks of you
          </div>
          <p
            className="font-display italic text-accent-2 mt-3"
            style={{ fontSize: 28, lineHeight: 1.3 }}
          >
            {asks}
          </p>
        </div>
      </div>
    </div>
  );
});
