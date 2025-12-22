"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper, Briefcase, FolderOpen, Plus, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  newsCount: number;
  publishedNewsCount: number;
  jobsCount: number;
  activeJobsCount: number;
  resourcesCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    newsCount: 0,
    publishedNewsCount: 0,
    jobsCount: 0,
    activeJobsCount: 0,
    resourcesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [newsResult, publishedNewsResult, jobsResult, activeJobsResult, resourcesResult] =
        await Promise.all([
          supabase.from("news_articles").select("id", { count: "exact", head: true }),
          supabase.from("news_articles").select("id", { count: "exact", head: true }).eq("published", true),
          supabase.from("job_postings").select("id", { count: "exact", head: true }),
          supabase.from("job_postings").select("id", { count: "exact", head: true }).eq("published", true),
          supabase.from("resources").select("id", { count: "exact", head: true }),
        ]);

      setStats({
        newsCount: newsResult.count || 0,
        publishedNewsCount: publishedNewsResult.count || 0,
        jobsCount: jobsResult.count || 0,
        activeJobsCount: activeJobsResult.count || 0,
        resourcesCount: resourcesResult.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "News Articles",
      total: stats.newsCount,
      published: stats.publishedNewsCount,
      icon: Newspaper,
      href: "/admin/news",
      newHref: "/admin/news/new",
      color: "accent",
    },
    {
      title: "Job Postings",
      total: stats.jobsCount,
      published: stats.activeJobsCount,
      icon: Briefcase,
      href: "/admin/careers",
      newHref: "/admin/careers/new",
      color: "safety",
    },
    {
      title: "Resources",
      total: stats.resourcesCount,
      published: null,
      icon: FolderOpen,
      href: "/admin/resources",
      newHref: "/admin/resources/new",
      color: "accent",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-steel-100">Dashboard</h1>
        <p className="text-steel-400 mt-1">
          Manage your website content from here
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-steel-900 border border-steel-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    card.color === "accent"
                      ? "bg-accent-500/10"
                      : "bg-safety-500/10"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      card.color === "accent"
                        ? "text-accent-500"
                        : "text-safety-500"
                    }`}
                  />
                </div>
                <Link
                  href={card.newHref}
                  className="flex items-center space-x-1 text-sm text-steel-400 hover:text-accent-400 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New</span>
                </Link>
              </div>

              <h3 className="text-lg font-semibold text-steel-100 mb-1">
                {card.title}
              </h3>

              {loading ? (
                <div className="h-8 bg-steel-800 rounded animate-pulse" />
              ) : (
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-steel-100">
                    {card.total}
                  </span>
                  {card.published !== null && (
                    <span className="text-steel-500 text-sm">
                      ({card.published} published)
                    </span>
                  )}
                </div>
              )}

              <Link
                href={card.href}
                className="inline-flex items-center text-sm text-accent-400 hover:text-accent-300 mt-4 transition-colors"
              >
                Manage
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-steel-900 border border-steel-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-steel-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/admin/news/new"
            className="flex items-center space-x-3 p-4 bg-steel-800 hover:bg-steel-700 border border-steel-700 hover:border-accent-500/50 rounded-lg transition-colors"
          >
            <Newspaper className="h-5 w-5 text-accent-500" />
            <span className="text-steel-200">Create News Article</span>
          </Link>
          <Link
            href="/admin/careers/new"
            className="flex items-center space-x-3 p-4 bg-steel-800 hover:bg-steel-700 border border-steel-700 hover:border-accent-500/50 rounded-lg transition-colors"
          >
            <Briefcase className="h-5 w-5 text-accent-500" />
            <span className="text-steel-200">Post New Job</span>
          </Link>
          <Link
            href="/admin/resources/new"
            className="flex items-center space-x-3 p-4 bg-steel-800 hover:bg-steel-700 border border-steel-700 hover:border-accent-500/50 rounded-lg transition-colors"
          >
            <FolderOpen className="h-5 w-5 text-accent-500" />
            <span className="text-steel-200">Upload Resource</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
