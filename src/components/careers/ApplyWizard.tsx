"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Plus,
  Trash2,
  Upload,
  Printer,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type {
  ApplicationType,
  EducationEntry,
  EEOResponse,
  EmploymentEntry,
  JobApplicationInsert,
  JobPosting,
  MilitaryService,
  ReferenceEntry,
} from "@/lib/types";

const RESUME_MAX_BYTES = 10 * 1024 * 1024;
const RESUME_MAX_MB = RESUME_MAX_BYTES / 1024 / 1024;

const REFERENCE_VERIFICATION_TEXT = `Reference Verification Process: We are committed to building a team of A Players—individuals with a proven record of exceptional performance and consistent achievement. To support this goal, we use the Topgrading® approach to reference checking. Candidates who advance in the hiring process may be asked to facilitate conversations with former supervisors and managers who can discuss their work history, results, strengths, and areas for development. We believe that talented, high-performing professionals value transparency and welcome the opportunity for their track record to speak for itself. This process helps ensure the best long-term fit for both the candidate and our organization.`;

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Any"];

const RACE_OPTIONS = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Two or more races",
  "Prefer not to answer",
];
const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to answer"];
const VETERAN_OPTIONS = [
  "I am a veteran",
  "I am not a veteran",
  "Prefer not to answer",
];
const DISABILITY_OPTIONS = [
  "Yes, I have a disability",
  "No, I do not have a disability",
  "Prefer not to answer",
];

type FormState = {
  application_type: ApplicationType | null;

  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;

  position_desired: string;
  employment_type: string;
  availability_date: string;
  compensation_expectation: string;

  authorized_to_work: boolean | null;
  needs_sponsorship: boolean | null;

  resume_url: string;
  resume_filename: string;
  resume_size: number | null;
  notes: string;

  education: EducationEntry[];
  employment_history: EmploymentEntry[];
  professional_references: ReferenceEntry[];
  military: MilitaryService;

  eeo: EEOResponse;

  reference_verification_ack: boolean;
  background_check_consent: boolean;
};

const emptyEducation = (): EducationEntry => ({
  school: "",
  location: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
});

const emptyEmployment = (): EmploymentEntry => ({
  company: "",
  title: "",
  location: "",
  start_date: "",
  end_date: "",
  current: false,
  responsibilities: "",
  reason_for_leaving: "",
  supervisor_name: "",
  supervisor_contact: "",
  may_we_contact: true,
});

const emptyReference = (): ReferenceEntry => ({
  name: "",
  relationship: "",
  company: "",
  phone: "",
  email: "",
});

const initialState = (job: JobPosting | null): FormState => ({
  application_type: null,

  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",

  position_desired: job?.title ?? "",
  employment_type: job?.employment_type ?? "",
  availability_date: "",
  compensation_expectation: "",

  authorized_to_work: null,
  needs_sponsorship: null,

  resume_url: "",
  resume_filename: "",
  resume_size: null,
  notes: "",

  education: [emptyEducation()],
  employment_history: [emptyEmployment()],
  professional_references: [emptyReference(), emptyReference()],
  military: { served: false },

  eeo: {},

  reference_verification_ack: false,
  background_check_consent: false,
});

type Step =
  | "choice"
  | "contact"
  | "position"
  | "eligibility"
  | "resume"
  | "education"
  | "employment"
  | "references"
  | "military"
  | "eeo"
  | "consents"
  | "review";

const RESUME_PATH_STEPS: Step[] = [
  "choice",
  "contact",
  "position",
  "eligibility",
  "resume",
  "eeo",
  "consents",
  "review",
];
const FULL_PATH_STEPS: Step[] = [
  "choice",
  "contact",
  "position",
  "eligibility",
  "education",
  "employment",
  "references",
  "military",
  "eeo",
  "consents",
  "review",
];

interface ApplyWizardProps {
  job: JobPosting | null;
}

