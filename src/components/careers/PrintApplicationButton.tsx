"use client";

export default function PrintApplicationButton() {
  return (
    <div className="no-print mb-6 flex justify-end">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center px-4 py-2 bg-black text-white rounded font-semibold text-sm"
      >
        Print / Save as PDF
      </button>
    </div>
  );
}
