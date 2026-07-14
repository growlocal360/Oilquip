import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import PrintApplicationButton from "@/components/careers/PrintApplicationButton";

export const metadata = {
  title: "Employment Application (Printable) | Oilquip",
};

// A print-first blank form. Users hit Cmd/Ctrl+P to save as PDF or print
// on paper, fill it out by hand, and bring it to the office.
export default function PrintableApplicationPage() {
  return (
    <div className="bg-white text-black min-h-screen p-8 print:p-4">
      <div className="max-w-3xl mx-auto">
        <div className="no-print mb-6 flex items-center justify-between">
          <Link
            href="/careers"
            className="inline-flex items-center text-sm text-gray-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Careers
          </Link>
        </div>
        <PrintApplicationButton />

        <header className="border-b-2 border-black pb-4 mb-6 flex items-center gap-6">
          <Image
            src="/oilquip-logo-color.svg"
            alt="Oilquip"
            width={120}
            height={40}
            className="h-12 w-auto flex-shrink-0"
            priority
          />
          <div>
            <h1 className="text-3xl font-bold">Employment Application</h1>
            <p className="text-sm mt-1">Oilquip, Inc. · Lake Charles, LA</p>
          </div>
        </header>

        <Section title="Contact Information">
          <FieldRow>
            <Field label="First Name" width="1/2" />
            <Field label="Last Name" width="1/2" />
          </FieldRow>
          <FieldRow>
            <Field label="Email" width="1/2" />
            <Field label="Phone" width="1/2" />
          </FieldRow>
          <FieldRow>
            <Field label="Street Address" width="full" />
          </FieldRow>
          <FieldRow>
            <Field label="City" width="1/2" />
            <Field label="State" width="1/4" />
            <Field label="ZIP" width="1/4" />
          </FieldRow>
        </Section>

        <Section title="Position & Availability">
          <FieldRow>
            <Field label="Position Applied For" width="full" />
          </FieldRow>
          <FieldRow>
            <Field label="Employment Type (Full-time / Part-time / Contract / Internship)" width="1/2" />
            <Field label="Available to Start (date)" width="1/2" />
          </FieldRow>
          <FieldRow>
            <Field label="Compensation Expectation" width="full" />
          </FieldRow>
        </Section>

        <Section title="Work Eligibility">
          <CheckLine label="Are you legally authorized to work in the United States?" />
          <CheckLine label="Will you now or in the future require sponsorship for employment visa status?" />
        </Section>

        <Section title="Education">
          {[1, 2].map((i) => (
            <EducationBlock key={i} />
          ))}
        </Section>

        <Section title="Employment History (most recent first)">
          {[1, 2, 3].map((i) => (
            <EmploymentBlock key={i} />
          ))}
        </Section>

        <Section title="Professional References">
          {[1, 2, 3].map((i) => (
            <ReferenceBlock key={i} />
          ))}
        </Section>

        <Section title="Military Service (optional)">
          <FieldRow>
            <Field label="Branch" width="1/2" />
            <Field label="Rank" width="1/2" />
          </FieldRow>
          <FieldRow>
            <Field label="Start Date" width="1/3" />
            <Field label="End Date" width="1/3" />
            <Field label="Discharge Type" width="1/3" />
          </FieldRow>
        </Section>

        <Section title="Reference Verification Process">
          <p className="text-sm leading-relaxed mb-4">
            We are committed to building a team of A Players—individuals with a
            proven record of exceptional performance and consistent achievement.
            To support this goal, we use the Topgrading® approach to reference
            checking. Candidates who advance in the hiring process may be asked
            to facilitate conversations with former supervisors and managers
            who can discuss their work history, results, strengths, and areas
            for development. We believe that talented, high-performing
            professionals value transparency and welcome the opportunity for
            their track record to speak for itself. This process helps ensure
            the best long-term fit for both the candidate and our organization.
          </p>
          <CheckLine label="I have read and understand the Reference Verification Process above." />
        </Section>

        <Section title="Background Check Consent">
          <CheckLine label="I authorize Oilquip to conduct a background check as part of the hiring process, in accordance with applicable law." />
        </Section>

        <Section title="Signature">
          <FieldRow>
            <Field label="Signature" width="2/3" />
            <Field label="Date" width="1/3" />
          </FieldRow>
        </Section>

        <footer className="mt-8 pt-4 border-t border-black text-xs text-gray-700">
          Please return this completed application to Oilquip in person, or
          submit online at oilquip.com/careers/apply.
        </footer>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          @page { margin: 0.5in; }
        }
      `}</style>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 break-inside-avoid">
      <h2 className="text-lg font-bold uppercase tracking-wide border-b border-black mb-3 pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3 mb-3">{children}</div>;
}

function Field({
  label,
  width,
}: {
  label: string;
  width: "1/4" | "1/3" | "1/2" | "2/3" | "full";
}) {
  const widthCls = {
    "1/4": "w-1/4",
    "1/3": "w-1/3",
    "1/2": "w-1/2",
    "2/3": "w-2/3",
    full: "w-full",
  }[width];
  return (
    <div className={widthCls}>
      <div className="border-b border-black h-8" />
      <label className="text-xs text-gray-700 mt-1 block">{label}</label>
    </div>
  );
}

function CheckLine({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <div className="flex gap-2 mt-0.5 flex-shrink-0">
        <span className="inline-block w-4 h-4 border border-black" />
        <span className="text-sm">Yes</span>
        <span className="inline-block w-4 h-4 border border-black" />
        <span className="text-sm">No</span>
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function EducationBlock() {
  return (
    <div className="mb-4 break-inside-avoid">
      <FieldRow>
        <Field label="School / Institution" width="1/2" />
        <Field label="Location" width="1/2" />
      </FieldRow>
      <FieldRow>
        <Field label="Degree / Diploma" width="1/2" />
        <Field label="Field of Study" width="1/2" />
      </FieldRow>
      <FieldRow>
        <Field label="Start Date" width="1/2" />
        <Field label="End Date" width="1/2" />
      </FieldRow>
    </div>
  );
}

function EmploymentBlock() {
  return (
    <div className="mb-4 break-inside-avoid">
      <FieldRow>
        <Field label="Company" width="1/2" />
        <Field label="Job Title" width="1/2" />
      </FieldRow>
      <FieldRow>
        <Field label="Location" width="1/2" />
        <Field label="Start Date" width="1/4" />
        <Field label="End Date" width="1/4" />
      </FieldRow>
      <FieldRow>
        <Field label="Responsibilities" width="full" />
      </FieldRow>
      <FieldRow>
        <Field label="Supervisor Name" width="1/2" />
        <Field label="Supervisor Phone / Email" width="1/2" />
      </FieldRow>
      <FieldRow>
        <Field label="Reason for Leaving" width="full" />
      </FieldRow>
    </div>
  );
}

function ReferenceBlock() {
  return (
    <div className="mb-3 break-inside-avoid">
      <FieldRow>
        <Field label="Name" width="1/2" />
        <Field label="Relationship" width="1/2" />
      </FieldRow>
      <FieldRow>
        <Field label="Company" width="1/3" />
        <Field label="Phone" width="1/3" />
        <Field label="Email" width="1/3" />
      </FieldRow>
    </div>
  );
}
