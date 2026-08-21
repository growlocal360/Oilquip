"use client";

import { useEffect, useState } from "react";
import type { Quote } from "@/lib/types";

// Shown until quotes load, and if none are published
const FALLBACK: Pick<Quote, "quote_text" | "author"> = {
  quote_text:
    "What is a soul? It's like electricity — we don't know really what it is, but it's a force that can light a room",
  author: "Ray Charles",
};

export default function FooterQuote() {
  const [quote, setQuote] = useState<Pick<Quote, "quote_text" | "author">>(FALLBACK);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/quotes?published=true");
        if (!response.ok) return;
        const quotes: Quote[] = await response.json();
        if (quotes.length > 0) {
          setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        }
      } catch {
        // keep fallback
      }
    };
    fetchQuote();
  }, []);

  return (
    <blockquote className="text-center">
      <p className="text-steel-400 italic text-sm md:text-base max-w-3xl mx-auto">
        &ldquo;{quote.quote_text}&rdquo;
      </p>
      {quote.author && (
        <cite className="block mt-3 text-steel-500 text-sm not-italic">
          — {quote.author}
        </cite>
      )}
    </blockquote>
  );
}