export default function ApplyWizard({ job }: ApplyWizardProps) {
  const router = useRouter();
  const draftKey = `oilquip-application-draft-${job?.id ?? "general"}`;

  const [form, setForm] = useState<FormState>(() => initialState(job));
  const [stepIndex, setStepIndex] = useState(0);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hp, setHp] = useState(""); // honeypot

  // Load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
  }, [draftKey]);

  // Persist draft
  useEffect(() => {
    if (submitted) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form, draftKey, submitted]);

  const steps: Step[] = useMemo(() => {
    if (form.application_type === "full") return FULL_PATH_STEPS;
    if (form.application_type === "resume") return RESUME_PATH_STEPS;
    return ["choice"];
  }, [form.application_type]);

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > RESUME_MAX_BYTES) {
      alert(
        `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${RESUME_MAX_MB} MB.`
      );
      e.target.value = "";
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      e.target.value = "";
      return;
    }

    setUploadingResume(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const uniqueName = `resumes/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)}.${ext}`;

      const { error } = await supabase.storage
        .from("applications")
        .upload(uniqueName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("applications").getPublicUrl(uniqueName);

      setForm((prev) => ({
        ...prev,
        resume_url: publicUrl,
        resume_filename: file.name,
        resume_size: file.size,
      }));
    } catch (err) {
      console.error("Resume upload error:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to upload resume. Please try again."
      );
    }
    setUploadingResume(false);
  };

  const clearResume = () => {
    setForm((prev) => ({
      ...prev,
      resume_url: "",
      resume_filename: "",
      resume_size: null,
    }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "choice":
        return form.application_type !== null;
      case "contact":
        return !!(
          form.first_name.trim() &&
          form.last_name.trim() &&
          form.email.trim() &&
          form.phone.trim()
        );
      case "position":
        return !!(form.position_desired.trim() && form.employment_type);
      case "eligibility":
        return (
          form.authorized_to_work !== null && form.needs_sponsorship !== null
        );
      case "resume":
        return !!form.resume_url;
      case "education":
        return form.education.some((e) => e.school.trim());
      case "employment":
        return form.employment_history.some(
          (e) => e.company.trim() && e.title.trim()
        );
      case "references":
        return form.professional_references.some(
          (r) => r.name.trim() && (r.phone?.trim() || r.email?.trim())
        );
      case "military":
        return true;
      case "eeo":
        return true;
      case "consents":
        return form.reference_verification_ack && form.background_check_consent;
      case "review":
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const payload: JobApplicationInsert & { _hp: string } = {
      _hp: hp,
      job_id: job?.id ?? null,
      application_type: form.application_type ?? "full",

      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address_line: form.address_line.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      postal_code: form.postal_code.trim() || null,

      position_desired: form.position_desired.trim() || null,
      employment_type: form.employment_type || null,
      availability_date: form.availability_date || null,
      compensation_expectation: form.compensation_expectation.trim() || null,

      authorized_to_work: form.authorized_to_work,
      needs_sponsorship: form.needs_sponsorship,

      resume_url: form.resume_url || null,
      resume_filename: form.resume_filename || null,
      resume_size: form.resume_size,
      notes: form.notes.trim() || null,

      education:
        form.application_type === "full"
          ? form.education.filter((e) => e.school.trim())
          : null,
      employment_history:
        form.application_type === "full"
          ? form.employment_history.filter((e) => e.company.trim())
          : null,
      professional_references:
        form.application_type === "full"
          ? form.professional_references.filter((r) => r.name.trim())
          : null,
      military:
        form.application_type === "full" ? form.military : null,

      eeo: Object.values(form.eeo).some(Boolean) ? form.eeo : null,

      reference_verification_ack: form.reference_verification_ack,
      background_check_consent: form.background_check_consent,
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to submit application");
      }

      // Success — clear draft, show confirmation
      localStorage.removeItem(draftKey);
      setSubmitted(true);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to submit application"
      );
    }

    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-steel-100 mb-4">
          Application Received
        </h1>
        <p className="text-lg text-steel-400 mb-8">
          Thank you for applying to Oilquip. Our team will review your
          submission and reach out if there&apos;s a good fit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/careers"
            className="inline-flex items-center justify-center px-6 py-3 border border-steel-600 hover:border-steel-500 text-steel-300 hover:text-white rounded-lg font-medium transition-colors"
          >
            View Open Positions
          </Link>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold shadow-lg shadow-safety-500/25"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={job ? `/careers/${job.slug}` : "/careers"}
          className="inline-flex items-center text-steel-400 hover:text-accent-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {job ? `Back to ${job.title}` : "Back to Careers"}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-steel-100 mb-2">
          {job ? `Apply: ${job.title}` : "General Application"}
        </h1>
        <p className="text-steel-400">
          {job
            ? `Complete the application to be considered for this role.`
            : "Tell us about yourself. We'll keep your application on file for future opportunities."}
        </p>

        <div className="mt-6">
          <Link
            href="/careers/apply/print"
            target="_blank"
            className="inline-flex items-center text-sm text-steel-500 hover:text-accent-400 transition-colors"
          >
            <Printer className="h-4 w-4 mr-1" />
            Prefer paper? Print a blank application
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-steel-400 mb-2">
          <span>
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-steel-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-500 to-accent-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Honeypot (hidden) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="absolute left-[-9999px] w-px h-px opacity-0"
        aria-hidden="true"
      />

      {/* Step content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-steel-900/50 border border-steel-700 rounded-2xl p-6 sm:p-8"
      >
        {currentStep === "choice" && (
          <ChoiceStep
            value={form.application_type}
            onChange={(v) => update("application_type", v)}
          />
        )}
        {currentStep === "contact" && (
          <ContactStep form={form} update={update} />
        )}
        {currentStep === "position" && (
          <PositionStep form={form} update={update} locked={!!job} />
        )}
        {currentStep === "eligibility" && (
          <EligibilityStep form={form} update={update} />
        )}
        {currentStep === "resume" && (
          <ResumeStep
            form={form}
            update={update}
            uploading={uploadingResume}
            onUpload={handleResumeUpload}
            onClear={clearResume}
          />
        )}
        {currentStep === "education" && (
          <EducationStep form={form} update={update} />
        )}
        {currentStep === "employment" && (
          <EmploymentStep form={form} update={update} />
        )}
        {currentStep === "references" && (
          <ReferencesStep form={form} update={update} />
        )}
        {currentStep === "military" && (
          <MilitaryStep form={form} update={update} />
        )}
        {currentStep === "eeo" && <EEOStep form={form} update={update} />}
        {currentStep === "consents" && (
          <ConsentsStep form={form} update={update} />
        )}
        {currentStep === "review" && <ReviewStep form={form} job={job} />}
      </motion.div>

      {/* Nav buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={back}
          disabled={stepIndex === 0}
          className="inline-flex items-center px-5 py-3 text-steel-300 hover:text-white disabled:text-steel-600 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {currentStep === "review" ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold shadow-lg shadow-safety-500/25 disabled:shadow-none transition-all"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        ) : (
          <button
            onClick={next}
            disabled={!canProceed()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold shadow-lg shadow-accent-500/25 disabled:shadow-none transition-all"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Reusable field styles
// ============================================================================
const inputCls =
  "w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors";
const labelCls = "block text-sm font-medium text-steel-300 mb-2";
const textareaCls = `${inputCls} resize-none`;

// ============================================================================
// Step components
// ============================================================================

function ChoiceStep({
  value,
  onChange,
}: {
  value: ApplicationType | null;
  onChange: (v: ApplicationType) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-2">
        Have a resume already?
      </h2>
      <p className="text-steel-400 mb-6">
        Choose the path that fits you best. Either way, you can finish and
        submit in a few minutes.
      </p>
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => onChange("resume")}
          className={`text-left p-6 border-2 rounded-xl transition-all ${
            value === "resume"
              ? "border-accent-500 bg-accent-500/5"
              : "border-steel-700 hover:border-steel-600 bg-steel-800/30"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-500/10 border border-accent-500/30 rounded-lg">
              <FileText className="h-6 w-6 text-accent-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-steel-100 mb-1">
                Upload my resume and complete basic information
              </h3>
              <p className="text-steel-400 text-sm">
                Faster. We&apos;ll use your resume for work history and
                education, so you only need the essentials here.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange("full")}
          className={`text-left p-6 border-2 rounded-xl transition-all ${
            value === "full"
              ? "border-accent-500 bg-accent-500/5"
              : "border-steel-700 hover:border-steel-600 bg-steel-800/30"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-safety-500/10 border border-safety-500/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-safety-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-steel-100 mb-1">
                Complete the full employment application
              </h3>
              <p className="text-steel-400 text-sm">
                No resume needed. You&apos;ll fill in education, employment
                history, and references directly.
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function ContactStep({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-6">
        Contact information
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>First name *</label>
          <input
            className={inputCls}
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Last name *</label>
          <input
            className={inputCls}
            value={form.last_name}
            onChange={(e) => update("last_name", e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input
            type="email"
            className={inputCls}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Phone *</label>
          <input
            type="tel"
            className={inputCls}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Street address</label>
          <input
            className={inputCls}
            value={form.address_line}
            onChange={(e) => update("address_line", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>City</label>
          <input
            className={inputCls}
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>State</label>
            <input
              className={inputCls}
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>ZIP</label>
            <input
              className={inputCls}
              value={form.postal_code}
              onChange={(e) => update("postal_code", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PositionStep({
  form,
  update,
  locked,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  locked: boolean;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-6">
        Position &amp; availability
      </h2>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Position applied for *</label>
          <input
            className={inputCls}
            value={form.position_desired}
            onChange={(e) => update("position_desired", e.target.value)}
            disabled={locked}
            placeholder={locked ? undefined : "e.g. Field Service Technician"}
          />
          {locked && (
            <p className="text-steel-500 text-xs mt-2">
              Locked to this posting.
            </p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Employment type *</label>
            <select
              className={inputCls}
              value={form.employment_type}
              onChange={(e) => update("employment_type", e.target.value)}
            >
              <option value="">Select…</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Available to start</label>
            <input
              type="date"
              className={inputCls}
              value={form.availability_date}
              onChange={(e) => update("availability_date", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Compensation expectation</label>
          <input
            className={inputCls}
            value={form.compensation_expectation}
            onChange={(e) => update("compensation_expectation", e.target.value)}
            placeholder="e.g. $55,000 – $70,000, or hourly rate, or 'open'"
          />
        </div>
      </div>
    </div>
  );
}

function EligibilityStep({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-6">
        Work eligibility
      </h2>
      <div className="space-y-6">
        <YesNo
          label="Are you legally authorized to work in the United States? *"
          value={form.authorized_to_work}
          onChange={(v) => update("authorized_to_work", v)}
        />
        <YesNo
          label="Will you now or in the future require sponsorship for employment visa status? *"
          value={form.needs_sponsorship}
          onChange={(v) => update("needs_sponsorship", v)}
        />
      </div>
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className="flex gap-3">
        {[
          { label: "Yes", val: true },
          { label: "No", val: false },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`px-6 py-2 border rounded-lg font-medium transition-colors ${
              value === opt.val
                ? "border-accent-500 bg-accent-500/10 text-accent-400"
                : "border-steel-700 text-steel-300 hover:border-steel-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResumeStep({
  form,
  update,
  uploading,
  onUpload,
  onClear,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-6">
        Resume &amp; notes
      </h2>
      <div className="space-y-6">
        <div>
          <label className={labelCls}>Resume (PDF or Word, up to {RESUME_MAX_MB} MB) *</label>
          {form.resume_url ? (
            <div className="flex items-center justify-between p-4 bg-steel-800 border border-steel-700 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-6 w-6 text-accent-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-steel-100 font-medium truncate">
                    {form.resume_filename}
                  </p>
                  <p className="text-steel-500 text-sm">
                    {form.resume_size
                      ? `${(form.resume_size / 1024 / 1024).toFixed(1)} MB`
                      : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClear}
                className="ml-4 p-2 text-steel-400 hover:text-red-400 rounded transition-colors flex-shrink-0"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-steel-700 hover:border-accent-500/50 rounded-lg p-8 text-center cursor-pointer transition-colors">
              <Upload
                className={`h-10 w-10 text-steel-500 mx-auto mb-3 ${
                  uploading ? "animate-pulse" : ""
                }`}
              />
              <p className="text-steel-300 mb-1">
                {uploading ? "Uploading..." : "Click to upload your resume"}
              </p>
              <p className="text-steel-500 text-sm">
                PDF, DOC, or DOCX up to {RESUME_MAX_MB} MB
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>
        <div>
          <label className={labelCls}>Anything you&apos;d like us to know? (optional)</label>
          <textarea
            className={textareaCls}
            rows={5}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Cover letter, why you're a fit, availability notes, etc."
          />
        </div>
      </div>
    </div>
  );
}

function EducationStep({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const setEntry = (idx: number, patch: Partial<EducationEntry>) => {
    update(
      "education",
      form.education.map((e, i) => (i === idx ? { ...e, ...patch } : e))
    );
  };
  const remove = (idx: number) => {
    update(
      "education",
      form.education.filter((_, i) => i !== idx)
    );
  };
  const add = () => update("education", [...form.education, emptyEducation()]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-2">Education</h2>
      <p className="text-steel-400 mb-6">
        List your most recent education first. Include high school if
        applicable.
      </p>
      <div className="space-y-6">
        {form.education.map((entry, idx) => (
          <div
            key={idx}
            className="p-5 bg-steel-800/40 border border-steel-700 rounded-xl relative"
          >
            {form.education.length > 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-3 right-3 p-1.5 text-steel-500 hover:text-red-400 rounded transition-colors"
                aria-label="Remove education"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  School / Institution {idx === 0 && "*"}
                </label>
                <input
                  className={inputCls}
                  value={entry.school}
                  onChange={(e) => setEntry(idx, { school: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input
                  className={inputCls}
                  value={entry.location ?? ""}
                  onChange={(e) => setEntry(idx, { location: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Degree / Diploma</label>
                <input
                  className={inputCls}
                  value={entry.degree ?? ""}
                  onChange={(e) => setEntry(idx, { degree: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Field of study</label>
                <input
                  className={inputCls}
                  value={entry.field_of_study ?? ""}
                  onChange={(e) =>
                    setEntry(idx, { field_of_study: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Start</label>
                  <input
                    type="month"
                    className={inputCls}
                    value={entry.start_date ?? ""}
                    onChange={(e) =>
                      setEntry(idx, { start_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>End</label>
                  <input
                    type="month"
                    className={inputCls}
                    value={entry.end_date ?? ""}
                    onChange={(e) =>
                      setEntry(idx, { end_date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-4 inline-flex items-center px-4 py-2 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add another
      </button>
    </div>
  );
}

function EmploymentStep({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const setEntry = (idx: number, patch: Partial<EmploymentEntry>) => {
    update(
      "employment_history",
      form.employment_history.map((e, i) =>
        i === idx ? { ...e, ...patch } : e
      )
    );
  };
  const remove = (idx: number) => {
    update(
      "employment_history",
      form.employment_history.filter((_, i) => i !== idx)
    );
  };
  const add = () =>
    update("employment_history", [...form.employment_history, emptyEmployment()]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-2">
        Employment history
      </h2>
      <p className="text-steel-400 mb-6">
        Start with your most recent employer.
      </p>
      <div className="space-y-6">
        {form.employment_history.map((entry, idx) => (
          <div
            key={idx}
            className="p-5 bg-steel-800/40 border border-steel-700 rounded-xl relative"
          >
            {form.employment_history.length > 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-3 right-3 p-1.5 text-steel-500 hover:text-red-400 rounded transition-colors"
                aria-label="Remove position"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  Company {idx === 0 && "*"}
                </label>
                <input
                  className={inputCls}
                  value={entry.company}
                  onChange={(e) => setEntry(idx, { company: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Job title {idx === 0 && "*"}
                </label>
                <input
                  className={inputCls}
                  value={entry.title}
                  onChange={(e) => setEntry(idx, { title: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input
                  className={inputCls}
                  value={entry.location ?? ""}
                  onChange={(e) => setEntry(idx, { location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Start</label>
                  <input
                    type="month"
                    className={inputCls}
                    value={entry.start_date ?? ""}
                    onChange={(e) =>
                      setEntry(idx, { start_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>End</label>
                  <input
                    type="month"
                    className={inputCls}
                    value={entry.end_date ?? ""}
                    onChange={(e) =>
                      setEntry(idx, { end_date: e.target.value })
                    }
                    disabled={entry.current}
                  />
                </div>
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`emp-current-${idx}`}
                  checked={entry.current ?? false}
                  onChange={(e) =>
                    setEntry(idx, {
                      current: e.target.checked,
                      end_date: e.target.checked ? "" : entry.end_date,
                    })
                  }
                  className="w-4 h-4 accent-accent-500"
                />
                <label
                  htmlFor={`emp-current-${idx}`}
                  className="text-steel-300 text-sm"
                >
                  I currently work here
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Responsibilities</label>
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={entry.responsibilities ?? ""}
                  onChange={(e) =>
                    setEntry(idx, { responsibilities: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Supervisor name</label>
                <input
                  className={inputCls}
                  value={entry.supervisor_name ?? ""}
                  onChange={(e) =>
                    setEntry(idx, { supervisor_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Supervisor phone / email</label>
                <input
                  className={inputCls}
                  value={entry.supervisor_contact ?? ""}
                  onChange={(e) =>
                    setEntry(idx, { supervisor_contact: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Reason for leaving</label>
                <input
                  className={inputCls}
                  value={entry.reason_for_leaving ?? ""}
                  onChange={(e) =>
                    setEntry(idx, { reason_for_leaving: e.target.value })
                  }
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`emp-contact-${idx}`}
                  checked={entry.may_we_contact ?? true}
                  onChange={(e) =>
                    setEntry(idx, { may_we_contact: e.target.checked })
                  }
                  className="w-4 h-4 accent-accent-500"
                />
                <label
                  htmlFor={`emp-contact-${idx}`}
                  className="text-steel-300 text-sm"
                >
                  May we contact this employer?
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-4 inline-flex items-center px-4 py-2 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add another position
      </button>
    </div>
  );
}

function ReferencesStep({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const setEntry = (idx: number, patch: Partial<ReferenceEntry>) => {
    update(
      "professional_references",
      form.professional_references.map((r, i) =>
        i === idx ? { ...r, ...patch } : r
      )
    );
  };
  const remove = (idx: number) => {
    update(
      "professional_references",
      form.professional_references.filter((_, i) => i !== idx)
    );
  };
  const add = () =>
    update("professional_references", [
      ...form.professional_references,
      emptyReference(),
    ]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-2">
        Professional references
      </h2>
      <p className="text-steel-400 mb-6">
        Provide at least two professional references (former supervisors or
        colleagues).
      </p>
      <div className="space-y-6">
        {form.professional_references.map((entry, idx) => (
          <div
            key={idx}
            className="p-5 bg-steel-800/40 border border-steel-700 rounded-xl relative"
          >
            {form.professional_references.length > 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-3 right-3 p-1.5 text-steel-500 hover:text-red-400 rounded transition-colors"
                aria-label="Remove reference"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name {idx === 0 && "*"}</label>
                <input
                  className={inputCls}
                  value={entry.name}
                  onChange={(e) => setEntry(idx, { name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Relationship</label>
                <input
                  className={inputCls}
                  value={entry.relationship ?? ""}
                  onChange={(e) =>
                    setEntry(idx, { relationship: e.target.value })
                  }
                  placeholder="e.g. Direct supervisor"
                />
              </div>
              <div>
                <label className={labelCls}>Company</label>
                <input
                  className={inputCls}
                  value={entry.company ?? ""}
                  onChange={(e) => setEntry(idx, { company: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  className={inputCls}
                  value={entry.phone ?? ""}
                  onChange={(e) => setEntry(idx, { phone: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  className={inputCls}
                  value={entry.email ?? ""}
                  onChange={(e) => setEntry(idx, { email: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-4 inline-flex items-center px-4 py-2 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add another reference
      </button>
    </div>
  );
}

function MilitaryStep({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const setMil = (patch: Partial<MilitaryService>) =>
    update("military", { ...form.military, ...patch });

  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-2">
        Military service
      </h2>
      <p className="text-steel-400 mb-6">Optional.</p>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="mil-served"
            checked={form.military.served ?? false}
            onChange={(e) => setMil({ served: e.target.checked })}
            className="w-4 h-4 accent-accent-500"
          />
          <label htmlFor="mil-served" className="text-steel-300">
            I served in the U.S. armed forces
          </label>
        </div>
        {form.military.served && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Branch</label>
              <input
                className={inputCls}
                value={form.military.branch ?? ""}
                onChange={(e) => setMil({ branch: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Rank</label>
              <input
                className={inputCls}
                value={form.military.rank ?? ""}
                onChange={(e) => setMil({ rank: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Start</label>
              <input
                type="month"
                className={inputCls}
                value={form.military.start_date ?? ""}
                onChange={(e) => setMil({ start_date: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>End</label>
              <input
                type="month"
                className={inputCls}
                value={form.military.end_date ?? ""}
                onChange={(e) => setMil({ end_date: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Discharge type</label>
              <input
                className={inputCls}
                value={form.military.discharge_type ?? ""}
                onChange={(e) => setMil({ discharge_type: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EEOStep({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const setEeo = (patch: Partial<EEOResponse>) =>
    update("eeo", { ...form.eeo, ...patch });

  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-2">
        Voluntary demographic information
      </h2>
      <p className="text-steel-400 mb-6">
        This information is used for federal EEO reporting only. Providing it
        is voluntary and will not affect the consideration of your application.
      </p>
      <div className="space-y-5">
        <EeoSelect
          label="Race / Ethnicity"
          options={RACE_OPTIONS}
          value={form.eeo.race ?? ""}
          onChange={(v) => setEeo({ race: v })}
        />
        <EeoSelect
          label="Gender"
          options={GENDER_OPTIONS}
          value={form.eeo.gender ?? ""}
          onChange={(v) => setEeo({ gender: v })}
        />
        <EeoSelect
          label="Veteran status"
          options={VETERAN_OPTIONS}
          value={form.eeo.veteran_status ?? ""}
          onChange={(v) => setEeo({ veteran_status: v })}
        />
        <EeoSelect
          label="Disability status"
          options={DISABILITY_OPTIONS}
          value={form.eeo.disability ?? ""}
          onChange={(v) => setEeo({ disability: v })}
        />
      </div>
    </div>
  );
}

function EeoSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ConsentsStep({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-6">
        Acknowledgments
      </h2>

      <div className="p-5 bg-steel-800/40 border border-steel-700 rounded-xl mb-6">
        <p className="text-steel-300 text-sm leading-relaxed">
          {REFERENCE_VERIFICATION_TEXT}
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.reference_verification_ack}
            onChange={(e) =>
              update("reference_verification_ack", e.target.checked)
            }
            className="mt-1 w-4 h-4 accent-accent-500"
          />
          <span className="text-steel-300 text-sm">
            I have read and understand the Reference Verification Process
            described above.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.background_check_consent}
            onChange={(e) =>
              update("background_check_consent", e.target.checked)
            }
            className="mt-1 w-4 h-4 accent-accent-500"
          />
          <span className="text-steel-300 text-sm">
            I authorize Oilquip to conduct a background check as part of the
            hiring process, in accordance with applicable law.
          </span>
        </label>
      </div>
    </div>
  );
}

function ReviewStep({
  form,
  job,
}: {
  form: FormState;
  job: JobPosting | null;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-steel-100 mb-2">Review</h2>
      <p className="text-steel-400 mb-6">
        Take a look before you submit. You can go back to any step to make
        changes.
      </p>

      <ReviewGroup title="Applying for">
        <ReviewRow
          label="Position"
          value={job ? job.title : form.position_desired || "General interest"}
        />
        <ReviewRow label="Employment type" value={form.employment_type} />
        {form.availability_date && (
          <ReviewRow label="Available" value={form.availability_date} />
        )}
        {form.compensation_expectation && (
          <ReviewRow label="Compensation" value={form.compensation_expectation} />
        )}
      </ReviewGroup>

      <ReviewGroup title="Contact">
        <ReviewRow
          label="Name"
          value={`${form.first_name} ${form.last_name}`}
        />
        <ReviewRow label="Email" value={form.email} />
        <ReviewRow label="Phone" value={form.phone} />
        {form.address_line && (
          <ReviewRow
            label="Address"
            value={[
              form.address_line,
              [form.city, form.state, form.postal_code]
                .filter(Boolean)
                .join(", "),
            ]
              .filter(Boolean)
              .join(" · ")}
          />
        )}
      </ReviewGroup>

      <ReviewGroup title="Work eligibility">
        <ReviewRow
          label="Authorized to work in the U.S."
          value={form.authorized_to_work ? "Yes" : "No"}
        />
        <ReviewRow
          label="Requires visa sponsorship"
          value={form.needs_sponsorship ? "Yes" : "No"}
        />
      </ReviewGroup>

      {form.application_type === "resume" && (
        <ReviewGroup title="Resume">
          <ReviewRow label="File" value={form.resume_filename || "—"} />
          {form.notes && <ReviewRow label="Notes" value={form.notes} />}
        </ReviewGroup>
      )}

      {form.application_type === "full" && (
        <>
          <ReviewGroup title="Education">
            {form.education
              .filter((e) => e.school.trim())
              .map((e, i) => (
                <ReviewRow
                  key={i}
                  label={e.school}
                  value={[e.degree, e.field_of_study].filter(Boolean).join(" · ")}
                />
              ))}
          </ReviewGroup>
          <ReviewGroup title="Employment">
            {form.employment_history
              .filter((e) => e.company.trim())
              .map((e, i) => (
                <ReviewRow
                  key={i}
                  label={`${e.title} · ${e.company}`}
                  value={[e.start_date, e.current ? "Present" : e.end_date]
                    .filter(Boolean)
                    .join(" – ")}
                />
              ))}
          </ReviewGroup>
          <ReviewGroup title="References">
            {form.professional_references
              .filter((r) => r.name.trim())
              .map((r, i) => (
                <ReviewRow
                  key={i}
                  label={r.name}
                  value={[r.relationship, r.company].filter(Boolean).join(" · ")}
                />
              ))}
          </ReviewGroup>
          {form.military.served && (
            <ReviewGroup title="Military service">
              <ReviewRow
                label="Branch"
                value={form.military.branch ?? "—"}
              />
              <ReviewRow label="Rank" value={form.military.rank ?? "—"} />
            </ReviewGroup>
          )}
        </>
      )}
    </div>
  );
}

function ReviewGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-accent-400 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <div className="p-4 bg-steel-800/40 border border-steel-700 rounded-lg divide-y divide-steel-800">
        {children}
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="py-2 flex flex-col sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-steel-500 text-sm">{label}</span>
      <span className="text-steel-200 text-sm">{value || "—"}</span>
    </div>
  );
}
