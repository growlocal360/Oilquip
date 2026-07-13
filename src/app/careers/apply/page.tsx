import ApplyWizard from "@/components/careers/ApplyWizard";

export const metadata = {
  title: "Apply | Oilquip Careers",
  description:
    "Submit a general application to join the Oilquip team. We'll keep your application on file for future opportunities.",
};

export default function GeneralApplyPage() {
  return (
    <div className="bg-steel-950 min-h-screen pt-24 sm:pt-32">
      <ApplyWizard job={null} />
    </div>
  );
}
