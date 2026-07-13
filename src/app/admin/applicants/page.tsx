"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Search,
  Eye,
  Trash2,
  ClipboardList,
  FileText,
  Filter,
} from "lucide-react";
import type { ApplicationStatus, JobApplication, JobPosting } from "@/lib/types";

const STATUSES: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { value: "reviewing", label: "Reviewing", color: "bg-accent-500/10 text-accent-400 border-accent-500/30" },
  { value: "interviewing", label: "Interviewing", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { value: "offer", label: "Offer", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { value: "hired", label: "Hired", color: "bg-green-500/10 text-green-400 border-green-500/30" },
  { value: "rejected", label: "Rejected", color: "bg-red-500/10 text-red-400 border-red-500/30" },
];

function statusStyle(status: ApplicationStatus) {
  return STATUSES.find((s) => s.value === status)?.color ?? STATUSES[0].color;
}

function statusLabel(status: ApplicationStatus) {
  return STATUSES.find((s) => s.value === status)?.label ?? status;
}

type ApplicationRow = JobApplication & {
  job?: Pick<JobPosting, "id" | "title" | "slug"> | null;
};

export default function AdminApplicantsPage() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [jobFilter, setJobFilter] = useState<string>("");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    // Load list of jobs for the filter dropdown
    fetch("/api/careers")
      .then((r) => r.json())
      .then(setJobs)
      .catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (jobFilter) params.set("job_id", jobFilter);
    if (search) params.set("search", search);

    const debounce = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/applications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(debounce);
  }, [search, statusFilter, jobFilter]);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Delete this application? The resume file will also be removed. This cannot be undone."
      )
    )
      return;

    setDeleting(id);
    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (res.ok) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-steel-100">Applicants</h1>
        <p className="text-steel-400 mt-1">
          Review and track job applications
        </p>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, position…"
            className="w-full pl-11 pr-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel-500 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 outline-none appearance-none"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 outline-none appearance-none"
        >
          <option value="">All positions</option>
          <option value="null">General interest</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-steel-400">Loading…</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="h-12 w-12 text-steel-600 mx-auto mb-4" />
            <p className="text-steel-400">No applications match the current filters</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-700 bg-steel-800/50 text-left text-sm font-semibold text-steel-300">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-steel-100 font-medium">
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="text-steel-500 text-sm">{app.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-steel-200 text-sm">
                      {app.job ? app.job.title : app.position_desired || "General interest"}
                    </p>
                    {!app.job && (
                      <p className="text-steel-500 text-xs">Unsolicited</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        app.application_type === "resume"
                          ? "bg-accent-500/10 text-accent-400"
                          : "bg-safety-500/10 text-safety-400"
                      }`}
                    >
                      {app.application_type === "resume" ? (
                        <>
                          <FileText className="h-3 w-3" />
                          Resume
                        </>
                      ) : (
                        <>Full</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 border rounded-full text-xs font-medium ${statusStyle(app.status)}`}
                    >
                      {statusLabel(app.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-steel-400 text-sm">
                    {format(new Date(app.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/applicants/${app.id}`}
                        className="p-2 text-steel-400 hover:text-accent-400 hover:bg-steel-800 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deleting === app.id}
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
