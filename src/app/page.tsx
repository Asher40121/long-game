import Link from "next/link";

export default function Home() {
  return (
    <div className="py-16">
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">The deal pipeline that treats the founder relationship as the asset.</h1>
      <Link href="/pipeline" className="mt-6 inline-block text-accent hover:underline">Open the pipeline →</Link>
    </div>
  );
}
