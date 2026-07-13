"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ApplyWizard from "@/components/careers/ApplyWizard";
import type { JobPosting } from "@/lib/types";

export default function JobApplyPage() {
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
    <div className="bg-steel-950 min-h-screen pt-24 sm:pt-32">
      <ApplyWizard job={job} />
    </div>
  );
}
