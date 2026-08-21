"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Quote } from "@/lib/types";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchQuotes = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    setQuotes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    setDeleteId(id);
    const response = await fetch(`/api/quotes/${id}`, { method: "DELETE" });

    if (response.ok) {
      setQuotes(quotes.filter((q) => q.id !== id));
    }
    setDeleteId(null);
  };

  const togglePublish = async (quote: Quote) => {
    const response = await fetch(`/api/quotes/${quote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !quote.published }),
    });

    if (response.ok) {
      fetchQuotes();
    }
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.quote_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quote.author || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-steel-100">Quotes</h1>
          <p className="text-steel-400 mt-1">
            Manage the quotes shown in the website footer. A random published
            quote is displayed on each page load.
          </p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Quote
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
        <input
          type="text"
          placeholder="Search quotes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-steel-900 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
        />
      </div>

      {/* Quotes List */}
      <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-steel-400">Loading...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-steel-400 mb-4">No quotes found</p>
            <Link
              href="/admin/quotes/new"
              className="text-accent-400 hover:text-accent-300"
            >
              Create your first quote
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-700 bg-steel-800/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Quote
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Author
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-steel-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote, index) => (
                <motion.tr
                  key={quote.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                >
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-steel-100 italic line-clamp-2">
                      &ldquo;{quote.quote_text}&rdquo;
                    </p>
                  </td>
                  <td className="px-6 py-4 text-steel-300 text-sm whitespace-nowrap">
                    {quote.author || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(quote)}
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                        quote.published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-steel-700 text-steel-400"
                      }`}
                    >
                      {quote.published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-steel-400 text-sm whitespace-nowrap">
                    {format(new Date(quote.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/quotes/${quote.id}/edit`}
                        className="p-2 text-steel-400 hover:text-accent-400 hover:bg-steel-800 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        disabled={deleteId === quote.id}
                        className="p-2 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
