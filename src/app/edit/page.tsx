import type { Metadata } from "next";
import { Suspense } from "react";
import { TargetEditor } from "@/components/target/TargetEditor";
import { Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Add or edit a company" };

// /edit adds a company; /edit?id=... edits one. Query-string ids keep this working on a static site.
export default function EditPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <TargetEditor />
    </Suspense>
  );
}
