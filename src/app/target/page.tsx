import type { Metadata } from "next";
import { Suspense } from "react";
import { TargetView } from "@/components/target/TargetView";
import { Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Target" };

// The target id comes from the query string (?id=), so this page works on a static site
// for targets a visitor creates. useSearchParams needs a Suspense boundary.
export default function TargetPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <TargetView />
    </Suspense>
  );
}
