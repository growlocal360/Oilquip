"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, Clock, Send } from "lucide-react";
import ArticleContent from "@/components/editor/ArticleContent";
import { createClient } from "@/lib/supabase/client";
import type { JobPosting } from "@/lib/types";

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-steel-950 min-h-screen flex items-center justify-center">
        <p className="text-steel-400">Loading...</p>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="bg-steel-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-steel-100 mb-4">
            Position Not Found
          </h1>
          <p className="text-steel-400 mb-8">
            This job posting may have been filled or removed.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center text-accent-400 hover:text-accent-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            View All Positions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-steel-950 min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Link */}
            <Link
              href="/careers"
              className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Positions
            </Link>

            {/* Employment Type Badge */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-accent-500/10 border border-accent-500/30 rounded-full text-sm font-medium text-accent-400">
                <Clock className="h-4 w-4 mr-1" />
                {job.employment_type}
              </span>
              {job.department && (
                <span className="text-steel-500">{job.department}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-steel-100 mb-6">
              {job.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-steel-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{job.location}</span>
              </div>
              {job.salary_range && (
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>{job.salary_range}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-steel-900/50 border border-steel-700 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-steel-100 mb-6">
                  About This Role
                </h2>
                <ArticleContent content={job.description} />
              </motion.div>

              {/* Requirements */}
              {job.requirements && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-steel-900/50 border border-steel-700 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-steel-100 mb-6">
                    Requirements & Qualifications
                  </h2>
                  <ArticleContent content={job.requirements} />
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-steel-900 border border-steel-700 rounded-2xl p-6 sticky top-24"
              >
                <h3 className="text-xl font-bold text-steel-100 mb-4">
                  Interested?
                </h3>
                <p className="text-steel-400 text-sm mb-6">
                  We&apos;d love to hear from you. Send us your resume and tell
                  us why you&apos;d be a great fit for this role.
                </p>
                <Link
                  href="/#contact"
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Apply Now
                </Link>

                <div className="mt-6 pt-6 border-t border-steel-700">
                  <h4 className="text-sm font-semibold text-steel-300 mb-3">
                    Job Details
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-steel-500">Type</dt>
                      <dd className="text-steel-300">{job.employment_type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-steel-500">Location</dt>
                      <dd className="text-steel-300">{job.location}</dd>
                    </div>
                    {job.department && (
                      <div className="flex justify-between">
                        <dt className="text-steel-500">Department</dt>
                        <dd className="text-steel-300">{job.department}</dd>
                      </div>
                    )}
                    {job.salary_range && (
                      <div className="flex justify-between">
                        <dt className="text-steel-500">Salary</dt>
                        <dd className="text-steel-300">{job.salary_range}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* More Jobs CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/careers"
            className="inline-flex items-center text-accent-400 hover:text-accent-300 font-semibold"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            View All Open Positions
          </Link>
        </div>
      </section>
    </div>
  );
}
