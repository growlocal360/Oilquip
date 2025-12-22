"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Clock } from "lucide-react";
import type { JobPosting } from "@/lib/types";

interface JobCardProps {
  job: JobPosting;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/careers/${job.slug}`} className="group block">
      <article className="h-full bg-steel-900/50 border border-steel-700 hover:border-accent-500/50 rounded-xl p-6 transition-all duration-300">
        {/* Employment Type Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 bg-accent-500/10 border border-accent-500/30 rounded-full text-xs font-medium text-accent-400">
            <Clock className="h-3 w-3 mr-1" />
            {job.employment_type}
          </span>
          {job.department && (
            <span className="text-steel-500 text-sm">{job.department}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-steel-100 mb-3 group-hover:text-accent-400 transition-colors">
          {job.title}
        </h3>

        {/* Location */}
        <div className="flex items-center space-x-4 text-steel-400 text-sm mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          {job.salary_range && (
            <div className="flex items-center space-x-1">
              <Briefcase className="h-4 w-4" />
              <span>{job.salary_range}</span>
            </div>
          )}
        </div>

        {/* Apply Link */}
        <div className="flex items-center text-accent-400 font-semibold text-sm group-hover:text-accent-300 transition-colors">
          View Position
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </article>
    </Link>
  );
}
