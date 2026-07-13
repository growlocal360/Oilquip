"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Download,
  Trash2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import type {
  ApplicationStatus,
  EducationEntry,
  EmploymentEntry,
  JobApplication,
  ReferenceEntry,
} from "@/lib/types";

type ApplicationDetail = JobApplication & {
  resume_signed_url?: string | null;
  job?: { id: string; title: string; slug: string } | null;
};

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/applications/${id}`);
      if (res.ok) {
        setApp(await res.json());
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const updateStatus = async (status: ApplicationStatus) => {
    if (!app) return;
    setSavingStatus(true);
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setApp({ ...app, status });
    }
    setSavingStatus(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this application permanently?")) return;
    setDeleting(true);
    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/applicants");
    } else {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-steel-400">Loading…</div>;
  }

  if (!app) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-steel-100 mb-4">
          Application not found
        </h1>
        <Link
          href="/admin/applicants"
          className="inline-flex items-center text-accent-400 hover:text-accent-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to applicants
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/admin/applicants"
            className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-4 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            All applicants
          </Link>
          <h1 className="text-3xl font-bold text-steel-100">
            {app.first_name} {app.last_name}
          </h1>
          <p className="text-steel-400 mt-1">
            Applied for{" "}
            <span className="text-steel-200">
              {app.job ? app.job.title : app.position_desired || "General interest"}
            </span>{" "}
            · {format(new Date(app.created_at), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <Card title="Contact">
            <Row icon={<Mail className="h-4 w-4" />} label="Email">
              <a
                href={`mailto:${app.email}`}
                className="text-accent-400 hover:text-accent-300"
              >
                {app.email}
              </a>
            </Row>
            <Row icon={<Phone className="h-4 w-4" />} label="Phone">
              <a
                href={`tel:${app.phone}`}
                className="text-accent-400 hover:text-accent-300"
              >
                {app.phone}
              </a>
            </Row>
            {(app.address_line || app.city) && (
              <Row icon={<MapPin className="h-4 w-4" />} label="Address">
                {[
                  app.address_line,
                  [app.city, app.state, app.postal_code]
                    .filter(Boolean)
                    .join(", "),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Row>
            )}
          </Card>

          {/* Position */}
          <Card title="Position & Availability">
            <Row
              icon={<Briefcase className="h-4 w-4" />}
              label="Position"
              value={app.position_desired}
            />
            <Row label="Employment type" value={app.employment_type} />
            <Row
              label="Available"
              value={
                app.availability_date
                  ? format(new Date(app.availability_date), "MMM d, yyyy")
                  : null
              }
            />
            <Row label="Compensation" value={app.compensation_expectation} />
          </Card>

          {/* Work eligibility */}
          <Card title="Work Eligibility">
            <Row
              label="Authorized to work in the U.S."
              value={
                app.authorized_to_work === null
                  ? "—"
                  : app.authorized_to_work
                    ? "Yes"
                    : "No"
              }
            />
            <Row
              label="Requires visa sponsorship"
              value={
                app.needs_sponsorship === null
                  ? "—"
                  : app.needs_sponsorship
                    ? "Yes"
                    : "No"
              }
            />
          </Card>

          {/* Resume */}
          {app.application_type === "resume" && (
            <Card title="Resume & Notes">
              {app.resume_signed_url ? (
                <a
                  href={app.resume_signed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 p-4 bg-steel-800 border border-steel-700 hover:border-accent-500/50 rounded-lg transition-colors mb-4 w-full"
                >
                  <FileText className="h-6 w-6 text-accent-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-steel-100 font-medium truncate">
                      {app.resume_filename ?? "Resume"}
                    </p>
                    <p className="text-steel-500 text-sm">
                      {app.resume_size
                        ? `${(app.resume_size / 1024 / 1024).toFixed(1)} MB`
                        : "Download"}
                    </p>
                  </div>
                  <Download className="h-5 w-5 text-steel-400" />
                </a>
              ) : (
                <p className="text-steel-500 text-sm">No resume attached.</p>
              )}
              {app.notes && (
                <div>
                  <p className="text-steel-500 text-xs uppercase tracking-wide mb-2">
                    Notes
                  </p>
                  <p className="text-steel-200 text-sm whitespace-pre-wrap">
                    {app.notes}
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Full app sections */}
          {app.application_type === "full" && (
            <>
              {app.education && app.education.length > 0 && (
                <Card title="Education">
                  {app.education.map((e: EducationEntry, i: number) => (
                    <div
                      key={i}
                      className="py-3 border-b border-steel-800 last:border-b-0"
                    >
                      <p className="text-steel-100 font-medium">{e.school}</p>
                      <p className="text-steel-400 text-sm">
                        {[e.degree, e.field_of_study].filter(Boolean).join(" · ")}
                      </p>
                      <p className="text-steel-500 text-xs mt-1">
                        {[e.start_date, e.end_date].filter(Boolean).join(" – ")}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                    </div>
                  ))}
                </Card>
              )}

              {app.employment_history && app.employment_history.length > 0 && (
                <Card title="Employment History">
                  {app.employment_history.map((e: EmploymentEntry, i: number) => (
                    <div
                      key={i}
                      className="py-3 border-b border-steel-800 last:border-b-0"
                    >
                      <p className="text-steel-100 font-medium">
                        {e.title} · {e.company}
                      </p>
                      <p className="text-steel-500 text-xs mt-1">
                        {[
                          e.start_date,
                          e.current ? "Present" : e.end_date,
                        ]
                          .filter(Boolean)
                          .join(" – ")}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                      {e.responsibilities && (
                        <p className="text-steel-300 text-sm mt-2 whitespace-pre-wrap">
                          {e.responsibilities}
                        </p>
                      )}
                      {(e.supervisor_name || e.supervisor_contact) && (
                        <p className="text-steel-500 text-xs mt-2">
                          Supervisor: {e.supervisor_name}
                          {e.supervisor_contact ? ` · ${e.supervisor_contact}` : ""}
                          {e.may_we_contact === false ? " · Do not contact" : ""}
                        </p>
                      )}
                      {e.reason_for_leaving && (
                        <p className="text-steel-500 text-xs mt-1">
                          Reason for leaving: {e.reason_for_leaving}
                        </p>
                      )}
                    </div>
                  ))}
                </Card>
              )}

              {app.professional_references &&
                app.professional_references.length > 0 && (
                  <Card title="References">
                    {app.professional_references.map(
                      (r: ReferenceEntry, i: number) => (
                        <div
                          key={i}
                          className="py-3 border-b border-steel-800 last:border-b-0"
                        >
                          <p className="text-steel-100 font-medium">{r.name}</p>
                          <p className="text-steel-400 text-sm">
                            {[r.relationship, r.company].filter(Boolean).join(" · ")}
                          </p>
                          <p className="text-steel-500 text-xs mt-1">
                            {[r.phone, r.email].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                      )
                    )}
                  </Card>
                )}

              {app.military?.served && (
                <Card title="Military Service">
                  <Row label="Branch" value={app.military.branch} />
                  <Row label="Rank" value={app.military.rank} />
                  <Row
                    label="Service dates"
                    value={
                      [app.military.start_date, app.military.end_date]
                        .filter(Boolean)
                        .join(" – ") || null
                    }
                  />
                  <Row label="Discharge" value={app.military.discharge_type} />
                </Card>
              )}
            </>
          )}

          {/* EEO */}
          {app.eeo && Object.values(app.eeo).some(Boolean) && (
            <Card title="Voluntary Demographic Information">
              <Row label="Race / Ethnicity" value={app.eeo.race} />
              <Row label="Gender" value={app.eeo.gender} />
              <Row label="Veteran status" value={app.eeo.veteran_status} />
              <Row label="Disability status" value={app.eeo.disability} />
            </Card>
          )}

          {/* Consents */}
          <Card title="Consents">
            <Row
              label="Reference verification acknowledged"
              value={app.reference_verification_ack ? "Yes" : "No"}
            />
            <Row
              label="Background check consent"
              value={app.background_check_consent ? "Yes" : "No"}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-steel-900 border border-steel-700 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-steel-300 uppercase tracking-wide mb-3">
              Status
            </h3>
            <select
              value={app.status}
              onChange={(e) => updateStatus(e.target.value as ApplicationStatus)}
              disabled={savingStatus}
              className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 outline-none transition-colors disabled:opacity-60"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {savingStatus && (
              <p className="text-steel-500 text-xs mt-2">Saving…</p>
            )}
          </div>

          <div className="bg-steel-900 border border-steel-700 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-steel-300 uppercase tracking-wide mb-3">
              Applied for
            </h3>
            {app.job ? (
              <Link
                href={`/admin/careers/${app.job.id}/edit`}
                className="text-accent-400 hover:text-accent-300 font-medium"
              >
                {app.job.title}
              </Link>
            ) : (
              <p className="text-steel-400">General interest</p>
            )}
            <p className="text-steel-500 text-xs mt-3">
              Application type:{" "}
              <span className="text-steel-300">
                {app.application_type === "resume" ? "Resume + basic" : "Full application"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-steel-900 border border-steel-700 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-accent-400 uppercase tracking-wide mb-4">
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string | null;
  children?: React.ReactNode;
}) {
  const content = children ?? value ?? "—";
  return (
    <div className="py-2 flex items-start gap-3">
      {icon && <span className="text-steel-500 mt-0.5">{icon}</span>}
      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:gap-4">
        <span className="text-steel-500 text-sm">{label}</span>
        <span className="text-steel-200 text-sm">{content}</span>
      </div>
    </div>
  );
}
