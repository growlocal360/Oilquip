"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";

export default function NewQuotePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quote_text: quoteText.trim(),
        author: author.trim() || null,
        published,
      }),
    });

    if (response.ok) {
      router.push("/admin/quotes");
    } else {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Failed to save quote");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/quotes"
        className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Quotes
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-steel-100 mb-8">New Quote</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="quote_text"
              className="block text-sm font-semibold text-steel-300 mb-2"
            >
              Quote *
            </label>
            <textarea
              id="quote_text"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              required
              rows={4}
              placeholder="Enter the quote text (without quotation marks)"
              className="w-full px-4 py-3 bg-steel-900 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-semibold text-steel-300 mb-2"
            >
              Author
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Ray Charles"
              className="w-full px-4 py-3 bg-steel-900 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
            />
          </div>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-accent-500"
            />
            <span className="text-steel-300">
              Published (eligible to appear in the footer)
            </span>
          </label>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={saving || !quoteText.trim()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25 disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? "Saving..." : "Save Quote"}
            </button>
            <Link
              href="/admin/quotes"
              className="px-6 py-3 text-steel-400 hover:text-steel-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
