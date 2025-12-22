"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";
import JobCard from "@/components/careers/JobCard";
import type { JobPosting } from "@/lib/types";

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("/api/careers?published=true");
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-steel-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl mb-6">
              <Briefcase className="h-10 w-10 text-accent-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-100 mb-6">
              Join Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-xl text-steel-400 leading-relaxed">
              Build your career with a company that&apos;s been solving the
              industry&apos;s toughest challenges since 1960. We&apos;re always
              looking for talented people who share our values.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Oilquip Section */}
      <section className="py-16 bg-steel-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-steel-100 mb-4">
              Why Work at Oilquip?
            </h2>
            <p className="text-steel-400 max-w-2xl mx-auto">
              We&apos;re more than a workplace. We&apos;re a family driven by
              Cajun spirit and a passion for excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Family Culture",
                description:
                  "We treat each other like family. Your success is our success.",
              },
              {
                title: "Growth Opportunities",
                description:
                  "Continuous learning and advancement opportunities for all team members.",
              },
              {
                title: "Industry Leaders",
                description:
                  "Work with cutting-edge technology and industry-leading expertise.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-steel-800/50 border border-steel-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-steel-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-steel-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-steel-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-steel-100 mb-4">
              Open Positions
            </h2>
            <p className="text-steel-400">
              Find your next opportunity with Oilquip
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-steel-800/50 border border-steel-700 rounded-xl h-48 animate-pulse"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-steel-900/50 border border-steel-700 rounded-xl">
              <Briefcase className="h-16 w-16 text-steel-600 mx-auto mb-4" />
              <p className="text-steel-400 text-lg mb-4">
                No open positions at the moment
              </p>
              <p className="text-steel-500 mb-6">
                Check back soon or send us your resume for future opportunities
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center text-accent-400 hover:text-accent-300"
              >
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-steel-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-steel-100 mb-6">
              Don&apos;t See the Right Fit?
            </h2>
            <p className="text-steel-400 text-lg mb-8">
              We&apos;re always interested in connecting with talented
              individuals. Send us your resume and let&apos;s talk about your
              future with Oilquip.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
