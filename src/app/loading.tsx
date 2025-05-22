
"use client";

import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <PageLoadingSpinner />
    </div>
  );
}
