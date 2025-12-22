"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight, Calendar } from "lucide-react";
import type { NewsArticle } from "@/lib/types";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <article className="h-full bg-steel-900/50 border border-steel-700 hover:border-accent-500/50 rounded-xl overflow-hidden transition-all duration-300">
        {/* Featured Image */}
        {article.featured_image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-steel-900 to-transparent" />
          </div>
        )}

        <div className="p-6">
          {/* Date */}
          <div className="flex items-center space-x-2 text-steel-500 text-sm mb-3">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.published_at || article.created_at}>
              {format(
                new Date(article.published_at || article.created_at),
                "MMMM d, yyyy"
              )}
            </time>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-steel-100 mb-3 group-hover:text-accent-400 transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-steel-400 text-sm leading-relaxed mb-4 line-clamp-3">
              {article.excerpt}
            </p>
          )}

          {/* Read More */}
          <div className="flex items-center text-accent-400 font-semibold text-sm group-hover:text-accent-300 transition-colors">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}
